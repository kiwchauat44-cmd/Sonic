/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2, XCircle, RefreshCw, X } from 'lucide-react';

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizQuestion {
  question: string;
  thaiQuestion: string;
  options: string[];
  thaiOptions: string[];
  correctAnswerIdx: number;
  explanation: string;
  thaiExplanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Where do sand particles accumulate on a vibrating Chladni plate?",
    thaiQuestion: "ในแผ่นสั่นสะเทือนชลาดนี (Chladni Plate) อนุภาคทรายจะจัดเรียงตัวสะสมตรงจุดใด?",
    options: [
      "Antinodes - Regions of maximum vibration (ปฏิบัพ - จุดสั่นไหวแรงที่สุด)",
      "Nodes - Regions of zero vibration (บัพ - จุดที่เงียบสงบ ไม่มีแรงสั่นสะเทือน)",
      "Randomly across the entire plate surface (สะเปะสะปะทั่วทั้งผิวแผ่น)",
      "Only along the very outer edges (บริเวณขอบนอกสุดเท่านั้น)"
    ],
    thaiOptions: [
      "ปฏิบัพ - จุดสั่นไหวแรงที่สุด",
      "บัพ - จุดที่เงียบสงบ ไม่มีแรงสั่นสะเทือน",
      "สะเปะสะปะทั่วทั้งผิวแผ่น",
      "บริเวณขอบนอกสุดเท่านั้น"
    ],
    correctAnswerIdx: 1,
    explanation: "Sand is kicked away by the active, vibrating antinodes and slowly settles in the quiet nodal lines (regions of zero amplitude).",
    thaiExplanation: "ทรายจะถูกดีดออกจากจุดปฏิบัพที่มีแรงสั่นสะเทือนสูง แล้วค่อยๆ ไหลไปรวมกันในแนวเส้นบัพ (Nodal lines) ซึ่งเป็นจุดกระเพื่อมต่ำที่สุดของคลื่นนิ่ง"
  },
  {
    question: "What physical phenomenon causes standing wave patterns on a vibrating liquid surface?",
    thaiQuestion: "ปรากฏการณ์ฟิสิกส์ใดที่ทำให้เกิดลวดลายคลื่นนิ่งบนผิวของเหลวที่กำลังสั่นสะเทือน?",
    options: [
      "Schumann Dispersal (การแพร่กระจายชูมันน์)",
      "Faraday Waves (คลื่นฟาราเดย์)",
      "Quantum Tunneling (การเจาะอุโมงค์ควอนตัม)",
      "Magnetic Dipole Alignment (การเรียงขั้วแม่เหล็ก)"
    ],
    thaiOptions: [
      "การแพร่กระจายชูมันน์ (Schumann Dispersal)",
      "คลื่นฟาราเดย์ (Faraday Waves)",
      "การเจาะอุโมงค์ควอนตัม (Quantum Tunneling)",
      "การเรียงขั้วแม่เหล็ก (Magnetic Dipole Alignment)"
    ],
    correctAnswerIdx: 1,
    explanation: "Faraday waves are non-linear standing waves that form on liquid surfaces enclosed by vibrating boundaries, first described by Michael Faraday in 1831.",
    thaiExplanation: "คลื่นฟาราเดย์ (Faraday Waves) คือคลื่นนิ่งแบบไม่เชิงเส้นที่เกิดขึ้นบนผิวของเหลวเมื่อถูกสั่นสะเทือนในแนวตั้ง ค้นพบโดยไมเคิล ฟาราเดย์ ในปี 1831"
  },
  {
    question: "How does frequency relate to the geometric complexity of cymatic patterns?",
    thaiQuestion: "ความถี่เสียงมีความสัมพันธ์อย่างไรกับความซับซ้อนทางเรขาคณิตของลวดลายไซมาติกส์?",
    options: [
      "Higher frequencies create simpler, wider shapes. (ความถี่สูงขึ้นสร้างลายเรียบง่ายและกว้างขึ้น)",
      "Lower frequencies create more complex, dense lines. (ความถี่ต่ำสร้างลายที่ซับซ้อนหนาแน่นขึ้น)",
      "Higher frequencies create more complex, intricate geometric patterns. (ความถี่สูงขึ้นสร้างลวดลายเรขาคณิตที่มีรายละเอียดซับซ้อนหนาแน่นขึ้น)",
      "There is no relationship between frequency and pattern. (ไม่มีความสัมพันธ์ใดๆ ระหว่างความถี่และลวดลาย)"
    ],
    thaiOptions: [
      "ความถี่สูงขึ้นสร้างลายเรียบง่ายและกว้างขึ้น",
      "ความถี่ต่ำสร้างลายที่ซับซ้อนหนาแน่นขึ้น",
      "ความถี่สูงขึ้นสร้างลวดลายเรขาคณิตที่มีรายละเอียดซับซ้อนหนาแน่นขึ้น",
      "ไม่มีความสัมพันธ์ใดๆ ระหว่างความถี่และลวดลาย"
    ],
    correctAnswerIdx: 2,
    explanation: "As frequency increases, the wavelength shortens, fitting more cycles into the plate dimension. This results in highly dense, complex standing wave modes.",
    thaiExplanation: "เมื่อความถี่สูงขึ้น ความยาวคลื่นเสียงจะสั้นลง ทำให้เกิดวงรอบคลื่นจำนวนมากสะท้อนภายในพื้นที่แผ่นเท่าเดิม ส่งผลให้เกิดลวดลายที่ละเอียดซับซ้อนขึ้นมาก"
  }
];

