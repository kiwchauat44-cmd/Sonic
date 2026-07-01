/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SimulationState, PatternAnalysisMetrics } from '../types';
import { BarChart, Percent, Activity, Share2, Save, Play, Square, Camera, ArrowDownToLine, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPanelProps {
  state: SimulationState;
  setState: React.Dispatch<React.SetStateAction<SimulationState>>;
  metrics: PatternAnalysisMetrics;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  state,
  setState,
  metrics,
  isCollapsed,
  setIsCollapsed
}) => {
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [newPresetName, setNewPresetName] = useState<string>('');
  
  // Real-time graph history state
  const [velocityHistory, setVelocityHistory] = useState<number[]>([]);
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);

  // Video recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Fetch LocalStorage presets
  useEffect(() => {
    const raw = localStorage.getItem('cymatic_presets');
    if (raw) {
      try {
        setSavedPresets(JSON.parse(raw));
      } catch (e) {
        console.warn('Could not parse presets from local storage:', e);
      }
    }
  }, []);

  // Track histories for the mini-graphs
  useEffect(() => {
    if (state.isPaused) return;
    const interval = setInterval(() => {
      setVelocityHistory(prev => {
        const next = [...prev, metrics.averageVelocity * 450];
        if (next.length > 30) next.shift();
        return next;
      });
      setEnergyHistory(prev => {
        const next = [...prev, (state.amplitude / 100) * (metrics.resonanceMatching / 100) * 100];
        if (next.length > 30) next.shift();
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [metrics.averageVelocity, state.amplitude, metrics.resonanceMatching, state.isPaused]);

  // Save preset
  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    const item = {
      name: newPresetName,
      frequency: state.frequency,
      amplitude: state.amplitude,
      waveform: state.waveform,
      matterType: state.matterType,
      shape: (state as any).shape || 'square',
      plateMaterial: state.plateMaterial,
      level: state.level
    };
    const updated = [...savedPresets, item];
    setSavedPresets(updated);
    localStorage.setItem('cymatic_presets', JSON.stringify(updated));
    setNewPresetName('');
  };

  // Delete preset
  const handleDeletePreset = (idx: number) => {
    const updated = savedPresets.filter((_, i) => i !== idx);
    setSavedPresets(updated);
    localStorage.setItem('cymatic_presets', JSON.stringify(updated));
  };

  // Load preset
  const handleLoadPreset = (preset: any) => {
    setState(prev => ({
      ...prev,
      frequency: preset.frequency,
      amplitude: preset.amplitude,
      waveform: preset.waveform,
      matterType: preset.matterType,
      shape: preset.shape || 'square',
      plateMaterial: preset.plateMaterial || 'brass',
      level: preset.level || 'macro'
    }));
  };

  // Export Screenshot (PNG)
  const handleScreenshot = () => {
    const canvas = document.querySelector(`#cymatics-canvas-${state.id}`) as HTMLCanvasElement | null;
    if (!canvas) return;
    
    // Save as PNG
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `cymatics_${state.frequency.toFixed(1)}hz_${state.matterType}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Export Numerical Data (JSON)
  const handleExportJSON = () => {
    const configData = {
      timestamp: new Date().toISOString(),
      state,
      metrics
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cymatics_data_${state.frequency.toFixed(1)}hz.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Canvas Real WebM Video Recording
  const startRecording = () => {
    const canvas = document.querySelector(`#cymatics-canvas-${state.id}`) as HTMLCanvasElement | null;
    if (!canvas) return;

    recordedChunks.current = [];
    // Capture canvas stream at 30 FPS
    const stream = (canvas as any).captureStream(30);
    const options = { mimeType: 'video/webm; codecs=vp9' };
    
    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      // Fallback for Safari/Firefox
      mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cymatics_${state.frequency.toFixed(1)}hz.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);

    // Auto-record for 5 seconds
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, 5000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div 
      className={`relative h-full flex flex-row transition-all duration-300 z-30 ${
        isCollapsed ? 'w-0' : 'w-80'
      }`}
    >
      {/* Collapse Handle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -translate-y-1/2 -left-6 w-6 h-16 bg-slate-950/90 hover:bg-cyan-950/95 border border-r-0 border-slate-800 hover:border-cyan-800/80 rounded-l-md text-slate-400 hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-all shadow-xl z-20 group"
        title={isCollapsed ? "Expand Science Panel" : "Collapse Science Panel"}
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4 group-hover:scale-125 transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 group-hover:scale-125 transition-transform" />
        )}
      </button>

      {/* Content Panel */}
      <div className="w-80 h-full bg-slate-950/85 backdrop-blur-xl border-l border-slate-900 flex flex-col overflow-y-auto overflow-x-hidden p-5 text-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <BarChart className="w-5 h-5 text-indigo-400" />
          <h2 className="text-md font-sans font-semibold tracking-wider text-white uppercase">
            Scientific Analysis
          </h2>
        </div>

        {/* 1. MATH & PHYSICS METRICS */}
        <div className="space-y-4 mb-6 bg-slate-900/30 p-4 rounded-xl border border-slate-900">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              Symmetry Index (สมมาตร)
            </span>
            <span className="font-mono font-bold text-indigo-300">{metrics.symmetryScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-600 to-indigo-400 h-full transition-all duration-500"
              style={{ width: `${metrics.symmetryScore}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Fractal Dimension (มิติเศษส่วน)
            </span>
            <span className="font-mono font-bold text-cyan-300">{metrics.fractalDimension} <span className="text-[10px] text-slate-500">D</span></span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${((metrics.fractalDimension - 1.0) / 1.0) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Resonance Match (สั่นพ้อง)
            </span>
            <span className="font-mono font-bold text-emerald-300">{metrics.resonanceMatching}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${metrics.resonanceMatching}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-3 mt-3">
            <div>
              <p>NODE LINES (จำนวนโหนด)</p>
              <p className="text-slate-300 font-bold text-xs">{metrics.nodeLinesCount}</p>
            </div>
            <div>
              <p>PARTICLE SPEED (ความเร็ว)</p>
              <p className="text-slate-300 font-bold text-xs">{(metrics.averageVelocity * 1000).toFixed(0)} mm/s</p>
            </div>
          </div>
        </div>

        {/* 2. REAL-TIME MINI GRAPHS */}
        <div className="mb-6">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wide">Vibrational Graphs</span>
          
          {/* Velocity distribution */}
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-900 mb-3">
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>Velocity Over Time</span>
              <span className="text-indigo-400">{(metrics.averageVelocity * 1000).toFixed(0)} mm/s</span>
            </div>
            <div className="h-16 w-full flex items-end">
              <svg className="w-full h-full text-indigo-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  points={velocityHistory.map((v, i) => `${(i / Math.max(1, velocityHistory.length - 1)) * 100},${Math.max(1, Math.min(29, 30 - v))}`).join(' ')}
                />
              </svg>
            </div>
          </div>

          {/* Resonance intensity history */}
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-900">
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>Energy Accumulation</span>
              <span className="text-emerald-400">{(metrics.resonanceMatching).toFixed(0)}%</span>
            </div>
            <div className="h-16 w-full flex items-end">
              <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  points={energyHistory.map((v, i) => `${(i / Math.max(1, energyHistory.length - 1)) * 100},${Math.max(1, Math.min(29, 30 - v * 0.3))}`).join(' ')}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. LOCAL STORAGE PRESET MANAGER */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-slate-400 uppercase tracking-wide">
            <Save className="w-4 h-4 text-emerald-400" />
            <span>My Cymatic Presets</span>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Preset Name (ชื่อห้องแล็บ)..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSavePreset}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
            >
              SAVE
            </button>
          </div>

          {savedPresets.length === 0 ? (
            <p className="text-[10px] text-slate-600 italic text-center py-2">No custom presets saved. (ไม่มีค่าที่บันทึก)</p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {savedPresets.map((preset, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/35 border border-slate-900 hover:border-slate-800 rounded px-2 py-1.5 flex justify-between items-center text-[11px]"
                >
                  <button
                    onClick={() => handleLoadPreset(preset)}
                    className="flex-1 text-left font-sans truncate text-slate-300 hover:text-cyan-400 font-medium"
                  >
                    {preset.name} <span className="font-mono text-[9px] text-slate-500 ml-1">({preset.frequency}Hz)</span>
                  </button>
                  <button
                    onClick={() => handleDeletePreset(idx)}
                    className="text-red-400 hover:text-red-500 font-mono font-bold text-[10px] pl-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. DATA EXPORTS */}
        <div className="mb-4 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-slate-400 uppercase tracking-wide">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Export & Recording</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleScreenshot}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white flex items-center justify-between text-xs font-mono transition-colors"
            >
              <span className="flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Take Snapshot
              </span>
              <span className="text-[10px] text-slate-500">PNG</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white flex items-center justify-between text-xs font-mono transition-colors"
            >
              <span className="flex items-center gap-2">
                <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-400" />
                Export Simulation Data
              </span>
              <span className="text-[10px] text-slate-500">JSON</span>
            </button>

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-full py-2 px-3 rounded-lg bg-red-950/40 border border-red-500 text-red-200 flex items-center justify-between text-xs font-mono animate-pulse"
              >
                <span className="flex items-center gap-2 font-bold">
                  <Square className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  Recording... Stop Video
                </span>
                <span className="text-[10px] text-red-500">WEBM</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white flex items-center justify-between text-xs font-mono transition-colors"
                title="Records 5 seconds of the simulation directly from canvas"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  Record 5s Simulation
                </span>
                <span className="text-[10px] text-slate-500">WEBM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
