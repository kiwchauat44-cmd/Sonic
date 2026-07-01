/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationState, PresetFrequency, WaveformType, MatterType, SimulationLevel } from '../types';
import { Sliders, Volume2, VolumeX, Music, Mic, Layers, Anchor, Circle, Square as SquareIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const FREQUENCY_PRESETS: PresetFrequency[] = [
  {
    frequency: 7.83,
    name: 'Schumann Resonance',
    thaiName: 'การสั่นพ้องชูมันน์',
    description: 'Earth’s electromagnetic field resonance. Deep vibrational state.',
    thaiDescription: 'การสั่นพ้องแม่เหล็กไฟฟ้าของโลก สภาวะการสั่นสะเทือนระดับลึกสูงสุด'
  },
  {
    frequency: 110,
    name: 'A2 Resonance',
    thaiName: 'โน้ตลา (A2)',
    description: 'Perfect modal symmetry on classical metal plates.',
    thaiDescription: 'สมมาตรโหมดแบบสมบูรณ์บนแผ่นโลหะแบบคลาสสิก'
  },
  {
    frequency: 432,
    name: 'Natural Tuning',
    thaiName: 'การจูนธรรมชาติ 432Hz',
    description: 'Cosmic scale frequency. Forms highly harmonic organic shapes.',
    thaiDescription: 'ความถี่การปรับจูนธรรมชาติ สร้างรูปแบบทรงกลมสมมาตรสมดุล'
  },
  {
    frequency: 528,
    name: 'DNA Repair (Solfeggio)',
    thaiName: 'ความถี่ 528Hz (ซ่อมแซม DNA)',
    description: 'Miracle frequency of Solfeggio. Forms sharp hexagonal ring structures.',
    thaiDescription: 'ความถี่มหัศจรรย์โซลเฟจจิโอ ก่อรูปแบบหกเหลี่ยมคริสตัล'
  },
  {
    frequency: 963,
    name: 'Crown Chakra (Solfeggio)',
    thaiName: 'ความถี่ 963Hz (จักระมงกุฎ)',
    description: 'Pure connection to universal geometry. Creates intricate fractals.',
    thaiDescription: 'การเชื่อมต่อเรขาคณิตสากล สร้างลวดลายเศษส่วนที่ซับซ้อนมาก'
  }
];

interface SidebarControlsProps {
  state: SimulationState;
  setState: React.Dispatch<React.SetStateAction<SimulationState>>;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onMicToggle: () => void;
  isSweeping: boolean;
  setIsSweeping: (sweeping: boolean) => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  state,
  setState,
  isCollapsed,
  setIsCollapsed,
  isMuted,
  setIsMuted,
  onMicToggle,
  isSweeping,
  setIsSweeping
}) => {
  const handleFreqChange = (value: number) => {
    setState(prev => ({ ...prev, frequency: Math.max(1, Math.min(20000, value)) }));
  };

  const handleAmpChange = (value: number) => {
    setState(prev => ({ ...prev, amplitude: Math.max(0, Math.min(100, value)) }));
  };

  const handleWaveform = (waveform: WaveformType) => {
    setState(prev => ({ ...prev, waveform }));
  };

  const handleMatterType = (matterType: MatterType) => {
    setState(prev => ({ ...prev, matterType }));
  };

  const handlePlateShape = (shape: 'square' | 'circle') => {
    setState(prev => ({ ...prev, shape: shape as any }));
  };

  const handlePlateMaterial = (plateMaterial: string) => {
    setState(prev => ({ ...prev, plateMaterial }));
  };

  const handleLevel = (level: SimulationLevel) => {
    setState(prev => ({ ...prev, level }));
  };

  return (
    <div 
      className={`relative h-full flex flex-row transition-all duration-300 z-30 ${
        isCollapsed ? 'w-0' : 'w-80'
      }`}
    >
      {/* Content Panel */}
      <div className="w-80 h-full bg-slate-950/85 backdrop-blur-xl border-r border-slate-900 flex flex-col overflow-y-auto overflow-x-hidden p-5 text-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h2 className="text-md font-sans font-semibold tracking-wider text-white uppercase">
            Frequency & Sound Control
          </h2>
        </div>

        {/* 1. FREQUENCY SLIDER */}
        <div className="mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-slate-400">FREQUENCY (ความถี่)</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {state.frequency.toFixed(1)} <span className="text-xs">Hz</span>
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="1200"
            step="0.1"
            value={state.frequency}
            onChange={(e) => handleFreqChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>1 Hz</span>
            <span>600 Hz</span>
            <span>1200 Hz</span>
          </div>
        </div>

        {/* 2. AUDIO SYNTH CONTROLS */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              !isMuted 
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'UNMUTE SYNTH' : 'SYNTH LIVE'}
          </button>

          <button
            onClick={onMicToggle}
            className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              state.micActive
                ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)] animate-pulse'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            {state.micActive ? 'MIC ON' : 'MIC CONTROL'}
          </button>
        </div>

        {/* 3. AMPLITUDE CONTROLS */}
        <div className="mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-slate-400">AMPLITUDE (ความแรง)</span>
            <span className="text-sm font-mono font-bold text-amber-400">{state.amplitude}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.amplitude}
            onChange={(e) => handleAmpChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* 4. WAVEFORM SELECTOR */}
        <div className="mb-6">
          <span className="text-xs font-mono text-slate-400 block mb-2">WAVEFORM (รูปคลื่น)</span>
          <div className="grid grid-cols-2 gap-2">
            {(['sine', 'square', 'triangle', 'sawtooth'] as WaveformType[]).map((wave) => (
              <button
                key={wave}
                onClick={() => handleWaveform(wave)}
                className={`py-1.5 px-2 rounded border text-[11px] font-mono capitalize transition-all ${
                  state.waveform === wave
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {wave}
              </button>
            ))}
          </div>
        </div>

        {/* 5. PLATE TYPE & MATERIAL */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Anchor className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Plate Properties</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => handlePlateShape('square')}
              className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                (state as any).shape !== 'circle'
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <SquareIcon className="w-3.5 h-3.5" />
              SQUARE
            </button>
            <button
              onClick={() => handlePlateShape('circle')}
              className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                (state as any).shape === 'circle'
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              CIRCLE
            </button>
          </div>

          <div className="mb-2">
            <label className="text-[10px] font-mono text-slate-500 block mb-1">MATERIAL (ประเภทแผ่น)</label>
            <select
              value={state.plateMaterial}
              onChange={(e) => handlePlateMaterial(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="brass">Brass Plate (ทองเหลือง)</option>
              <option value="steel">Hard Steel (เหล็กกล้า)</option>
              <option value="glass">Quartz Glass (แก้วควอตซ์)</option>
              <option value="acrylic">Acrylic (อะคริลิก)</option>
            </select>
          </div>
        </div>

        {/* 6. SCALE LEVEL SELECTOR */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Simulation Scale</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['micro', 'meso', 'macro', 'quantum'] as SimulationLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevel(lvl)}
                className={`py-1.5 px-1.5 rounded-lg border text-[10px] font-mono uppercase transition-all ${
                  state.level === lvl
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 6.5 PHYSICS TEST BENCH (แผงทดสอบฟิสิกส์) */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Physics Test Bench</span>
          </div>
          
          {/* Sweep Auto-Tuner */}
          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-900 mb-3 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-300">AUTO-SWEEP (สแกนความถี่)</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isSweeping ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}>
                {isSweeping ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>
            <button
              onClick={() => setIsSweeping(!isSweeping)}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSweeping
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>{isSweeping ? '■ STOP FREQUENCY SWEEP' : '▶ START AUTO FREQUENCY SWEEP'}</span>
            </button>
            <p className="text-[9px] text-slate-500 italic text-center">
              Sweeps 100Hz – 1000Hz to watch matter auto-align
            </p>
          </div>

          {/* Noise level slider */}
          <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
            <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
              <span className="text-slate-400">NOISE DISTURBANCE (คลื่นรบกวน)</span>
              <span className="text-amber-500 font-bold">{state.noiseLevel.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={state.noiseLevel}
              onChange={(e) => setState(prev => ({ ...prev, noiseLevel: parseFloat(e.target.value) }))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* 7. PRESET FREQUENCIES */}
        <div className="mb-4 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Resonant Presets</span>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {FREQUENCY_PRESETS.map((preset) => (
              <button
                key={preset.frequency}
                onClick={() => {
                  handleFreqChange(preset.frequency);
                  setState(prev => ({ ...prev, amplitude: 65 })); // Set a default solid amplitude
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs flex flex-col transition-all ${
                  Math.abs(state.frequency - preset.frequency) < 0.1
                    ? 'bg-pink-500/10 border-pink-500 text-pink-300 shadow-inner'
                    : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:bg-slate-900/50 hover:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-sans font-semibold text-slate-200 group-hover:text-pink-300">
                    {preset.name}
                  </span>
                  <span className="font-mono text-pink-400 font-bold">{preset.frequency} Hz</span>
                </div>
                <span className="text-[10px] leading-relaxed text-slate-500 italic">
                  {preset.description}
                </span>
                <span className="text-[9px] leading-relaxed text-slate-600 mt-0.5">
                  {preset.thaiDescription}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collapse Handle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -translate-y-1/2 -right-6 w-6 h-16 bg-slate-950/90 hover:bg-cyan-950/95 border border-l-0 border-slate-800 hover:border-cyan-800/80 rounded-r-md text-slate-400 hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-all shadow-xl z-20 group"
        title={isCollapsed ? "Expand Frequency Panel" : "Collapse Frequency Panel"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 group-hover:scale-125 transition-transform" />
        ) : (
          <ChevronLeft className="w-4 h-4 group-hover:scale-125 transition-transform" />
        )}
      </button>
    </div>
  );
};
