/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Particle, MatterType, SimulationLevel, PatternAnalysisMetrics } from '../types';

// Constants for materials
export const PLATE_MATERIALS: Record<string, { speedOfSound: number; damping: number; resonanceMultiplier: number }> = {
  brass: { speedOfSound: 3400, damping: 0.98, resonanceMultiplier: 1.0 },
  steel: { speedOfSound: 5100, damping: 0.99, resonanceMultiplier: 1.25 },
  glass: { speedOfSound: 4000, damping: 0.95, resonanceMultiplier: 0.85 },
  acrylic: { speedOfSound: 2700, damping: 0.90, resonanceMultiplier: 0.60 }
};

// Continuous standing wave function
// Returns displacement value between -1 and 1 at coordinate (x, y)
export function getStandingWaveDisplacement(
  x: number,
  y: number,
  f: number,
  shape: 'square' | 'circle',
  material: string,
  time: number = 0
): number {
  const mat = PLATE_MATERIALS[material] || PLATE_MATERIALS.brass;
  // Wavenumber k proportional to sqrt of frequency and speed of sound
  const k = Math.sqrt(f) * 0.45 * (3400 / mat.speedOfSound);

  // 1. SACRED GEOMETRY / EUROPEAN MAGIC STAR PRESETS OVERRIDES
  const isSchumann = Math.abs(f - 7.83) < 1;
  const isPentagram = Math.abs(f - 340) < 5;
  const isFlowerOfLife = Math.abs(f - 432) < 5;
  const isHexagonalGrid = Math.abs(f - 528) < 5;
  const isHexagram = Math.abs(f - 612) < 5;
  const isOctagram = Math.abs(f - 880) < 5;
  const isCrownChakra = Math.abs(f - 963) < 5;

  if (shape === 'circle') {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    if (r > 1) return 0;

    if (isSchumann) {
      // Concentric circular waves matching Schumann Resonance
      return Math.cos(4 * Math.PI * r);
    }
    
    if (isFlowerOfLife) {
      // Flower of Life layout: concentric rings + 6-fold intersecting rosettes
      const radialWave = Math.cos(3 * Math.PI * r) + 0.4 * Math.sin(6 * Math.PI * r);
      const angularWave = Math.cos(6 * theta);
      return 0.7 * radialWave * angularWave + 0.3 * Math.cos(2 * Math.PI * r);
    }

    if (isHexagonalGrid) {
      // Hexagonal honeycomb lattice: 3 waves at 120-degree angles
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        const angle = theta + (i * Math.PI) / 3;
        sum += Math.cos(4 * Math.PI * r * Math.cos(angle));
      }
      return sum / 3;
    }

    if (isCrownChakra) {
      // Intricate 12-fold circular star fractal
      const radialWave = Math.cos(6 * Math.PI * r);
      const angularWave = Math.cos(12 * theta);
      return radialWave * angularWave;
    }

    // Bessel approximation: cos(k * r) modulated by angular symmetry
    let modeAngular = Math.round(Math.sqrt(f) * 0.15) + 1;
    let radialMultiplier = 1;

    if (isPentagram) {
      modeAngular = 5; // Perfect 5-pointed Magic Star (Pentagram)
      radialMultiplier = 1.2;
    } else if (isHexagram) {
      modeAngular = 6; // Perfect 6-pointed Star of David (Hexagram)
      radialMultiplier = 1.35;
    } else if (isOctagram) {
      modeAngular = 8; // Intricate 8-pointed Alchemical Octagram Mandala
      radialMultiplier = 1.5;
    }

    const radialWave = Math.cos(k * Math.PI * r * radialMultiplier);
    const angularWave = Math.cos(modeAngular * theta);
    
    return radialWave * angularWave;
  } else {
    if (isSchumann) {
      // Soft ripple concentric rings on a square
      return 0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
    }

    if (isFlowerOfLife) {
      // 6-fold rosette superposition on square
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI) / 3;
        const proj = x * Math.cos(angle) + y * Math.sin(angle);
        sum += Math.cos(4 * Math.PI * proj);
      }
      return sum / 3;
    }

    if (isHexagonalGrid) {
      // Hexagonal crystalline lattice
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI) / 3;
        const proj = x * Math.cos(angle) + y * Math.sin(angle);
        sum += Math.cos(5 * Math.PI * proj);
      }
      return sum / 3;
    }

    if (isCrownChakra) {
      // 12-fold high complexity mandala
      let sum = 0;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 6;
        const proj = x * Math.cos(angle) + y * Math.sin(angle);
        sum += Math.cos(7 * Math.PI * proj);
      }
      return sum / 6;
    }

    // Square plate standing waves using classic Chladni superposition:
    // W = cos(n * pi * x) * cos(m * pi * y) - cos(m * pi * x) * cos(n * pi * y)
    if (isPentagram) {
      // 5-pointed magic configuration on square plate (5, 2 mode)
      const n = 5;
      const m = 2;
      return 0.5 * (Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) - Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y));
    } else if (isHexagram) {
      // 6-pointed hexagonal seal configuration on square plate (6, 4 mode)
      const n = 6;
      const m = 4;
      return 0.5 * (Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) - Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y));
    } else if (isOctagram) {
      // 8-pointed mandala configuration on square plate (8, 6 mode)
      const n = 8;
      const m = 6;
      return 0.5 * (Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) - Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y));
    }

    // Default square plate standing waves (plane wave superposition)
    const numDirections = 4;
    let sum = 0;
    
    // Create symmetric reflections
    for (let i = 0; i < numDirections; i++) {
      const angle = (i * Math.PI) / 2;
      const nx = Math.cos(angle);
      const ny = Math.sin(angle);
      const proj = x * nx + y * ny;
      sum += Math.cos(k * Math.PI * proj);
    }
    
    // Add secondary diagonal reflection modes to increase complexity at high frequencies
    if (f > 400) {
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        const proj = x * nx + y * ny;
        sum += 0.5 * Math.cos(k * Math.PI * proj * 1.414);
      }
    }
    
    return sum / (f > 400 ? 6 : 4);
  }
}

