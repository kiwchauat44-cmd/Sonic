/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { SimulationState, PatternAnalysisMetrics } from './types';
import { CymaticsCanvas } from './components/CymaticsCanvas';
import { SidebarControls } from './components/SidebarControls';
import { DataPanel } from './components/DataPanel';
import { PlaybackTimeline } from './components/PlaybackTimeline';
import { EducationalModal } from './components/EducationalModal';
import { cymaticAudio } from './utils/audio';
import { GraduationCap, Eye, EyeOff, Volume2, VolumeX, Sparkles, AlertCircle, HelpCircle, Sliders, BarChart, Activity, Compass, Circle, Square as SquareIcon, Play, Pause } from 'lucide-react';

export default function App() {
  // Global Simulation State
  const [state, setState] = useState<SimulationState>({
    id: 'main',
    frequency: 432.0,
    amplitude: 65,
    waveform: 'sine',
    matterType: 'sand',
    level: 'macro',
    isPaused: false,
    timeScale: 1.0,
    is3D: false,
    showVectorField: false,
    showHeatmap: false,
    noiseLevel: 1.0,
    plateMaterial: 'brass',
    micActive: false
  });

  // Number of parallel displays (1, 2, or 4 comparison blocks)
  const [comparisonCount, setComparisonCount] = useState<number>(1);
  const [particleCount, setParticleCount] = useState<number>(5000);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Analytical Metrics computed from canvas
  const [metrics, setMetrics] = useState<PatternAnalysisMetrics>({
    symmetryScore: 88,
    fractalDimension: 1.45,
    nodeLinesCount: 4,
    averageVelocity: 0.05,
    resonanceMatching: 75
  });

  // UI Collapsed Panels - automatically collapsed on smaller mobile viewports for clean, unblocked initial preview
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [isBottomCollapsed, setIsBottomCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  
  // Audio synth Muted
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isEduOpen, setIsEduOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Frequency Sweep effect
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  useEffect(() => {
    if (!isSweeping || state.isPaused) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        let nextFreq = prev.frequency;
        let direction = (prev as any).sweepDirection || 1;
        
        nextFreq += 1.8 * direction;
        if (nextFreq >= 1000) {
          nextFreq = 1000;
          direction = -1;
        } else if (nextFreq <= 100) {
          nextFreq = 100;
          direction = 1;
        }
        
        return {
          ...prev,
          frequency: parseFloat(nextFreq.toFixed(1)),
          sweepDirection: direction
        } as any;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isSweeping, state.isPaused]);

  // Timeline time accumulator
  useEffect(() => {
    if (state.isPaused) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 0.1 * state.timeScale);
    }, 100);
    return () => clearInterval(interval);
  }, [state.isPaused, state.timeScale]);

  // Synchronize browser audio synth with parameters
  useEffect(() => {
    cymaticAudio.setMute(isMuted);
    if (!isMuted) {
      cymaticAudio.updateSynthParams(state.frequency, state.waveform, state.amplitude);
    }
  }, [isMuted, state.frequency, state.waveform, state.amplitude]);

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      cymaticAudio.setMute(true);
      cymaticAudio.stopMicrophone();
    };
  }, []);

  // Handle Vocal Microphone Capture Pitch tracking
  const handleMicToggle = () => {
    if (state.micActive) {
      // Turn off mic
      cymaticAudio.stopMicrophone();
      setState(prev => ({ ...prev, micActive: false }));
      setErrorMsg('');
    } else {
      // Turn on mic
      setErrorMsg('');
      cymaticAudio.startMicrophone(
        (detectedFreq, volume) => {
          // Dynamic pitch update
          setState(prev => ({
            ...prev,
            frequency: parseFloat(detectedFreq.toFixed(1)),
            // translate vocal pressure amplitude safely
            amplitude: Math.min(100, Math.max(10, Math.round(volume * 400)))
          }));
        },
        (err) => {
          setState(prev => ({ ...prev, micActive: false }));
          setErrorMsg('Microphone access denied or unsupported. (กรุณาอนุญาตไมโครโฟน)');
        }
      );
      setState(prev => ({ ...prev, micActive: true }));
    }
  };

  // Helper to trigger particle arrays reset
  const handleReset = () => {
    setResetTrigger(prev => prev + 1);
    setElapsedTime(0);
  };

  // Toggle Zen Mode: Collapse/Expand all layout panels to view clear full screen
  const toggleZenMode = () => {
    const anyExpanded = !isLeftCollapsed || !isRightCollapsed || !isBottomCollapsed || !isHeaderCollapsed;
    setIsLeftCollapsed(anyExpanded);
    setIsRightCollapsed(anyExpanded);
    setIsBottomCollapsed(anyExpanded);
    setIsHeaderCollapsed(anyExpanded);
  };

  const isZenModeOn = isLeftCollapsed && isRightCollapsed && isBottomCollapsed && isHeaderCollapsed;

  // Build secondary scenario setting overrides based on panel index for comparative splits
  const getPanelState = (index: number): SimulationState => {
    if (comparisonCount === 1) return state;

    if (comparisonCount === 2) {
      // Split Screen: Compare Sand (Left) vs Water (Right) under the same frequency
      return {
        ...state,
        id: `split-${index}`,
        matterType: index === 0 ? 'sand' : 'water',
        shape: index === 0 ? 'square' : 'circle'
      };
    }

    // 4 Bento Screens: Scenario study matrix
    // Panel 0: Sand on Square (Scenario 1 - Chladni Plate)
    // Panel 1: Water on Circle (Scenario 2 - Faraday liquid ripples)
    // Panel 2: Biological Cells on Circle (Scenario 3 - Cellular cluster)
    // Panel 3: Quantum Cloud on Square (Scenario 4 - Schrödinger wavefunction probability)
    const matterConfigs: { matterType: any; shape: 'square' | 'circle' }[] = [
      { matterType: 'sand', shape: 'square' },
      { matterType: 'water', shape: 'circle' },
      { matterType: 'cells', shape: 'circle' },
      { matterType: 'quantum', shape: 'square' }
    ];

    const conf = matterConfigs[index] || { matterType: 'sand', shape: 'square' };
    return {
      ...state,
      id: `split-${index}`,
      matterType: conf.matterType,
      shape: conf.shape
    };
  };

  return (
    <div className="w-screen h-screen bg-[#060614] flex flex-col overflow-hidden text-slate-100">
      
      {/* 1. HEADER BRANDING */}
      <header className={`w-full bg-slate-950/70 backdrop-blur-md border-b border-slate-900 px-6 flex items-center justify-between z-40 shrink-0 transition-all duration-300 ${
        isHeaderCollapsed ? 'h-0 opacity-0 overflow-hidden py-0 border-none' : 'h-14 py-2'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-6.5 h-6.5 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <h1 className="text-sm font-sans font-bold tracking-wider text-white uppercase flex items-center gap-2">
              Cymatic Matter Simulator <span className="text-[10px] bg-cyan-900/40 border border-cyan-800 text-cyan-300 font-mono px-1.5 py-0.5 rounded font-normal leading-none tracking-normal">PHYSICS</span>
            </h1>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Real-time Acoustic Standing Wave Field simulation</p>
          </div>
        </div>

        {/* Header warnings / messages */}
        {errorMsg && (
          <div className="hidden md:flex items-center gap-1.5 bg-red-950/40 border border-red-900 text-red-400 px-3 py-1 rounded-lg text-xs font-mono animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-3">
          
          {/* Zen Mode Control */}
          <button
            onClick={toggleZenMode}
            className={`py-1.5 px-3 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isZenModeOn
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Zen View Mode (พับเก็บ UI ทั้งหมดเพื่อดูคลื่นสะท้อนแบบเต็มแจอ)"
          >
            {isZenModeOn ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isZenModeOn ? 'SHOW CONTROLS' : 'ZEN FULLVIEW'}</span>
          </button>

          {/* Audio toggle shortcuts */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              !isMuted 
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Learning Center Modal Button */}
          <button
            onClick={() => setIsEduOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-sans font-semibold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>LEARNING CENTER</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN GRID WORKSPACE */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative">
        
        {/* LEFT COMPONENT PANEL: FREQUENCY CONTROL */}
        <SidebarControls
          state={state}
          setState={setState}
          isCollapsed={isLeftCollapsed}
          setIsCollapsed={setIsLeftCollapsed}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onMicToggle={handleMicToggle}
          isSweeping={isSweeping}
          setIsSweeping={setIsSweeping}
        />

        {/* CENTER VIEW: MULTI-CANVAS COMPARATIVE SPLIT */}
        <div className="flex-1 h-full flex flex-col p-4 bg-[#03030b] overflow-hidden relative">
          
          <div className={`w-full h-full grid gap-4 transition-all duration-300 ${
            comparisonCount === 1 ? 'grid-cols-1' : comparisonCount === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'
          }`}>
            {Array.from({ length: comparisonCount }).map((_, index) => {
              const panelState = getPanelState(index);
              return (
                <div key={index} className="w-full h-full relative">
                  <CymaticsCanvas
                    state={panelState}
                    particleCount={Math.round(particleCount / (comparisonCount > 1 ? 1.8 : 1))}
                    resetTrigger={resetTrigger}
                    onUpdateMetrics={(newMetrics) => {
                      // Only let main or first active canvas stream metrics back to standard panel
                      if (index === 0) {
                        setMetrics(newMetrics);
                      }
                    }}
                  />

                  {/* Tiny water droplet / sand scenario title overlay on each panel */}
                  {comparisonCount > 1 && (
                    <div className="absolute top-14 left-4 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-mono text-cyan-400 border border-slate-900 pointer-events-none">
                      {comparisonCount === 2 ? (
                        index === 0 ? "SCENARIO 1: CHLADNI SAND PLATE" : "SCENARIO 2: LIQUID FARADAY DISH"
                      ) : (
                        index === 0 ? "SCENARIO 1: CHLADNI SAND" :
                        index === 1 ? "SCENARIO 2: LIQUID FARADAY" :
                        index === 2 ? "SCENARIO 3: CELLULAR MATRIX" :
                        "SCENARIO 4: SCHRÖDINGER FUNCTION"
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Zen Mode advice if active */}
          {isZenModeOn && (
            <button
              onClick={toggleZenMode}
              className="absolute top-6 right-6 bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-2xl transition-all hover:scale-105 z-30 animate-pulse"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>REVEAL CONTROLS (แสดงปุ่มควบคุม)</span>
            </button>
          )}

          {/* FLOATING MOBILE-FRIENDLY HUD CONTROL PANEL */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-850 flex items-center gap-1.5 shadow-2xl transition-all max-w-[95%] overflow-x-auto no-scrollbar lg:hidden">
            
            {/* 1. Left Sidebar (Controls) */}
            <button
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer ${
                !isLeftCollapsed 
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' 
                  : 'bg-slate-900/60 border border-slate-850 text-slate-400'
              }`}
              title="Toggle Sound Controls"
            >
              <Sliders className="w-4 h-4" />
              <span className="text-[7.5px] font-mono leading-none tracking-tight">FREQ</span>
            </button>

            {/* 2. Right Sidebar (Science) */}
            <button
              onClick={() => setIsRightCollapsed(!isRightCollapsed)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer ${
                !isRightCollapsed 
                  ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300' 
                  : 'bg-slate-900/60 border border-slate-850 text-slate-400'
              }`}
              title="Toggle Scientific Diagnostics"
            >
              <BarChart className="w-4 h-4" />
              <span className="text-[7.5px] font-mono leading-none tracking-tight">STATS</span>
            </button>

            {/* 3. Bottom Timeline Toggle */}
            <button
              onClick={() => setIsBottomCollapsed(!isBottomCollapsed)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer ${
                !isBottomCollapsed 
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' 
                  : 'bg-slate-900/60 border border-slate-850 text-slate-400'
              }`}
              title="Toggle Playback Timeline"
            >
              <Activity className="w-4 h-4" />
              <span className="text-[7.5px] font-mono leading-none tracking-tight">TIMELINE</span>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-800 self-center mx-0.5" />

            {/* 4. Shape Quick-Switch (กรอบ 4 เหลี่ยม / วงกลม) */}
            <button
              onClick={() => setState(prev => ({ ...prev, shape: (prev as any).shape === 'circle' ? 'square' : 'circle' }))}
              className="p-2 rounded-lg bg-slate-900/60 border border-slate-850 text-indigo-300 hover:text-indigo-200 flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer"
              title="Switch Plate Shape (เปลี่ยนรูปทรงกรอบ)"
            >
              {(state as any).shape === 'circle' ? <Circle className="w-4 h-4 text-cyan-400" /> : <SquareIcon className="w-4 h-4 text-pink-400" />}
              <span className="text-[7.5px] font-mono leading-none tracking-tight">
                {(state as any).shape === 'circle' ? 'CIRCLE' : 'SQUARE'}
              </span>
            </button>

            {/* 5. Sweep Auto-Tuner Toggle (สแกนความถี่) */}
            <button
              onClick={() => setIsSweeping(!isSweeping)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer ${
                isSweeping 
                  ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300 shadow-[0_0_8px_rgba(20,184,166,0.15)]' 
                  : 'bg-slate-900/60 border border-slate-850 text-slate-400'
              }`}
              title="Auto Frequency Sweep"
            >
              <Compass className={`w-4 h-4 ${isSweeping ? 'animate-spin' : ''}`} />
              <span className="text-[7.5px] font-mono leading-none tracking-tight">SWEEP</span>
            </button>

            {/* 6. Play / Pause Toggle */}
            <button
              onClick={() => setState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
              className={`p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer ${
                state.isPaused 
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' 
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}
              title={state.isPaused ? "Play Simulation" : "Pause Simulation"}
            >
              {state.isPaused ? <Play className="w-4 h-4 fill-rose-400/20" /> : <Pause className="w-4 h-4" />}
              <span className="text-[7.5px] font-mono leading-none tracking-tight">
                {state.isPaused ? 'PLAY' : 'PAUSE'}
              </span>
            </button>

            {/* 7. Audio Mute / Unmute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all cursor-pointer ${
                !isMuted 
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.15)]' 
                  : 'bg-slate-900/60 border border-slate-850 text-slate-500'
              }`}
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[7.5px] font-mono leading-none tracking-tight">AUDIO</span>
            </button>

          </div>

        </div>

        {/* RIGHT COMPONENT PANEL: SCIENTIFIC STATS */}
        <DataPanel
          state={state}
          setState={setState}
          metrics={metrics}
          isCollapsed={isRightCollapsed}
          setIsCollapsed={setIsRightCollapsed}
        />

      </div>

      {/* 3. PLAYBACK TIMELINE (BOTTOM DECK) */}
      <PlaybackTimeline
        state={state}
        setState={setState}
        comparisonCount={comparisonCount}
        setComparisonCount={setComparisonCount}
        particleCount={particleCount}
        setParticleCount={setParticleCount}
        onReset={handleReset}
        elapsedTime={elapsedTime}
        isCollapsed={isBottomCollapsed}
        setIsCollapsed={setIsBottomCollapsed}
      />

      {/* 4. EDUCATIONAL POPUP CENTER */}
      <EducationalModal
        isOpen={isEduOpen}
        onClose={() => setIsEduOpen(false)}
      />

    </div>
  );
}