export const EducationalModal: React.FC<EducationalModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz'>('theory');
  
  // Quiz states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleOptionSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswerIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="border-b border-slate-850 px-6 py-4 flex items-center gap-6">
          <GraduationCap className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-sans font-semibold text-white tracking-wide mr-4">
            Cymatic Learning Center (ศูนย์เรียนรู้ฟิสิกส์คลื่น)
          </h2>
          
          <div className="flex gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeTab === 'theory'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              PHYSICS THEORY
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeTab === 'quiz'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              CHALLENGE QUIZ
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-sm leading-relaxed">
          
          {/* TAB 1: THEORY */}
          {activeTab === 'theory' && (
            <div className="space-y-6">
              
              {/* Introduction */}
              <div>
                <h3 className="text-white font-semibold text-base mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  What is Cymatics? (ไซมาติกส์คืออะไร?)
                </h3>
                <p className="text-slate-300">
                  Cymatics is the study of visible sound and vibration. When sound waves travel through materials (like a plate or a fluid), they set up <strong>Standing Waves</strong>. Standing waves contain stationary nodes (points of zero vibration) and oscillating antinodes (points of maximum movement). The geometry of these standing lines forms highly beautiful, symmetrical mathematical patterns.
                </p>
                <p className="text-slate-400 text-xs mt-2 italic">
                  ไซมาติกส์คือการศึกษาคลื่นเสียงที่มองเห็นได้ด้วยตาเปล่า เมื่อคลื่นเสียงแผ่กระจายผ่านตัวกลาง (เช่นแผ่นโลหะหรือของเหลว) จะสั่นสะท้อนกลายเป็น "คลื่นนิ่ง" (Standing Waves) ประกอบด้วยแนวจุดดับสั่นไหว (Nodes) และจุดสั่นพ้องสูงสุด (Antinodes) ก่อเกิดรูปลักษณ์ทางเรขาคณิตที่สมมาตรอย่างน่าอัศจรรย์
                </p>
              </div>

              {/* Scenarios explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850 pt-5">
                
                {/* 1. Chladni Plate */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                  <h4 className="text-white font-semibold text-xs uppercase text-amber-400 font-mono mb-1">Chladni Plate (แผ่นชลาดนี)</h4>
                  <p className="text-xs text-slate-400">
                    Named after Ernst Chladni. Solid particles like sand slide away from the shaking antinodes and collect on the stationary nodal lines, tracing the exact nodes of the plate mode.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    ทรายบนแผ่นโลหะสั่น จะถูกปฏิบัติดีดกระดอนไปยังจุดบัพที่ไม่มีแรงสะเทือน ทำให้ทรายวาดตัวเป็นเส้นตามรูปทรงคลื่นนิ่งพ้อง
                  </p>
                </div>

                {/* 2. Faraday Waves */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                  <h4 className="text-white font-semibold text-xs uppercase text-cyan-400 font-mono mb-1">Faraday Waves (คลื่นฟาราเดย์)</h4>
                  <p className="text-xs text-slate-400">
                    Formed on liquid surfaces when vertically shaken. Surface tension and gravity oscillate molecules to form symmetrical grid crests and troughs, appearing as liquid diamonds.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    คลื่นนิ่งผิวหน้าของเหลวที่ถูกสั่นในแนวตั้ง ก่อเกิดลวดลายตาข่ายนูนเว้าคล้ายประกายเพชรจากสมดุลระหว่างแรงตึงผิวและแรงโน้มถ่วง
                  </p>
                </div>

                {/* 3. Magnetic Filings */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                  <h4 className="text-white font-semibold text-xs uppercase text-slate-400 font-mono mb-1">Metal filings (ผงเหล็กกล้า)</h4>
                  <p className="text-xs text-slate-400">
                    Metal filings exhibit electromagnetic dipole interactions. Under acoustic pressure fields, they chain up vertically, forming fibrous, spike-like networks.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    ผงเหล็กทำตัวเป็นแม่เหล็กขั้วคู่ขนาดเล็ก ดึงดูดกันจนเกิดเส้นใยแหลมคมเกาะกลุ่มตามแนวกระเพื่อมต่ำที่สุดของคลื่นเสียง
                  </p>
                </div>

                {/* 4. Quantum Clouds */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                  <h4 className="text-white font-semibold text-xs uppercase text-violet-400 font-mono mb-1">Quantum Wavefunction (ความน่าจะเป็นควอนตัม)</h4>
                  <p className="text-xs text-slate-400">
                    Represents Schrödinger equation solutions. The probability cloud density is proportional to $|\psi|^2$, where particles materialize dynamically in highly probable wave crest locations.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    สมการชเรอดิงเงอร์ (Schrödinger) กลุ่มหมอกจำลองความน่าจะเป็นที่อนุภาคควอนตัมจะไปปรากฏตัวตามระนาบคลื่นสูงสุด
                  </p>
                </div>

              </div>

              {/* Solfeggio Explanation */}
              <div className="border-t border-slate-850 pt-5">
                <h3 className="text-white font-semibold text-sm mb-2">
                  Harmonic Solfeggio & Biological Effects (ความถี่ธรรมชาติต่อเซลล์)
                </h3>
                <p className="text-xs text-slate-400">
                  Historically, frequencies like <strong>432 Hz</strong> and <strong>528 Hz</strong> were regarded as natural harmonic intervals that form balanced, geometrically clear patterns. In cell biology, vibrational frequencies can stimulate cellular boundaries, triggering active transport or aggregation, helping illustrate structural micro-dynamics.
                </p>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  ความถี่คลาสสิกเช่น 432Hz และ 528Hz มีสัดส่วนสมมาตรทางธรรมชาติ ก่อรูปร่างเรขาคณิตที่สมบูรณ์ ในทางชีววิทยาระดับสั่นสะเทือนสามารถกระตุ้นพฤติกรรมโครงสร้างเปลือกเซลล์ให้จัดกลุ่มอย่างสมดุลสวยงาม
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: CHALLENGE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              
              {!quizFinished ? (
                <div>
                  {/* Progress Header */}
                  <div className="flex justify-between text-xs text-slate-500 font-mono mb-4">
                    <span>QUESTION {currentQuestionIdx + 1} OF {QUIZ_QUESTIONS.length}</span>
                    <span>SCORE: {score} / {QUIZ_QUESTIONS.length}</span>
                  </div>

                  {/* Question */}
                  <h3 className="text-white font-sans font-semibold text-base mb-2">
                    {currentQuestion.question}
                  </h3>
                  <h4 className="text-cyan-400 text-sm italic font-medium mb-6">
                    {currentQuestion.thaiQuestion}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      let optionBg = "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300";
                      
                      if (isAnswerSubmitted) {
                        if (idx === currentQuestion.correctAnswerIdx) {
                          optionBg = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                        } else if (isSelected) {
                          optionBg = "bg-red-500/10 border-red-500 text-red-300";
                        } else {
                          optionBg = "bg-slate-950/20 border-slate-900 text-slate-600";
                        }
                      } else if (isSelected) {
                        optionBg = "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.15)]";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-center justify-between cursor-pointer ${optionBg}`}
                        >
                          <span className="font-medium">{option}</span>
                          {isAnswerSubmitted && idx === currentQuestion.correctAnswerIdx && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-3" />
                          )}
                          {isAnswerSubmitted && isSelected && idx !== currentQuestion.correctAnswerIdx && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-3" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Next Actions */}
                  <div className="mt-6 flex justify-end">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className={`py-2 px-5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          selectedOption !== null
                            ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        SUBMIT ANSWER
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        <span>NEXT</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswerSubmitted && (
                    <div className="mt-6 bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-xs animate-fadeIn">
                      <p className="font-bold text-slate-200 uppercase tracking-wider mb-1 font-mono">Scientific explanation:</p>
                      <p className="text-slate-300 leading-relaxed mb-2">{currentQuestion.explanation}</p>
                      <p className="text-slate-400 leading-relaxed italic">{currentQuestion.thaiExplanation}</p>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-sans font-bold text-white mb-1">Quiz Completed!</h3>
                  <p className="text-sm text-slate-400 mb-6">You answered correctly on {score} out of {QUIZ_QUESTIONS.length} questions.</p>
                  
                  <div className="bg-slate-950/40 p-4 rounded-xl max-w-sm mx-auto border border-slate-900 mb-6">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">Cymatics Cadet Ranking</p>
                    <p className="text-lg font-bold text-cyan-300 mt-1">
                      {score === 3 ? "🏆 Wave Master (ผู้เชี่ยวชาญคลื่นนิ่ง)" : score === 2 ? "🥈 Harmonizer (นักวิเคราะห์คลื่น)" : "🥉 Physics Apprentice (เด็กฝึกหัดไซมาติกส์)"}
                    </p>
                  </div>

                  <button
                    onClick={handleRestartQuiz}
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 py-2.5 px-6 rounded-lg text-xs font-bold flex items-center gap-2 mx-auto shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    RESTART CHALLENGE
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