// Analytical gradient of the wave displacement (dw/dx, dw/dy)
export function getStandingWaveGradient(
  x: number,
  y: number,
  f: number,
  shape: 'square' | 'circle',
  material: string
): { dx: number; dy: number } {
  const eps = 0.01;
  const w = getStandingWaveDisplacement(x, y, f, shape, material);
  const wx = getStandingWaveDisplacement(x + eps, y, f, shape, material);
  const wy = getStandingWaveDisplacement(x, y + eps, f, shape, material);
  
  return {
    dx: (wx - w) / eps,
    dy: (wy - w) / eps
  };
}

// Energy density: based on displacement square
export function getEnergyDensity(
  x: number,
  y: number,
  f: number,
  shape: 'square' | 'circle',
  material: string
): number {
  const w = getStandingWaveDisplacement(x, y, f, shape, material);
  return w * w;
}

// Generate starting particles
export function generateParticles(matterType: MatterType, count: number): Particle[] {
  const particles: Particle[] = [];
  const cellTypes = 6; // Assign grouping ids for cell simulations
  
  for (let i = 0; i < count; i++) {
    // Distribute particles in a circle or square
    let px = (Math.random() - 0.5) * 1.8;
    let py = (Math.random() - 0.5) * 1.8;
    
    // Standard sand colors: warm beige/amber
    let color = 'hsla(35, 80%, 75%, 0.7)';
    let size = 1.2 + Math.random() * 1.5;
    
    if (matterType === 'water') {
      color = 'hsla(190, 90%, 65%, 0.6)';
      size = 2.0;
    } else if (matterType === 'metal') {
      color = 'hsla(0, 0%, 70%, 0.7)';
      size = 1.0 + Math.random() * 1.2;
    } else if (matterType === 'cells') {
      // biological cell color tones
      const hue = 120 + Math.random() * 40; // light green-cyan
      color = `hsla(${hue}, 80%, 60%, 0.8)`;
      size = 3.0 + Math.random() * 4.0;
    } else if (matterType === 'quantum') {
      color = 'hsla(280, 100%, 75%, 0.8)';
      size = 1.5 + Math.random() * 2.0;
    }
    
    particles.push({
      x: px,
      y: py,
      z: (Math.random() - 0.5) * 0.1,
      vx: 0,
      vy: 0,
      vz: 0,
      size,
      color,
      energy: 0,
      life: Math.random() * 100,
      maxLife: 100,
      cellId: matterType === 'cells' ? Math.floor(Math.random() * cellTypes) : undefined,
      metalChainId: matterType === 'metal' ? Math.floor(Math.random() * 10) : undefined
    });
  }
  
  return particles;
}

