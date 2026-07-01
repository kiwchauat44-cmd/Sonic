/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WaveformType } from '../types';

class CymaticAudioController {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  
  private isMuted: boolean = true;
  private currentFreq: number = 432;
  private currentWaveform: WaveformType = 'sine';
  private currentVolume: number = 0.3; // 0 to 1

  constructor() {
    // Lazy-loaded context to comply with browser autocomplete policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.updateSynth();
  }

  public updateSynthParams(frequency: number, waveform: WaveformType, amplitude: number) {
    this.currentFreq = frequency;
    this.currentWaveform = waveform;
    this.currentVolume = (amplitude / 100) * 0.15; // keep it safe and pleasant
    this.updateSynth();
  }

  private updateSynth() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.isMuted) {
        this.stopOscillator();
        return;
      }

      // Initialize nodes if they don't exist
      if (!this.gain) {
        this.gain = this.ctx.createGain();
        this.gain.connect(this.ctx.destination);
      }

      if (!this.osc) {
        this.osc = this.ctx.createOscillator();
        this.osc.connect(this.gain);
        this.osc.start();
      }

      // Ramp smoothly to avoid pops and clicks
      const t = this.ctx.currentTime;
      this.osc.frequency.setValueAtTime(this.currentFreq, t);
      this.osc.type = this.currentWaveform;
      this.gain.gain.linearRampToValueAtTime(this.currentVolume, t + 0.05);

    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  private stopOscillator() {
    if (this.gain && this.ctx) {
      this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
    }
    // We can keep the oscillator running at 0 gain to prevent constant recreation,
    // or stop it if requested. Let's just keep gain at 0 for instant resume!
  }

  // --- MICROPHONE / VOICE INPUT PITCH DETECTION ---
  public async startMicrophone(onFrequencyDetected: (freq: number, volume: number) => void, onError: (err: any) => void) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.micSource.connect(this.analyser);

      const bufferLength = this.analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);

      const detectPitch = () => {
        if (!this.analyser) return;
        this.analyser.getFloatTimeDomainData(dataArray);

        // Autocorrelation algorithm for frequency detection
        const { frequency, volume } = this.autoCorrelate(dataArray, this.ctx!.sampleRate);
        
        if (frequency > -1 && volume > 0.005) {
          // Send frequency back to simulator
          onFrequencyDetected(frequency, volume);
        }
        
        this.animationFrameId = requestAnimationFrame(detectPitch);
      };

      detectPitch();
    } catch (err) {
      console.error('Error starting mic:', err);
      onError(err);
    }
  }

  public stopMicrophone() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
  }

  // Fast autocorrelation implementation for real-time voice pitch detection
  private autoCorrelate(buffer: Float32Array, sampleRate: number): { frequency: number; volume: number } {
    let SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      let val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    
    // Insufficient volume
    if (rms < 0.005) {
      return { frequency: -1, volume: rms };
    }

    // Trim buffer to find actual pitch cycle range
    let r1 = 0, r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = SIZE - 1; i >= SIZE / 2; i--) {
      if (Math.abs(buffer[i]) < thres) { r2 = i; break; }
    }

    const trimmedBuffer = buffer.subarray(r1, r2);
    const len = trimmedBuffer.length;
    const c = new Float32Array(len);
    
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i; j++) {
        c[i] = c[i] + trimmedBuffer[j] * trimmedBuffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < len; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    // Parabolic interpolation for pitch resolution refinement
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    const detectedFreq = sampleRate / T0;
    
    // Clamp to human voicing frequencies (e.g. 50 Hz to 2000 Hz)
    if (detectedFreq > 50 && detectedFreq < 2000) {
      return { frequency: detectedFreq, volume: rms };
    }

    return { frequency: -1, volume: rms };
  }

  // Get current state
  public isMutedState(): boolean {
    return this.isMuted;
  }
}

export const cymaticAudio = new CymaticAudioController();
