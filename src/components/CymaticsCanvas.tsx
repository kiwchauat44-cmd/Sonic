/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Particle, SimulationState, MatterType, PatternAnalysisMetrics } from '../types';
import { getStandingWaveDisplacement, getStandingWaveGradient, generateParticles, updateParticlesPhysics, calculatePatternAnalysis } from '../utils/physics';
import { Waves, Sparkles, Move, Zap } from 'lucide-react';

interface CymaticsCanvasProps {
  state: SimulationState;
  particleCount: number;
  resetTrigger: number;
  onUpdateMetrics: (metrics: PatternAnalysisMetrics) => void;
  width?: number;
  height?: number;
}

export const CymaticsCanvas: React.FC<CymaticsCanvasProps> = ({
  state,
  particleCount,
  resetTrigger,
  onUpdateMetrics,
  width = 600,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Local state to track actual parent dimensions for crisp 1:1 pixel rendering
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      // Guarantee integer pixels and avoid dividing by zero
      const w = Math.max(250, Math.floor(width));
      const h = Math.max(250, Math.floor(height));
      setDimensions({ width: w, height: h });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Local high-performance particles storage
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef<number>(0);

  // 3D Camera Controls
  const [rotX, setRotX] = useState<number>(-0.45); // angle tilt
  const [rotY, setRotY] = useState<number>(0.35);  // angle rotate
  const [zoom, setZoom] = useState<number>(1.05);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  
  // Mouse force interaction
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Initialize/Reset particles locally
  const initializeParticles = () => {
    particlesRef.current = generateParticles(state.matterType, particleCount);
  };

  useEffect(() => {
    initializeParticles();
  }, [state.matterType, particleCount, resetTrigger]);

  // Convert client coordinate to normalized plate coordinates (-1 to 1)
  const getNormalizedCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    
    // Project based on current view (2D vs 3D)
    if (!state.is3D) {
      const pad = 40;
      const size = Math.min(rect.width, rect.height) - pad * 2;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const px = (sx - cx) / (size / 2);
      const py = (sy - cy) / (size / 2);
      return { x: Math.max(-1, Math.min(1, px)), y: Math.max(-1, Math.min(1, py)) };
    } else {
      // 3D approximation inverse
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const size = Math.min(rect.width, rect.height) * 0.42 * zoom;
      const px = (sx - cx) / size;
      const py = (sy - cy) / (size * 0.7); // compress Y slightly for orthographic slant
      return { x: Math.max(-1, Math.min(1, px)), y: Math.max(-1, Math.min(1, py)) };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (e.shiftKey || e.button === 1 || state.is3D) {
      // Rotate 3D plate
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        rx: rotX,
        ry: rotY
      };
    } else {
      // Click: Spawn interactive shockwave force
      const pos = getNormalizedCoords(e);
      if (pos) {
        setIsInteracting(true);
        if (e.altKey) {
          // Alt+Click spawns a packet of particles
          const extra = generateParticles(state.matterType, 150).map(p => ({
            ...p,
            x: pos.x + (Math.random() - 0.5) * 0.1,
            y: pos.y + (Math.random() - 0.5) * 0.1
          }));
          particlesRef.current = [...particlesRef.current.slice(150), ...extra];
        } else {
          setHoverPos(pos);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setRotY(dragStart.current.ry + dx * 0.007);
      setRotX(Math.max(-Math.PI / 2, Math.min(Math.PI / 12, dragStart.current.rx + dy * 0.007)));
    } else if (isInteracting) {
      const pos = getNormalizedCoords(e);
      if (pos) {
        setHoverPos(pos);
      }
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setIsInteracting(false);
    setHoverPos(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (state.is3D) {
      e.preventDefault();
      setZoom(prev => Math.max(0.4, Math.min(2.5, prev - e.deltaY * 0.001)));
    }
  };

  // Map wave energy levels to custom gradient hues
  const getParticleColor = (energy: number, matterType: MatterType, life: number = 100) => {
    const norm = Math.max(0, Math.min(1, energy));
    if (matterType === 'sand') {
      // Beige low-vibe nodes to glowing orange-red antinodes
      const h = 33 + norm * 45; 
      const s = 65 + norm * 35;
      const l = 75 - norm * 25;
      return `hsla(${h}, ${s}%, ${l}%, 0.85)`;
    } else if (matterType === 'water') {
      // Liquid blues to brilliant neon-cyan ripples
      const h = 185 + norm * 45;
      const s = 80 + norm * 20;
      const l = 50 + norm * 35;
      return `hsla(${h}, ${s}%, ${l}%, 0.75)`;
    } else if (matterType === 'metal') {
      // Dark iron chains to gleaming white-hot active points
      const lightness = 40 + norm * 55;
      const hue = 200 - norm * 40;
      return `hsla(${hue}, ${norm * 80}%, ${lightness}%, 0.8)`;
    } else if (matterType === 'cells') {
      // Cell structures: Green nodes to vibrant magenta/pink active groupings
      const h = 110 + norm * 210;
      return `hsla(${h}, 90%, 60%, ${0.5 + (life / 100) * 0.45})`;
    } else {
      // Quantum function: Mystical violet density maps
      const h = 265 + norm * 90;
      return `hsla(${h}, 100%, 72%, ${0.15 + norm * 0.7})`;
    }
  };

  // High frame rate requestAnimationFrame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const renderLoop = () => {
      frameCount++;
      
      // 1. UPDATE PHYSICS
      if (!state.isPaused) {
        timeRef.current += 0.016 * state.timeScale;
        
        // Build mouse force payload
        const mForce = hoverPos ? {
          x: hoverPos.x,
          y: hoverPos.y,
          active: isInteracting,
          radius: 0.25
        } : null;

        particlesRef.current = updateParticlesPhysics(
          particlesRef.current,
          state.frequency,
          state.amplitude,
          state.matterType,
          state.level,
          (state as any).shape || 'square',
          state.plateMaterial,
          state.timeScale,
          mForce,
          timeRef.current
        );
      }

      // 2. DISPATCH ANALYTICS OCCASIONALLY (To prevent CPU lag)
      if (frameCount % 10 === 0 && particlesRef.current.length > 0) {
        const metrics = calculatePatternAnalysis(
          particlesRef.current,
          state.frequency,
          (state as any).shape || 'square',
          state.plateMaterial
        );
        onUpdateMetrics(metrics);
      }

      // 3. CANVAS CLEAR
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.42 * zoom;

      // Projection mapping: (x, y, z) to flat coordinates
      const project = (px: number, py: number, pz: number) => {
        if (!state.is3D) {
          return {
            x: cx + px * scale,
            y: cy + py * scale,
            depth: pz,
            visible: true
          };
        }

        // Rotate Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        let x1 = px * cosY - pz * sinY;
        let z1 = px * sinY + pz * cosY;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        let y2 = py * cosX - z1 * sinX;
        let z2 = py * sinX + z1 * cosX;

        const dist = 3.8;
        const depthScale = dist / (dist - z2);
        
        return {
          x: cx + x1 * scale * depthScale,
          y: cy + y2 * scale * depthScale,
          depth: z2,
          visible: z2 < dist
        };
      };

      // 4. DRAW DISH OUTLINES
      ctx.save();
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.25)';
      ctx.fillStyle = 'rgba(8, 8, 25, 0.4)';

      if (state.plateMaterial === 'glass') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      } else if (state.plateMaterial === 'brass') {
        ctx.strokeStyle = 'rgba(235, 190, 85, 0.3)';
      } else if (state.plateMaterial === 'steel') {
        ctx.strokeStyle = 'rgba(150, 170, 220, 0.25)';
      }

      const plateShape = (state as any).shape || 'square';

      if (plateShape === 'circle') {
        ctx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const a = (i * Math.PI * 2) / steps;
          const proj = project(Math.cos(a), Math.sin(a), 0);
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        ctx.beginPath();
        corners.forEach((c, i) => {
          const proj = project(c[0], c[1], 0);
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // 4.5 DRAW HOLOGRAPHIC RESONANCE ENERGY GRID (ตารางวิเคราะห์พลังงานสะท้อน)
      ctx.save();
      ctx.lineWidth = 1.0;
      const hGridCount = 12;
      
      // Draw grid lines along X
      for (let i = 0; i <= hGridCount; i++) {
        const u = (i / hGridCount) * 2 - 1; // coordinate from -1 to 1
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 24; j++) {
          const v = (j / 24) * 2 - 1;
          
          if (plateShape === 'circle' && u*u + v*v > 0.98) continue;
          
          const wVal = getStandingWaveDisplacement(u, v, state.frequency, plateShape, state.plateMaterial);
          const energy = wVal * wVal;
          const zVal = state.is3D ? wVal * (state.amplitude / 100) * 0.12 : 0;
          const proj = project(u, v, zVal);
          
          if (!started) {
            ctx.moveTo(proj.x, proj.y);
            started = true;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        
        let colorR = 100, colorG = 150, colorB = 255;
        if (state.plateMaterial === 'brass') { colorR = 235; colorG = 190; colorB = 85; }
        else if (state.plateMaterial === 'glass') { colorR = 255; colorG = 255; colorB = 255; }
        
        // Grid lines glow softly where wave displacement is high
        ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, 0.08)`;
        ctx.stroke();
      }
      
      // Draw grid lines along Y
      for (let j = 0; j <= hGridCount; j++) {
        const v = (j / hGridCount) * 2 - 1;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 24; i++) {
          const u = (i / 24) * 2 - 1;
          
          if (plateShape === 'circle' && u*u + v*v > 0.98) continue;
          
          const wVal = getStandingWaveDisplacement(u, v, state.frequency, plateShape, state.plateMaterial);
          const zVal = state.is3D ? wVal * (state.amplitude / 100) * 0.12 : 0;
          const proj = project(u, v, zVal);
          
          if (!started) {
            ctx.moveTo(proj.x, proj.y);
            started = true;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        
        let colorR = 100, colorG = 150, colorB = 255;
        if (state.plateMaterial === 'brass') { colorR = 235; colorG = 190; colorB = 85; }
        else if (state.plateMaterial === 'glass') { colorR = 255; colorG = 255; colorB = 255; }
        
        ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, 0.08)`;
        ctx.stroke();
      }
      ctx.restore();

      // 5. DRAW HEATMAPS
      if (state.showHeatmap && !state.isPaused) {
        ctx.save();
        const gridSteps = 20;
        for (let ix = 0; ix <= gridSteps; ix++) {
          for (let iy = 0; iy <= gridSteps; iy++) {
            const px = (ix / gridSteps) * 2 - 1;
            const py = (iy / gridSteps) * 2 - 1;
            
            if (plateShape === 'circle' && px*px + py*py > 1.0) continue;
            
            const w = getStandingWaveDisplacement(px, py, state.frequency, plateShape, state.plateMaterial);
            const energy = w * w;
            if (energy > 0.05) {
              const proj = project(px, py, 0);
              const r = 14 * zoom * Math.max(0.4, energy);
              
              const grad = ctx.createRadialGradient(proj.x, proj.y, 1, proj.x, proj.y, r);
              const opacity = energy * 0.16 * (state.amplitude / 100);
              grad.addColorStop(0, `rgba(${120 + energy * 135}, 40, ${180 + energy * 75}, ${opacity})`);
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }

      // 6. DRAW VECTOR FIELDS
      if (state.showVectorField) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 255, 230, 0.35)';
        ctx.lineWidth = 1;
        const fGrid = 14;
        
        for (let ix = 1; ix < fGrid; ix++) {
          for (let iy = 1; iy < fGrid; iy++) {
            const px = (ix / fGrid) * 2 - 1;
            const py = (iy / fGrid) * 2 - 1;

            if (plateShape === 'circle' && px*px + py*py > 0.95) continue;

            const w = getStandingWaveDisplacement(px, py, state.frequency, plateShape, state.plateMaterial);
            const grad = getStandingWaveGradient(px, py, state.frequency, plateShape, state.plateMaterial);
            
            // Forces pull towards regions of minimum displacement (nodes)
            const fx = -grad.dx * w * 0.04 * (state.amplitude / 100);
            const fy = -grad.dy * w * 0.04 * (state.amplitude / 100);
            
            const projStart = project(px, py, 0);
            const projEnd = project(px + fx, py + fy, 0);

            ctx.beginPath();
            ctx.moveTo(projStart.x, projStart.y);
            ctx.lineTo(projEnd.x, projEnd.y);
            ctx.stroke();

            const angle = Math.atan2(projEnd.y - projStart.y, projEnd.x - projStart.x);
            ctx.beginPath();
            ctx.moveTo(projEnd.x, projEnd.y);
            ctx.lineTo(projEnd.x - 3 * Math.cos(angle - Math.PI / 6), projEnd.y - 3 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(projEnd.x - 3 * Math.cos(angle + Math.PI / 6), projEnd.y - 3 * Math.sin(angle + Math.PI / 6));
            ctx.fillStyle = 'rgba(0, 255, 230, 0.45)';
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 7. DRAW PARTICLES
      const projectedParticles = particlesRef.current
        .map(p => {
          let waveZ = p.z;
          if (state.matterType === 'water') {
            const wVal = getStandingWaveDisplacement(p.x, p.y, state.frequency, plateShape, state.plateMaterial);
            waveZ = wVal * (state.amplitude / 100) * 0.12 * Math.sin(timeRef.current * 10);
          } else if (state.matterType === 'quantum') {
            waveZ = p.z;
          } else {
            // physics micro-vibe bounce height
            waveZ = Math.max(0, p.z) * (state.amplitude / 100);
          }

          const proj = project(p.x, p.y, waveZ);
          return { p, proj };
        })
        .filter(item => item.proj.visible);

      if (state.is3D) {
        projectedParticles.sort((a, b) => a.proj.depth - b.proj.depth);
      }

      projectedParticles.forEach(({ p, proj }) => {
        const energyColor = getParticleColor(p.energy, state.matterType, p.life);
        ctx.fillStyle = energyColor;
        
        let pSize = p.size;
        if (state.level === 'micro') pSize *= 0.8;
        if (state.level === 'quantum') pSize *= 1.3;

        if (state.is3D) {
          const depthMultiplier = 3.8 / (3.8 - proj.depth);
          pSize *= depthMultiplier * zoom;
        } else {
          pSize *= zoom;
        }

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(0.4, pSize), 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive focus halo
      if (hoverPos && !state.isPaused) {
        ctx.save();
        const projHover = project(hoverPos.x, hoverPos.y, 0.05);
        ctx.strokeStyle = 'rgba(255, 60, 100, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(projHover.x, projHover.y, 25 * zoom, 0, Math.PI * 2);
        ctx.stroke();
        
        const shockGrad = ctx.createRadialGradient(projHover.x, projHover.y, 1, projHover.x, projHover.y, 25 * zoom);
        shockGrad.addColorStop(0, 'rgba(255, 60, 100, 0.12)');
        shockGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shockGrad;
        ctx.fill();
        ctx.restore();
      }

      // 8. REAL-TIME ACOUSTIC WAVE OSCILLOSCOPE (ปรับดูคลื่นเสียงและความถี่)
      ctx.save();
      const oscWidth = 160;
      const oscHeight = 50;
      const oscX = 16;
      const oscY = canvas.height - oscHeight - 16;

      // Outer container
      ctx.fillStyle = 'rgba(4, 4, 15, 0.8)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'; // Cyan border
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(oscX, oscY, oscWidth, oscHeight, 6);
      } else {
        ctx.rect(oscX, oscY, oscWidth, oscHeight);
      }
      ctx.fill();
      ctx.stroke();

      // Oscilloscope background grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.lineWidth = 0.8;
      // center horizontal line
      ctx.beginPath();
      ctx.moveTo(oscX, oscY + oscHeight / 2);
      ctx.lineTo(oscX + oscWidth, oscY + oscHeight / 2);
      ctx.stroke();
      
      // vertical ticks
      for (let tx = oscX + 20; tx < oscX + oscWidth; tx += 20) {
        ctx.beginPath();
        ctx.moveTo(tx, oscY);
        ctx.lineTo(tx, oscY + oscHeight);
        ctx.stroke();
      }

      // Render actual sound waveform path based on waveform state
      ctx.strokeStyle = '#22d3ee'; // bright cyan
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#22d3ee';
      ctx.beginPath();
      
      const waveFreq = Math.min(12, Math.max(1.5, state.frequency / 60)); // scale frequency representation
      const waveAmp = (state.amplitude / 100) * (oscHeight / 2.3);
      const timePhase = timeRef.current * 8;

      for (let ox = 0; ox <= oscWidth; ox++) {
        const normX = ox / oscWidth;
        const xCoord = oscX + ox;
        let yDisp = 0;
        
        const phase = timePhase + normX * waveFreq * Math.PI * 2;
        
        if (state.waveform === 'sine') {
          yDisp = Math.sin(phase);
        } else if (state.waveform === 'square') {
          yDisp = Math.sin(phase) >= 0 ? 0.8 : -0.8;
        } else if (state.waveform === 'triangle') {
          yDisp = (Math.abs((phase % (Math.PI * 2)) - Math.PI) / Math.PI) * 2 - 1;
        } else if (state.waveform === 'sawtooth') {
          yDisp = ((phase % (Math.PI * 2)) / Math.PI) - 1;
        }

        const yCoord = oscY + oscHeight / 2 + yDisp * waveAmp;
        
        if (ox === 0) {
          ctx.moveTo(xCoord, yCoord);
        } else {
          ctx.lineTo(xCoord, yCoord);
        }
      }
      ctx.stroke();
      
      // Texts
      ctx.shadowBlur = 0; // reset shadow
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${state.frequency.toFixed(1)} Hz`, oscX + 8, oscY + 12);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '7px monospace';
      ctx.fillText(`${state.waveform.toUpperCase()} MODE`, oscX + 8, oscY + 44);
      
      // Glowing green dot to represent active connection
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(oscX + oscWidth - 10, oscY + 10, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [state, rotX, rotY, zoom, hoverPos, isInteracting]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 rounded-2xl border border-slate-900 shadow-2xl group select-none"
    >
      <canvas
        id={`cymatics-canvas-${state.id}`}
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block cursor-crosshair focus:outline-none transition-transform duration-300"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
      />

      {/* Hover Panel Meta Details */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-850 text-xs text-slate-300 shadow-lg font-mono transition-all">
        {state.matterType === 'sand' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
        {state.matterType === 'water' && <Waves className="w-3.5 h-3.5 text-cyan-400" />}
        {state.matterType === 'metal' && <Move className="w-3.5 h-3.5 text-slate-400" />}
        {state.matterType === 'cells' && <Sparkles className="w-3.5 h-3.5 text-green-400" />}
        {state.matterType === 'quantum' && <Zap className="w-3.5 h-3.5 text-violet-400" />}
        <span className="font-semibold text-slate-100">
          {state.frequency.toFixed(1)} Hz
        </span>
        <span className="text-slate-600">|</span>
        <span className="capitalize">{state.matterType}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 uppercase text-[10px]">{state.plateMaterial}</span>
      </div>

      {/* Guide tags */}
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-300 text-[9px] text-slate-500 bg-slate-950/40 backdrop-blur-sm px-2 py-1 rounded font-mono">
        {state.is3D ? 'Drag: Rotate 3D | Wheel: Zoom' : 'Drag: Acoustic Blast | Alt+Click: Add Matter'}
      </div>
    </div>
  );
};