// Calculate the frequency resonance alignment index with the plate dimensions
export function getResonanceMatching(f: number, shape: 'square' | 'circle', material: string): number {
  const mat = PLATE_MATERIALS[material] || PLATE_MATERIALS.brass;
  // Certain discrete mode frequencies match the dimensions of the plate perfectly
  // We model these peaks with a sine wave plus random resonance nodes
  const scaleFactor = (mat.speedOfSound / 3400) * mat.resonanceMultiplier;
  const testVal = (f * scaleFactor) % 88;
  const match = Math.max(0, Math.sin(testVal * 0.1) * 100);
  const fixedPeaks = [7.83, 44, 110, 220, 432, 528, 880, 963, 1440, 2500, 5000];
  
  let closestDist = 9999;
  for (const peak of fixedPeaks) {
    const dist = Math.abs(f - peak);
    if (dist < closestDist) closestDist = dist;
  }
  
  // Close to a physical Solfeggio or natural peak boosts resonance
  const peakBoost = closestDist < 5 ? (100 - closestDist * 20) : 0;
  return Math.min(100, Math.max(20, match + peakBoost));
}

// Symmetry calculation, Fractal dimension, and Node Count
export function calculatePatternAnalysis(
  particles: Particle[],
  f: number,
  shape: 'square' | 'circle',
  material: string
): PatternAnalysisMetrics {
  if (particles.length === 0) {
    return { symmetryScore: 50, fractalDimension: 1.2, nodeLinesCount: 4, averageVelocity: 0, resonanceMatching: 50 };
  }

  // Velocity calculation
  let totalSpeed = 0;
  let symmetricPairs = 0;
  let totalSamples = Math.min(particles.length, 500);
  
  // Create a fast spatial grid to estimate fractal box-counting dimension
  const gridSize = 16;
  const grid = new Array(gridSize * gridSize).fill(false);
  
  for (let i = 0; i < totalSamples; i++) {
    const p = particles[i];
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
    totalSpeed += speed;
    
    // Check spatial symmetry (x axis mirror and y axis mirror)
    const px = Math.floor((p.x + 1) * 0.5 * gridSize);
    const py = Math.floor((p.y + 1) * 0.5 * gridSize);
    if (px >= 0 && px < gridSize && py >= 0 && py < gridSize) {
      grid[py * gridSize + px] = true;
    }
    
    // Find symmetric counterparts
    const oppX = -p.x;
    const oppY = -p.y;
    for (let j = 0; j < 50; j++) {
      const pOther = particles[Math.floor(Math.random() * particles.length)];
      const dist = Math.sqrt((pOther.x - oppX) ** 2 + (pOther.y - oppY) ** 2);
      if (dist < 0.15) {
        symmetricPairs++;
        break;
      }
    }
  }
  
  // Box counting dimension approximation
  let activeBoxes = 0;
  for (let b = 0; b < grid.length; b++) {
    if (grid[b]) activeBoxes++;
  }
  
  const fractalDim = Math.max(1.0, Math.min(1.95, 1.0 + activeBoxes / (gridSize * gridSize) * 1.5));
  const symRatio = symmetricPairs / totalSamples;
  const symmetryScore = Math.min(100, Math.max(10, Math.round(symRatio * 100)));
  const nodeCount = Math.max(2, Math.round(Math.sqrt(f) * 0.3) * (shape === 'circle' ? 2 : 4));
  const res = getResonanceMatching(f, shape, material);
  
  return {
    symmetryScore,
    fractalDimension: parseFloat(fractalDim.toFixed(2)),
    nodeLinesCount: nodeCount,
    averageVelocity: totalSpeed / totalSamples,
    resonanceMatching: Math.round(res)
  };
}

