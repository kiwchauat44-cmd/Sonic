/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WaveformType = 'sine' | 'square' | 'triangle' | 'sawtooth';

export type MatterType = 'sand' | 'water' | 'metal' | 'cells' | 'quantum';

export type SimulationLevel = 'micro' | 'meso' | 'macro' | 'quantum';

export interface PresetFrequency {
  frequency: number;
  name: string;
  thaiName: string;
  description: string;
  thaiDescription: string;
}

export interface SimulationState {
  id: string;
  frequency: number;       // 1 - 20,000 Hz
  amplitude: number;       // 0 - 100
  waveform: WaveformType;
  matterType: MatterType;
  level: SimulationLevel;
  isPaused: boolean;
  timeScale: number;       // 0.1 - 1.0
  is3D: boolean;
  showVectorField: boolean;
  showHeatmap: boolean;
  noiseLevel: number;      // 0 - 10 (random micro disturbance)
  plateMaterial: string;   // 'brass' | 'steel' | 'glass' | 'acrylic'
  micActive: boolean;
  colorPalette: 'neon' | 'monochrome' | 'heatmap' | 'nature';
  pulseAnimation: boolean;
}

export interface Particle {
  x: number;               // -1 to 1 (normalized coords)
  y: number;
  z: number;               // -1 to 1 (normalized coords)
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  energy: number;          // 0 to 1 based on local movement/field
  life?: number;           // For quantum probability fade or cells
  maxLife?: number;
  cellId?: number;         // For cell clustering/movement
  metalChainId?: number;   // For metal filing chains
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PatternAnalysisMetrics {
  symmetryScore: number;     // 0 - 100%
  fractalDimension: number;  // 1.0 - 2.0
  nodeLinesCount: number;    // estimated number of nodal rings/lines
  averageVelocity: number;   // average particle speed
  resonanceMatching: number; // 0 - 100% compatibility with plate dimensions
}

export interface EducationalModule {
  id: string;
  title: string;
  thaiTitle: string;
  description: string;
  thaiDescription: string;
  tutorialSteps: string[];
  thaiTutorialSteps: string[];
  quiz: {
    question: string;
    thaiQuestion: string;
    options: string[];
    thaiOptions: string[];
    correctAnswerIdx: number;
    explanation: string;
    thaiExplanation: string;
  }[];
}
