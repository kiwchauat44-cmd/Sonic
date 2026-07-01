/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SimulationState, PresetFrequency, WaveformType, MatterType, SimulationLevel } from '../types';
import { Sliders, Volume2, VolumeX, Music, Mic, Layers, Anchor, Circle, Square as SquareIcon, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

export const FREQUENCY_PRESETS: PresetFrequency[] = [
  {
    frequency: 7.83,
    name: 'Schumann Resonance',
    thaiName: 'การสั่นพ้องชูมันน์',
    description: 'Earth’s electromagnetic field resonance. Deep vibrational state.',
    thaiDescription: 'การสั่นพ้องแม่เหล็กไฟฟ้าของโลก สภาวะการสั่นสะเทือนระดับลึกสูงสุด'
  },
  {
    frequency: 340,
    name: 'Mage Pentagram (ดาว 5 แฉก)',
    thaiName: 'ดาวห้าแฉกแห่งเวทมนตร์',
    description: 'Forms a perfect 5-pointed magic star starburst of European geometry.',
    thaiDescription: 'สร้างรูปทรงดาว 5 แฉก เรขาคณิตเวทมนตร์ยุโรปโบราณที่สมมาตรอย่างน่าอัศจรรย์'
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
    frequency: 612,
    name: 'Solomon Hexagram (ดาว 6 แฉก)',
    thaiName: 'ตราหกแฉกแห่งโซโลมอน',
    description: 'Forms a pristine 6-pointed star / Star of David or snowflake.',
    thaiDescription: 'สร้างตราดาว 6 แฉกโบราณ (Hexagram) หรือลวดลายผลึกหิมะที่งดงามและสมบูรณ์'
  },
  {
    frequency: 880,
    name: 'Alchemical Octagram (8 แฉก)',
    thaiName: 'ตราแปดแฉกเล่นแร่แปรธาตุ',
    description: 'Intricate 8-pointed star burst mandala of sacred geometry.',
    thaiDescription: 'สร้างมณฑลศักดิ์สิทธิ์แบบดาว 8 แฉกที่ซับซ้อนตามลวดลายเล่นแร่แปรธาตุโบราณ'
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
    setState(prev => ({ 
      ...prev, 
      frequency: Math.max(1, Math.min(20000, value)),
      geometricMode: 'none'
    }));
  };

  const handleAmpChange = (value: number) => {
    setState(prev => ({ 
      ...prev, 
      amplitude: Math.max(0, Math.min(100, value)),
      geometricMode: 'none'
    }));
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

  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      className="fixed lg:relative left-0 top-0 h-full flex flex-row z-40 lg:z-30"
      initial={false}
      animate={{
        x: isCollapsed ? (isMobile ? -320 : 0) : 0,
        width: isCollapsed ? (isMobile ? 0 : 0) : (isMobile ? 290 : 320),
      }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
    >
      {/* Content Panel */}
      <div className="w-[290px] sm:w-80 h-full bg-slate-950/90 backdrop-blur-xl border-r border-slate-900 flex flex-col overflow-y-auto overflow-x-hidden p-4 sm:p-5 text-slate-200 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h2 className="text-md font-sans font-semibold tracking-wider text-white uppercase">
            Frequency & Sound Control
          </h2>
        </div>

        {/* 1. FREQUENCY SLIDER */}
        <div className="mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-slate-400">FREQUENCY (ปรับความถี่เสียง)</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {state.frequency.toFixed(1)} <span className="text-xs">Hz</span>
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="1500"
            step="0.1"
            value={state.frequency}
            onChange={(e) => handleFreqChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0 Hz</span>
            <span>750 Hz</span>
            <span>1500 Hz (สูงสุด)</span>
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

        {/* 4.5 COLOR PALETTE SWITCHER (เลือกธีมสี) */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Color Theme Palette</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'neon', label: 'Neon Glow (เรืองแสง)', desc: 'Vibrant neon colors', color: 'from-pink-500 to-cyan-500' },
              { id: 'monochrome', label: 'Monochrome (ขาวดำ)', desc: 'Elegant silver & white', color: 'from-slate-400 to-white' },
              { id: 'heatmap', label: 'Heatmap (แผนที่ความร้อน)', desc: 'Thermal wave density', color: 'from-blue-600 via-red-500 to-yellow-400' },
              { id: 'nature', label: 'Nature (ธรรมชาติ)', desc: 'Forest, teal & warm gold', color: 'from-emerald-500 to-amber-500' }
            ].map((pal) => (
              <button
                key={pal.id}
                onClick={() => setState(prev => ({ ...prev, colorPalette: pal.id as any }))}
                className={`p-2 rounded-lg border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  state.colorPalette === pal.id
                    ? 'bg-slate-900 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {/* Visual indicator bar */}
                <div className={`h-1 w-full rounded bg-gradient-to-r ${pal.color} mb-1.5`} />
                <div className="text-[10px] font-sans font-bold leading-tight">{pal.label}</div>
                <div className="text-[8.5px] font-mono text-slate-500 leading-none mt-0.5">{pal.desc}</div>
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
          <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900/60 mb-3">
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

          {/* Pulse Animation Toggle */}
          <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-300 font-semibold">PULSE ANIMATION</span>
              <span className="text-[9px] text-slate-500 leading-none mt-0.5">เต้นกระพริบตามแอมพลิจูดเสียง</span>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, pulseAnimation: !prev.pulseAnimation }))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                state.pulseAnimation
                  ? 'bg-pink-500/10 border-pink-500 text-pink-400 font-bold'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {state.pulseAnimation ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* 6.8 GEOMETRIC MODE CONTROLLER (โหมดเรขาคณิตสัจจะและพลังงานเสียง) */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">🌀</span>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Geometric Mode (เรขาคณิตคลื่นเสียง)</span>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 space-y-3.5">
            <div className="text-[11px] text-slate-300 leading-relaxed">
              เลือกรูปแบบเรขาคณิตศักดิ์สิทธิ์เพื่อปรับความถี่เสียง (Frequency) และแอมพลิจูด (Amplitude) โดยอัตโนมัติ เพื่อดูโครงสร้างการจัดเรียงตัวของสสารเมื่อเข้าสู่ความถี่สั่นพ้องนั้นๆ
            </div>

            {/* Grid Selectors */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { key: 'schumann', name: '🌀 Schumann Concentric (7.83 Hz)', thaiName: 'ชีพจรโลกกลมศูนย์กลางร่วม', freq: 7.83, amp: 90, shape: 'circle' as const },
                { key: 'star-5', name: '🌟 Star-5 Pentagram (340 Hz)', thaiName: 'ดาวเวทมนตร์ 5 แฉกตะวันตก', freq: 340, amp: 75, shape: 'circle' as const },
                { key: 'flower-of-life', name: '🌸 Flower of Life (432 Hz)', thaiName: 'ดอกไม้แห่งชีวิต / สมานฉันท์', freq: 432, amp: 80, shape: 'circle' as const },
                { key: 'hexagonal-grid', name: '🕸️ Hexagonal Grid (528 Hz)', thaiName: 'โครงข่ายผลึกหกเหลี่ยมเซลล์', freq: 528, amp: 85, shape: 'square' as const },
                { key: 'star-6', name: '✡️ Star-6 Hexagram (612 Hz)', thaiName: 'ตราดาว 6 แฉกแห่งโซโลมอน', freq: 612, amp: 80, shape: 'square' as const },
                { key: 'star-8', name: '☸️ Star-8 Octagram (880 Hz)', thaiName: 'ดารารัศมีแปดทิศจูนพลังงาน', freq: 880, amp: 85, shape: 'circle' as const },
                { key: 'crown-chakra', name: '🌐 Crown Chakra Fractal (963 Hz)', thaiName: 'จักระมงกุฎพันกลีบสากล', freq: 963, amp: 90, shape: 'circle' as const }
              ].map((geom) => {
                const isActive = state.geometricMode === geom.key;
                return (
                  <button
                    key={geom.key}
                    onClick={() => {
                      setState(prev => ({
                        ...prev,
                        frequency: geom.freq,
                        amplitude: geom.amp,
                        shape: geom.shape,
                        geometricMode: geom.key
                      }));
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-center cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                        : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-sans font-bold text-[11px] leading-tight">
                        {geom.name}
                      </span>
                      <span className={`font-mono text-[9px] px-1 py-0.5 rounded ${
                        isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {isActive ? 'ACTIVE' : 'SELECT'}
                      </span>
                    </div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5 leading-none">
                      {geom.thaiName} &bull; Plate: {geom.shape.toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Alignment Explainer card */}
            {state.geometricMode !== 'none' && (
              <div className="border-t border-slate-850 pt-3 mt-1 animate-fade-in">
                <span className="text-[10px] font-mono text-cyan-400 block mb-1.5 font-bold uppercase tracking-wider">
                  🧪 การเปรียนรูปแบบของสสาร (Matter Alignment):
                </span>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/30 text-[10px] leading-relaxed text-slate-300 space-y-1.5">
                  {state.geometricMode === 'schumann' && (
                    <>
                      <p><strong>TH:</strong> สสารจัดเรียงตัวเป็นวงแหวนร่วมศูนย์กลางสมบูรณ์ พริ้วไหวเป็นระลอกคลื่นที่แผ่ขยาย มั่นคงดั่งชีพจรสั่นพ้องแม่เหล็กไฟฟ้าของโลก</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Organizes into perfect concentric circular ripple rings that oscillate gracefully like the Earth's electromagnetic heartbeat.</p>
                    </>
                  )}
                  {state.geometricMode === 'star-5' && (
                    <>
                      <p><strong>TH:</strong> มวลสสารวิ่งหนีจากบริเวณที่สั่นไหวและเรียงตัวอย่างสมดุลเป็นดาว 5 แฉก มีแง่แหลมเด่นชัดและสลายตัวไปรอบทิศทางได้อย่างพอดี</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Particles drift away from high-vibe areas and settle neatly into a beautiful, sharp 5-pointed geometric starburst.</p>
                    </>
                  )}
                  {state.geometricMode === 'flower-of-life' && (
                    <>
                      <p><strong>TH:</strong> ก่อตัวเป็นกลีบดอกไม้ประสานเกลียวซ้อนกลีบระนาบโค้งแบบธรรมชาติอย่างประณีต สะท้อนแบบแผนสากลของความกลมกลืนธรรมชาติและพลังงานคอสมิก</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Generates beautiful intersecting circular rosette petals where particles align in a perfectly balanced matrix representing universal flow.</p>
                    </>
                  )}
                  {state.geometricMode === 'hexagonal-grid' && (
                    <>
                      <p><strong>TH:</strong> สสารจับกลุ่มเป็นรวงตาข่ายหกเหลี่ยมคริสตัลคล้ายโมเลกุลผลึกน้ำ แข็งแกร่งสม่ำเสมอ แผ่กระจายตัวสร้างระเบียบแถวอย่างสมบูรณ์แบบ</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Snaps into a highly stable and sharp honeycomb hexagonal crystalline lattice, showing how cells respond to the healing Solfeggio scale.</p>
                    </>
                  )}
                  {state.geometricMode === 'star-6' && (
                    <>
                      <p><strong>TH:</strong> จัดระเบียบแถวเป็นดาวหกแฉกอันศักดิ์สิทธิ์หรือตราแห่งโซโลมอน และส่วนปลายแผ่กิ่งก้านเป็นสมมาตรผลึกน้ำแข็งหรือเกล็ดหิมะที่สมบูรณ์</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Aligns into a highly defined 6-pointed star or complex snowflake symmetry, with particles settling cleanly into calm nodal corridors.</p>
                    </>
                  )}
                  {state.geometricMode === 'star-8' && (
                    <>
                      <p><strong>TH:</strong> สสารละเอียดเกาะกลุ่มเป็นลายสี่ทิศแปดด้านรัศมีพาดตัดไขว้กัน สร้างระนาบวงล้อพลังงานเล่นแร่แปรธาตุที่แผ่รัศมีความถี่คงที่รอบตัว</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Crystallizes into an intricate 8-pointed alchemical mandala, demonstrating extreme spatial geometric stabilization across high-frequency nodes.</p>
                    </>
                  )}
                  {state.geometricMode === 'crown-chakra' && (
                    <>
                      <p><strong>TH:</strong> ก่อรูปแบบโครงตาข่ายระดับเศษส่วน (Fractals) ซับซ้อนนับพันกลีบ กระตุ้นพลังงานรอบตัวให้ส่องแสงเรืองรองดั่งจักระมงกุฎเชื่อมโยงจิตวิญญาณ</p>
                      <p className="text-slate-500 italic"><strong>EN:</strong> Particles condense into fine, highly dense fractal lines resembling a thousand-petal lotus structure, forming a complex holographic network.</p>
                    </>
                  )}
                </div>
              </div>
            )}

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
    </motion.div>
  );
};