// Core physics engine particle update
export function updateParticlesPhysics(
  particles: Particle[],
  f: number,
  amplitude: number,
  matterType: MatterType,
  level: SimulationLevel,
  shape: 'square' | 'circle',
  material: string,
  timeScale: number,
  mouseForce: { x: number; y: number; active: boolean; radius: number } | null,
  time: number
): Particle[] {
  const ampNormalized = amplitude / 100;
  const mat = PLATE_MATERIALS[material] || PLATE_MATERIALS.brass;
  
  // Wavelength / wave node coefficient
  const k = Math.sqrt(f) * 0.45 * (3400 / mat.speedOfSound);
  const timeStep = 0.016 * timeScale;
  
  return particles.map(p => {
    // 1. Boundary enforcement
    let x = p.x;
    let y = p.y;
    let z = p.z;
    
    if (shape === 'circle') {
      const r = Math.sqrt(x * x + y * y);
      if (r > 0.95) {
        // bounce back inside
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * 0.94;
        y = Math.sin(angle) * 0.94;
        p.vx = -p.vx * 0.3;
        p.vy = -p.vy * 0.3;
      }
    } else {
      if (x < -0.95) { x = -0.94; p.vx = -p.vx * 0.3; }
      if (x > 0.95) { x = 0.94; p.vx = -p.vx * 0.3; }
      if (y < -0.95) { y = -0.94; p.vy = -p.vy * 0.3; }
      if (y > 0.95) { y = 0.94; p.vy = -p.vy * 0.3; }
    }

    // 2. Wave displacement and local gradient at this position
    const w = getStandingWaveDisplacement(x, y, f, shape, material);
    const grad = getStandingWaveGradient(x, y, f, shape, material);
    
    let fx = 0;
    let fy = 0;
    let fz = 0;

    // Local wave vibration energy
    const waveEnergy = w * w;
    p.energy = waveEnergy;

    // 3. Apply custom physics based on MATTER TYPES
    if (matterType === 'sand') {
      // Chladni plate mechanics: particles are thrown into the air by vibrations (anti-nodes)
      // and drift down to the quietest parts (nodes: displacement = 0)
      const vibrationMagnitude = waveEnergy * ampNormalized * 15;
      
      // Random violent kick if standing wave energy is high
      if (Math.random() < vibrationMagnitude) {
        const theta = Math.random() * Math.PI * 2;
        const kickIntensity = Math.random() * vibrationMagnitude * 0.15;
        p.vx += Math.cos(theta) * kickIntensity;
        p.vy += Math.sin(theta) * kickIntensity;
        // Float upwards slightly in 3D
        p.vz += kickIntensity * 0.5;
      }
      
      // Slide towards minimum amplitude: Force proportional to -gradient(w^2)
      // Since E = w^2, dE/dx = 2 * w * dw/dx
      const dEx = 2 * w * grad.dx;
      const dEy = 2 * w * grad.dy;
      
      fx -= dEx * ampNormalized * 1.8;
      fy -= dEy * ampNormalized * 1.8;
      
      // Air drag & gravity on sand
      p.vx = (p.vx + fx * timeStep) * 0.85;
      p.vy = (p.vy + fy * timeStep) * 0.85;
      p.vz = (p.vz + fz * timeStep - 0.25 * timeStep) * 0.80; // gravity pull down
      if (z < 0) {
        z = 0;
        p.vz = 0;
      }

    } else if (matterType === 'water') {
      // Faraday waves: Water molecules oscillate dynamically forming beautiful standing waves
      // Instead of gathering at nodes, they vibrate in place, forming height ripples
      // They are attracted to antinodes (high amplitude crests) which forms the stable oscillating patterns
      const period = Math.sin(time * 0.1 * f);
      const targetZ = w * ampNormalized * 0.4 * period;
      
      // Move towards target vibration height
      p.vz = (targetZ - z) * 12;
      
      // Moderate planar confinement, they dance back and forth
      const orbitalAngle = Math.atan2(y, x);
      fx += Math.cos(orbitalAngle) * w * ampNormalized * 0.2;
      fy += Math.sin(orbitalAngle) * w * ampNormalized * 0.2;
      
      // Water molecular surface jitter
      fx += (Math.random() - 0.5) * 0.15;
      fy += (Math.random() - 0.5) * 0.15;

      p.vx = (p.vx + fx * timeStep) * 0.90;
      p.vy = (p.vy + fy * timeStep) * 0.90;
      z += p.vz * timeStep;

    } else if (matterType === 'metal') {
      // Metal filings: Aligned in linear magnetic standing-wave lines
      // Filings attract neighboring ones, creating fibrous chains
      // Settle on Chladni nodes, but connect vertically/horizontally
      const dEx = 2 * w * grad.dx;
      const dEy = 2 * w * grad.dy;
      
      fx -= dEx * ampNormalized * 2.2;
      fy -= dEy * ampNormalized * 2.2;

      // Magnetic local chaining factor: attract each other locally if they have similar chain index
      const chainIdx = p.metalChainId || 0;
      const chainAngle = (chainIdx * Math.PI) / 5;
      fx += Math.cos(chainAngle) * 0.08 * ampNormalized;
      fy += Math.sin(chainAngle) * 0.08 * ampNormalized;

      // Minor randomized noise
      fx += (Math.random() - 0.5) * 0.04;
      fy += (Math.random() - 0.5) * 0.04;

      p.vx = (p.vx + fx * timeStep) * 0.82;
      p.vy = (p.vy + fy * timeStep) * 0.82;
      p.vz = (p.vz - 0.1 * timeStep) * 0.80;
      if (z < 0) { z = 0; p.vz = 0; }

    } else if (matterType === 'cells') {
      // Biological cells: active swimming + response to acoustic pressure waves
      // Try to group in beautiful clusters, division or ring patterns
      const cellVibe = w * ampNormalized;
      
      // Acoustic radiation force pushing cells towards high/low density fields
      const dEx = 2 * w * grad.dx;
      const dEy = 2 * w * grad.dy;
      
      // Some cells clump on nodes, others on antinodes (due to pressure differences)
      const clumpFactor = (p.cellId || 0) % 2 === 0 ? -1.0 : 0.8;
      fx += dEx * clumpFactor * ampNormalized * 1.2;
      fy += dEy * clumpFactor * ampNormalized * 1.2;

      // Active swimming (brownian active walk)
      const swimAngle = Math.random() * Math.PI * 2;
      fx += Math.cos(swimAngle) * 0.3 * (1 - cellVibe);
      fy += Math.sin(swimAngle) * 0.3 * (1 - cellVibe);

      // Group bonding: pull gently to nearby cells of same group
      p.vx = (p.vx + fx * timeStep) * 0.88;
      p.vy = (p.vy + fy * timeStep) * 0.88;
      p.vz = (p.vz - 0.05 * timeStep) * 0.85;
      if (z < 0) { z = 0; p.vz = 0; }

    } else if (matterType === 'quantum') {
      // Quantum Wave function probability clouds
      // Slices representing |psi|^2. Particles are state samples, they shimmer, fade, and re-materialize
      if (p.life !== undefined && p.maxLife !== undefined) {
        p.life -= timeStep * 40;
        if (p.life <= 0) {
          // Re-sample particle based on wave density: places of high intensity are more likely
          let found = false;
          let rx = 0, ry = 0;
          for (let attempt = 0; attempt < 10; attempt++) {
            rx = (Math.random() - 0.5) * 1.8;
            ry = (Math.random() - 0.5) * 1.8;
            const density = getStandingWaveDisplacement(rx, ry, f, shape, material) ** 2;
            if (Math.random() < density * ampNormalized + 0.05) {
              found = true;
              break;
            }
          }
          x = rx;
          y = ry;
          z = (Math.random() - 0.5) * 0.3 * ampNormalized;
          p.vx = 0;
          p.vy = 0;
          p.life = p.maxLife;
        }
      }

      // Small quantum jitter / uncertainty principle
      p.vx += (Math.random() - 0.5) * 0.05;
      p.vy += (Math.random() - 0.5) * 0.05;
      p.vz += (Math.random() - 0.5) * 0.05;

      p.vx *= 0.90;
      p.vy *= 0.90;
      p.vz *= 0.90;
    }

    // 4. Interactive mouse force drag
    if (mouseForce && mouseForce.active) {
      const dx = x - mouseForce.x;
      const dy = y - mouseForce.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseForce.radius) {
        // Apply repulsive or attractive blast force
        const forceIntensity = (1.0 - dist / mouseForce.radius) * 10.0;
        p.vx += (dx / (dist + 0.01)) * forceIntensity * timeStep;
        p.vy += (dy / (dist + 0.01)) * forceIntensity * timeStep;
        p.vz += forceIntensity * timeStep * 0.5;
      }
    }

    // 5. Simulation Levels overrides (size, appearance, noise)
    if (level === 'micro') {
      // Atoms: vibrating bonds
      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += (Math.random() - 0.5) * 0.1;
    } else if (level === 'meso') {
      // Cellular / aggregate medium friction
    } else if (level === 'quantum') {
      // Glowing dispersion
    }

    // Integrate positions
    x += p.vx * timeStep;
    y += p.vy * timeStep;
    if (matterType !== 'water' && matterType !== 'quantum') {
      z += p.vz * timeStep;
    }

    // Keep z position bounded
    if (z > 1.0) z = 1.0;

    return {
      ...p,
      x,
      y,
      z,
      vx: p.vx,
      vy: p.vy,
      vz: p.vz
    };
  });
}
