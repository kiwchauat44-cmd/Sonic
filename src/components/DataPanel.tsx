/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationState, PatternAnalysisMetrics } from '../types';
import { BarChart, Percent, Activity, Share2, Save, Play, Square, Camera, ArrowDownToLine, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface DataPanelProps {
  state: SimulationState;
  setState: React.Dispatch<React.SetStateAction<SimulationState>>;
  metrics: PatternAnalysisMetrics;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

// Framer motion animated number transition helper
const AnimatedValue: React.FC<{ value: string | number; id: string }> = ({ value, id }) => {
  return (
    <span className="inline-flex overflow-hidden relative h-[1.2em] items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="font-mono font-bold"
          layoutId={`${id}-${value}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

interface GeometryInfo {
  name: string;
  thaiName: string;
  shapeType: string;
  sides: number;
  description: string;
  thaiDescription: string;
  resonanceClass: string;
}

// Maps active frequency to its designated sacred/Chladni geometric shape
const getGeometryInfo = (f: number, shape: 'square' | 'circle'): GeometryInfo => {
  if (Math.abs(f - 7.83) < 1.0) {
    return {
      name: 'Schumann Ground Ring',
      thaiName: 'ระลอกคลื่นแม่เหล็กโลกชูมันน์',
      shapeType: 'circle-concentric',
      sides: 0,
      description: 'Concentric cosmic spheres pulsing at earth electromagnetic resonance.',
      thaiDescription: 'วงแหวนศูนย์ร่วมสั่นสอดประสานสนามแม่เหล็กโลกชูมันน์',
      resonanceClass: 'Low Frequency Standing Wave'
    };
  }
  if (Math.abs(f - 340) < 5.0) {
    return {
      name: 'Mage Pentagram (5-pointed star)',
      thaiName: 'ดาวห้าแฉกเรขาคณิตเวทมนตร์',
      shapeType: 'star-5',
      sides: 5,
      description: 'Forms a pristine 5-pointed magic star. Perfectly balanced angles.',
      thaiDescription: 'การเรียงตัวเป็นดาว 5 แฉกที่สอดรับด้วยขอบและมุมสมดุลพิเศษ',
      resonanceClass: 'Pentagonal Symmetry'
    };
  }
  if (Math.abs(f - 432) < 5.0) {
    return {
      name: 'Harmonic Flower Mandala',
      thaiName: 'มณฑลดอกไม้ธรรมชาติ 432Hz',
      shapeType: 'flower-of-life',
      sides: 12,
      description: 'Cosmic natural scale. Highly detailed organic nested circles.',
      thaiDescription: 'รูปแบบทรงเรขาคณิตดอกไม้แห่งชีวิต (Flower of Life) ออร์แกนิก',
      resonanceClass: 'Sacred Natural Geometry'
    };
  }
  if (Math.abs(f - 528) < 5.0) {
    return {
      name: 'DNA Hexagonal Crystal',
      thaiName: 'ผลึกคริสตัลหกเหลี่ยมเยียวยา',
      shapeType: 'hexagon-crystal',
      sides: 6,
      description: 'Miracle Solfeggio. Forms highly defined concentric hexagons.',
      thaiDescription: 'ตาข่ายรังผึ้งหกเหลี่ยมคริสตัลความแม่นยำสูง เพื่อการซ่อมแซมเยียวยา',
      resonanceClass: 'Hexagonal Solfeggio Pattern'
    };
  }
  if (Math.abs(f - 612) < 5.0) {
    return {
      name: 'Solomon Hexagram (6-pointed star)',
      thaiName: 'ตราดาวหกแฉกแห่งโซโลมอน',
      shapeType: 'star-6',
      sides: 6,
      description: 'Pristine 6-pointed star of David configuration with outer halo.',
      thaiDescription: 'ตราดาว 6 แฉก (Hexagram) ร่วมกับวงแหวนชั้นนอกสมดุลเต็มสูตร',
      resonanceClass: 'Hexagrammic Boundary State'
    };
  }
  if (Math.abs(f - 880) < 5.0) {
    return {
      name: 'Alchemical Octagram Mandala',
      thaiName: 'มณฑลแปดแฉกเล่นแร่แปรธาตุ',
      shapeType: 'star-8',
      sides: 8,
      description: 'Intricate 8-pointed geometric starburst of alchemical matrix.',
      thaiDescription: 'สร้างลวดลายมณฑลดาวแปดแฉกซ้อนทับตาข่ายแรงสั่นสะเทือนถี่สูง',
      resonanceClass: 'Octagonal High Resonance'
    };
  }
  if (Math.abs(f - 963) < 5.0) {
    return {
      name: 'Crown Chakra Fractal Network',
      thaiName: 'ตาข่ายแฟร็กทัลจักระมงกุฎ',
      shapeType: 'fractal-crown',
      sides: 16,
      description: 'Ultimate connection to cosmic geometry. Forms high-density fractal points.',
      thaiDescription: 'การประสานระดับยอดสั่นพ้องระลอกความถี่สูงสุด เป็นเศษส่วนวิจิตรตระการตา',
      resonanceClass: 'Hyper-Symmetric Chakra State'
    };
  }

  // Dynamic calculation for other frequencies
  const sides = Math.max(3, (Math.round(Math.sqrt(f)) % 8) + 3);
  let name = `${sides}-Sided Polygon Lattice`;
  let thaiName = `โครงข่ายสมมาตรหลายเหลี่ยม ${sides} ด้าน`;
  let shapeType = `polygon-${sides}`;
  
  if (f < 100) {
    name = 'Concentric Sound Ripple';
    thaiName = 'ระลอกคลื่นสั่นพ้องวงกลมเดี่ยว';
    shapeType = 'concentric-ripple';
  } else if (f >= 1500) {
    name = 'High-Frequency Wave Interference';
    thaiName = 'ตารางแทรกสอดคลื่นความถี่สูงพิเศษ';
    shapeType = 'hyper-interference';
  }

  return {
    name,
    thaiName,
    shapeType,
    sides,
    description: `Active resonance pattern forms a highly structured shape with ${sides} nodal coordinates.`,
    thaiDescription: `รูปแบบคลื่นที่หนาแน่นทำให้วัตถุเคลื่อนเข้าหาแกนแนวสมมาตรหลักจำนวน ${sides} แกน`,
    resonanceClass: f < 100 ? 'Basal Standing Wave' : f >= 1500 ? 'Quantum Multi-interference Field' : 'Dynamic Chladni Lattice'
  };
};

// SVG visual morpher representing matter alignment in real time
const GeometryVisualizer: React.FC<{ info: GeometryInfo; palette: string; isPaused: boolean; frequency: number }> = ({ info, palette, isPaused, frequency }) => {
  const getStrokeColor = () => {
    switch (palette) {
      case 'monochrome': return '#f1f5f9';
      case 'heatmap': return '#f97316';
      case 'nature': return '#10b981';
      case 'neon':
      default: return '#22d3ee';
    }
  };

  const color = getStrokeColor();
  const numPoints = info.sides > 0 ? info.sides : 6;
  
  const getRegPoints = (sides: number, radius: number, isStar = false) => {
    const pts = [];
    const totalPts = isStar ? sides * 2 : sides;
    for (let i = 0; i < totalPts; i++) {
      const angle = (i * Math.PI * 2) / totalPts - Math.PI / 2;
      const r = isStar ? (i % 2 === 0 ? radius : radius * 0.4) : radius;
      const x = 50 + Math.cos(angle) * r;
      const y = 50 + Math.sin(angle) * r;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  const rotDuration = Math.max(10, 80 - Math.min(65, frequency * 0.15));

  const renderShapeContent = () => {
    switch (info.shapeType) {
      case 'circle-concentric':
      case 'concentric-ripple':
        return (
          <>
            <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="1" strokeDasharray="2,2" fill="none" />
            <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1" strokeDasharray="4,2" fill="none" />
          </>
        );
      case 'star-5':
        return (
          <>
            <polygon points={getRegPoints(5, 38, true)} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="15" stroke={color} strokeWidth="0.75" strokeDasharray="3,3" fill="none" />
            <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4" />
          </>
        );
      case 'hexagon-crystal':
        return (
          <>
            <polygon points={getRegPoints(6, 36, false)} stroke={color} strokeWidth="1.5" fill="none" />
            <polygon points={getRegPoints(6, 20, false)} stroke={color} strokeWidth="1" strokeDasharray="3,1" fill="none" />
            {Array.from({ length: 3 }).map((_, i) => {
              const angle = (i * Math.PI) / 3;
              const x1 = 50 + Math.cos(angle) * 36;
              const y1 = 50 + Math.sin(angle) * 36;
              const x2 = 50 - Math.cos(angle) * 36;
              const y2 = 50 - Math.sin(angle) * 36;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.75" opacity="0.6" />;
            })}
          </>
        );
      case 'star-6':
        return (
          <>
            <polygon points={getRegPoints(3, 38, false)} stroke={color} strokeWidth="1.5" fill="none" />
            <polygon 
              points={getRegPoints(3, 38, false)} 
              stroke={color} 
              strokeWidth="1.5" 
              fill="none" 
              transform="rotate(180, 50, 50)"
            />
            <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="0.75" strokeDasharray="3,3" fill="none" />
            <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4" />
          </>
        );
      case 'star-8':
        return (
          <>
            <polygon points={getRegPoints(8, 38, true)} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="26" stroke={color} strokeWidth="0.75" strokeDasharray="4,2" fill="none" />
            <polygon points={getRegPoints(8, 18, true)} stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
          </>
        );
      case 'flower-of-life':
        return (
          <>
            <circle cx="50" cy="50" r="16" stroke={color} strokeWidth="1" fill="none" />
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * Math.PI) / 3;
              const cx = 50 + Math.cos(angle) * 16;
              const cy = 50 + Math.sin(angle) * 16;
              return <circle key={i} cx={cx} cy={cy} r="16" stroke={color} strokeWidth="0.75" fill="none" opacity="0.8" />;
            })}
            <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="1.25" fill="none" />
            <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />
          </>
        );
      case 'fractal-crown':
        return (
          <>
            <polygon points={getRegPoints(12, 38, true)} stroke={color} strokeWidth="1.25" fill="none" strokeLinejoin="round" />
            <polygon points={getRegPoints(6, 26, true)} stroke={color} strokeWidth="0.75" fill="none" strokeLinejoin="round" opacity="0.8" />
            <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="15" stroke={color} strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * Math.PI) / 6;
              const x = 50 + Math.cos(angle) * 32;
              const y = 50 + Math.sin(angle) * 32;
              return <circle key={i} cx={x} cy={y} r="1" fill={color} />;
            })}
          </>
        );
      case 'hyper-interference':
        return (
          <>
            <rect x="15" y="15" width="70" height="70" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="0.75" fill="none" />
            <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="1.25" strokeDasharray="5,3" fill="none" />
            <circle cx="50" cy="50" r="15" stroke={color} strokeWidth="0.5" fill="none" />
            <line x1="15" y1="50" x2="85" y2="50" stroke={color} strokeWidth="0.5" opacity="0.5" />
            <line x1="50" y1="15" x2="50" y2="85" stroke={color} strokeWidth="0.5" opacity="0.5" />
          </>
        );
      default:
        return (
          <>
            <polygon points={getRegPoints(numPoints, 36, false)} stroke={color} strokeWidth="1.5" fill="none" />
            <polygon points={getRegPoints(numPoints, 22, false)} stroke={color} strokeWidth="0.75" strokeDasharray="3,3" fill="none" opacity="0.7" />
            {Array.from({ length: numPoints }).map((_, i) => {
              const angle = (i * Math.PI * 2) / numPoints - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 36;
              const y = 50 + Math.sin(angle) * 36;
              return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={color} strokeWidth="0.5" opacity="0.5" />;
            })}
          </>
        );
    }
  };

  return (
    <div className="w-24 h-24 bg-slate-950/80 rounded-2xl border border-slate-900 flex items-center justify-center overflow-hidden relative shadow-inner flex-shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06)_0%,transparent_70%)]" />
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-20 h-20"
        animate={{ rotate: isPaused ? 0 : 360 }}
        transition={{ repeat: Infinity, duration: rotDuration, ease: "linear" }}
      >
        {renderShapeContent()}
      </motion.svg>
    </div>
  );
};

export const DataPanel: React.FC<DataPanelProps> = ({
  state,
  setState,
  metrics,
  isCollapsed,
  setIsCollapsed
}) => {
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [newPresetName, setNewPresetName] = useState<string>('');
  
  // Custom states for Matter Alignment section
  const [alignmentModeActive, setAlignmentModeActive] = useState<boolean>(true);
  const [hzStep, setHzStep] = useState<number>(1);

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

  // Adjust frequency helper
  const adjustFrequency = (delta: number) => {
    setState(prev => {
      const nextFreq = Math.max(1, Math.min(20000, Number((prev.frequency + delta).toFixed(2))));
      return { ...prev, frequency: nextFreq };
    });
  };

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
    const stream = (canvas as any).captureStream(30);
    const options = { mimeType: 'video/webm; codecs=vp9' };
    
    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
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

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeGeomInfo = getGeometryInfo(state.frequency, (state as any).shape || 'square');

  return (
    <motion.div 
      className="fixed lg:relative right-0 top-0 h-full flex flex-row z-40 lg:z-30"
      initial={false}
      animate={{
        x: isCollapsed ? (isMobile ? 320 : 0) : 0,
        width: isCollapsed ? (isMobile ? 0 : 0) : (isMobile ? 290 : 320),
      }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
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
      <div className="w-[290px] sm:w-80 h-full bg-slate-950/90 backdrop-blur-xl border-l border-slate-900 flex flex-col overflow-y-auto overflow-x-hidden p-4 sm:p-5 text-slate-200 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <BarChart className="w-5 h-5 text-indigo-400" />
          <h2 className="text-md font-sans font-semibold tracking-wider text-white uppercase">
            Scientific Analysis
          </h2>
        </div>

        {/* 1. MATH & PHYSICS METRICS (Using AnimatedValue with layoutId) */}
        <div className="space-y-4 mb-6 bg-slate-900/30 p-4 rounded-xl border border-slate-900">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              Symmetry Index (สมมาตร)
            </span>
            <span className="font-mono font-bold text-indigo-300">
              <AnimatedValue value={metrics.symmetryScore} id="symmetry" />%
            </span>
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
            <span className="font-mono font-bold text-cyan-300">
              <AnimatedValue value={metrics.fractalDimension} id="fractal" /> <span className="text-[10px] text-slate-500">D</span>
            </span>
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
            <span className="font-mono font-bold text-emerald-300">
              <AnimatedValue value={metrics.resonanceMatching} id="resonance" />%
            </span>
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
              <div className="text-slate-300 font-bold text-xs">
                <AnimatedValue value={metrics.nodeLinesCount} id="nodes" />
              </div>
            </div>
            <div>
              <p>PARTICLE SPEED (ความเร็ว)</p>
              <div className="text-slate-300 font-bold text-xs">
                <AnimatedValue value={(metrics.averageVelocity * 1000).toFixed(0)} id="velocity" /> <span className="text-[9px] text-slate-500">mm/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* REAL-TIME GEOMETRIC MATTER ALIGNMENT ANALYZER (NEW MODE REQUESTED) */}
        <div className="mb-6 border-t border-slate-900 pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              Matter Real-Time Alignment
            </span>
            <button
              onClick={() => setAlignmentModeActive(!alignmentModeActive)}
              className={`text-[9px] px-2 py-0.5 rounded font-mono border cursor-pointer transition-all ${
                alignmentModeActive
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {alignmentModeActive ? 'ACTIVE (เปิด)' : 'PAUSED (ปิด)'}
            </button>
          </div>

          {alignmentModeActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Geometry Information Panel */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-900 flex gap-3 items-center">
                <GeometryVisualizer 
                  info={activeGeomInfo} 
                  palette={state.colorPalette} 
                  isPaused={state.isPaused}
                  frequency={state.frequency}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    {activeGeomInfo.resonanceClass}
                  </div>
                  <h3 className="text-xs font-sans font-bold text-white tracking-tight leading-tight mt-0.5 truncate">
                    {activeGeomInfo.thaiName}
                  </h3>
                  <p className="text-[10px] text-slate-300 font-sans font-medium mt-0.5 truncate">
                    {activeGeomInfo.name}
                  </p>
                  <p className="text-[9.5px] text-slate-500 font-sans leading-snug mt-1 max-h-12 overflow-y-auto no-scrollbar">
                    {activeGeomInfo.thaiDescription}
                  </p>
                </div>
              </div>

              {/* Precise Hz Control Station */}
              <div className="bg-slate-900/10 p-3 rounded-xl border border-slate-900">
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Frequency Precise Tuning Station
                </div>

                {/* Big Display with Buttons */}
                <div className="flex items-center justify-between gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-900 mb-2.5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => adjustFrequency(-hzStep)}
                    className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-750 flex items-center justify-center cursor-pointer font-bold text-md shadow"
                    title={`Reduce frequency by ${hzStep} Hz`}
                  >
                    -
                  </motion.button>

                  <div className="flex-1 text-center min-w-0">
                    <div className="text-md font-mono text-cyan-300 flex items-center justify-center gap-0.5">
                      <AnimatedValue value={state.frequency.toFixed(1)} id="freq-tuning" />
                      <span className="text-[10px] text-slate-500 font-normal ml-0.5">Hz</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => adjustFrequency(hzStep)}
                    className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-755 flex items-center justify-center cursor-pointer font-bold text-md shadow"
                    title={`Increase frequency by ${hzStep} Hz`}
                  >
                    +
                  </motion.button>
                </div>

                {/* Step Multipliers */}
                <div className="flex justify-between gap-1 mb-3.5">
                  {[0.1, 1, 10, 50, 100].map(step => (
                    <button
                      key={step}
                      onClick={() => setHzStep(step)}
                      className={`flex-1 py-1 rounded text-[9px] font-mono font-semibold transition-all cursor-pointer ${
                        hzStep === step
                          ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-950/40 border border-slate-950 text-slate-400 hover:text-slate-300 hover:bg-slate-900/40'
                      }`}
                    >
                      ±{step}
                    </button>
                  ))}
                </div>

                {/* Sacred Geometry Preset Jumps */}
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider text-center">
                    Sacred Resonances / ความถี่สั่นพ้องนำแสง
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-900">
                    {[
                      { hz: 7.83, name: 'วงแหวนชูมันน์', engName: 'Schumann Earth' },
                      { hz: 340, name: 'ดาว 5 แฉกเวทมนตร์', engName: 'Pentagram 340' },
                      { hz: 432, name: 'มณฑลธรรมชาตินำแสง', engName: 'Mandala 432' },
                      { hz: 528, name: 'รังผึ้งฟื้นฟูดีเอ็นเอ', engName: 'DNA Crystal' },
                      { hz: 612, name: 'ดาว 6 แฉกโซโลมอน', engName: 'Solomon Hex' },
                      { hz: 880, name: 'แปดแฉกแปรธาตุสำริด', engName: 'Octagram' },
                      { hz: 963, name: 'จักระมงกุฎเศษส่วนคู่', engName: 'Fractal Crown' }
                    ].map(item => (
                      <button
                        key={item.hz}
                        onClick={() => setState(prev => ({ ...prev, frequency: item.hz }))}
                        className={`py-1.5 px-2 rounded-lg text-left border text-[9px] transition-all cursor-pointer flex flex-col justify-between ${
                          Math.abs(state.frequency - item.hz) < 0.2
                            ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-950/40 border-slate-900 text-slate-300 hover:border-slate-800'
                        }`}
                      >
                        <span className="font-mono text-slate-200 font-semibold">{item.hz} Hz</span>
                        <span className="text-[8.5px] text-slate-400 truncate w-full mt-0.5">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </div>

        {/* 2. REAL-TIME MINI GRAPHS */}
        <div className="mb-6">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wide">Vibrational Graphs</span>
          
          {/* Velocity distribution */}
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-900 mb-3">
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>Velocity Over Time</span>
              <span className="text-indigo-400">
                <AnimatedValue value={(metrics.averageVelocity * 1000).toFixed(0)} id="graph-velocity" /> mm/s
              </span>
            </div>
            <div className="h-14 w-full flex items-end">
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
              <span className="text-emerald-400">
                <AnimatedValue value={metrics.resonanceMatching.toFixed(0)} id="graph-energy" />%
              </span>
            </div>
            <div className="h-14 w-full flex items-end">
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
    </motion.div>
  );
};
