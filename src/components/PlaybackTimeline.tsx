/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationState, MatterType } from '../types';
import { Play, Pause, RotateCcw, Compass, Flame, ArrowUpRight, Grid, LayoutList, LayoutGrid, ChevronDown, ChevronUp, Users } from 'lucide-react';

interface PlaybackTimelineProps {
  state: SimulationState;
  setState: React.Dispatch<React.SetStateAction<SimulationState>>;
  comparisonCount: number;
  setComparisonCount: (count: number) => void;
  particleCount: number;
  setParticleCount: (count: number) => void;
  onReset: () => void;
  elapsedTime: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const PlaybackTimeline: React.FC<PlaybackTimelineProps> = ({
  state,
  setState,
  comparisonCount,
  setComparisonCount,
  particleCount,
  setParticleCount,
  onReset,
  elapsedTime,
  isCollapsed,
  setIsCollapsed
}) => {
  const togglePlay = () => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleTimeScale = (scale: number) => {
    setState(prev => ({ ...prev, timeScale: scale }));
  };

  const handleToggle3D = () => {
    setState(prev => ({ ...prev, is3D: !prev.is3D }));
  };

  const handleToggleHeatmap = () => {
    setState(prev => ({ ...prev, showHeatmap: !prev.showHeatmap }));
  };

  const handleToggleVector = () => {
    setState(prev => ({ ...prev, showVectorField: !prev.showVectorField }));
  };

  const handleMatterSelect = (matter: MatterType) => {
    setState(prev => ({ ...prev, matterType: matter }));
  };

  // Convert matter names to localized labels
  const getMatterLabel = (matter: MatterType) => {
    switch(matter) {
      case 'sand': return { en: 'Sand / Chladni', th: 'ทราย/อนุภาค' };
      case 'water': return { en: 'Water Droplet', th: 'หยดน้ำ' };
      case 'metal': return { en: 'Metal Filings', th: 'ผงเหล็กกล้า' };
      case 'cells': return { en: 'Biological Cells', th: 'เซลล์ชีวภาพ' };
      case 'quantum': return { en: 'Quantum Probability', th: 'ควอนตัมคลาวด์' };
    }
  };

  return (
    <div 
      className={`relative w-full transition-all duration-300 z-20 ${
        isCollapsed ? 'h-0 overflow-hidden' : 'h-auto lg:h-36'
      }`}
    >
      {/* Collapse Handle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 px-6 bg-slate-950/95 border border-b-0 border-slate-800 hover:border-cyan-800 rounded-t-md text-slate-400 hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-all shadow-xl z-20 gap-1 group"
        title={isCollapsed ? "Expand Bottom Deck" : "Collapse Bottom Deck"}
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-mono tracking-wider">EXPAND PLAYBACK CONTROLS (แสดงแผงควบคุม)</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-mono tracking-wider">COLLAPSE CONTROLS (พับเก็บแผง)</span>
          </>
        )}
      </button>

      {/* Content Deck */}
      <div className="w-full h-auto lg:h-36 bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 flex flex-col lg:flex-row items-center justify-between p-5 lg:px-6 gap-6 lg:gap-2 text-slate-200">
        
        {/* SECTION A: MATTER TYPE SELECTOR */}
        <div className="flex flex-col gap-1.5 w-full lg:max-w-sm">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Select Matter (ชนิดของสสาร)</label>
          <div className="flex flex-wrap gap-1.5">
            {(['sand', 'water', 'metal', 'cells', 'quantum'] as MatterType[]).map((matter) => {
              const lbl = getMatterLabel(matter);
              const isSelected = state.matterType === matter;
              return (
                <button
                  key={matter}
                  onClick={() => handleMatterSelect(matter)}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold text-left transition-all flex flex-col justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                      : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="font-sans leading-none">{lbl.en}</span>
                  <span className="text-[8.5px] leading-none opacity-60 mt-0.5">{lbl.th}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION B: TIME PLAYBACK & SPEED DIALS */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                state.isPaused
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {state.isPaused ? <Play className="w-5 h-5 fill-slate-950" /> : <Pause className="w-5 h-5" />}
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Reset Particles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Slow Motion speed modes */}
            <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-850 flex gap-1 text-[10px] font-mono">
              {[1.0, 0.5, 0.1].map(scale => (
                <button
                  key={scale}
                  onClick={() => handleTimeScale(scale)}
                  className={`px-2 py-1 rounded transition-colors ${
                    state.timeScale === scale
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {scale === 1.0 ? 'REALTIME' : scale === 0.5 ? '0.5x' : '0.1x'}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline and scrubber */}
          <div className="flex items-center gap-3 w-72">
            <span className="text-[10px] font-mono text-slate-500">
              {elapsedTime.toFixed(1)}s
            </span>
            <div className="flex-1 bg-slate-900 h-1 rounded-full relative overflow-hidden">
              <div 
                className="bg-cyan-400 h-full transition-all duration-300" 
                style={{ width: `${(elapsedTime % 10) * 10}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500">CYCLE</span>
          </div>
        </div>

        {/* SECTION C: PARTICLE DENSITY & COMPILER MULTI-SCREEN VIEW & VISUAL SWITCHES */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-center">
          
          {/* Density Slider */}
          <div className="flex flex-col gap-1 w-full sm:w-36">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>DENSITY (ความหนาแน่น)</span>
              <span className="text-cyan-400 font-bold">{particleCount}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={particleCount}
              onChange={(e) => setParticleCount(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Comparison Split Mode */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Comparison Mode</span>
            <div className="flex gap-1.5">
              {[1, 2, 4].map(views => (
                <button
                  key={views}
                  onClick={() => setComparisonCount(views)}
                  className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    comparisonCount === views
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
                  }`}
                  title={`${views} Simulation Screens`}
                >
                  {views === 1 && <LayoutList className="w-4 h-4" />}
                  {views === 2 && <Grid className="w-4 h-4" />}
                  {views === 4 && <LayoutGrid className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Overlay switches */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Visual Overlays</span>
            <div className="flex gap-2">
              <button
                onClick={handleToggle3D}
                className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  state.is3D
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-950 text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle 3D View"
              >
                <Compass className="w-4 h-4" />
                3D
              </button>

              <button
                onClick={handleToggleHeatmap}
                className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  state.showHeatmap
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-950 text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Energy Heatmap"
              >
                <Flame className="w-4 h-4" />
                HEAT
              </button>

              <button
                onClick={handleToggleVector}
                className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  state.showVectorField
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-950 text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Vector Forces Overlay"
              >
                <ArrowUpRight className="w-4 h-4" />
                VECTOR
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
