import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, XCircle, Trash2, RefreshCw, AlertCircle, Lightbulb } from "lucide-react";

interface SavedQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  collectionName: string;
  failedAt: string;
  attempts: number;
  variants?: SavedQuestion[];
}

interface ReviewMistakesViewProps {
  onBack: () => void;
}

interface AttemptRecord {
  id: number;
  question: SavedQuestion;
  selectedAnswer: number;
  isCorrect: boolean;
}

const REQUIRED_CORRECT_ANSWERS = 3;

// Shuffle array helper function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ReviewMistakesView = ({ onBack }: ReviewMistakesViewProps) => {
  const [questions, setQuestions] = useState<SavedQuestion[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Track which variant each question is showing (cycles infinitely)
  const [variantIndex, setVariantIndex] = useState<Record<number, number>>({});
  // Track all attempts (correct and wrong) to show on left side
  const [allAttempts, setAllAttempts] = useState<Record<number, AttemptRecord[]>>({});
  // Track how many correct answers for each question
  const [correctCounts, setCorrectCounts] = useState<Record<number, number>>({});
  // Counter for unique attempt IDs
  const [attemptCounter, setAttemptCounter] = useState(0);
  // Track shuffled option indices for each question+variant (using ref to avoid re-renders)
  const shuffledOptionsRef = useRef<Record<string, number[]>>({});
  // Track which variant indices were used for correct answers (to avoid duplicates)
  const [correctVariants, setCorrectVariants] = useState<Record<number, number[]>>({});

  // Load questions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reviewMistakes");
    if (saved) {
      setQuestions(JSON.parse(saved));
    }
  }, []);

  // Get current question (original or variant, cycling infinitely)
  const getCurrentQuestion = (qIndex: number) => {
    const originalQuestion = questions[qIndex];
    if (!originalQuestion) return null;

    const vIndex = variantIndex[qIndex] || 0;
    if (vIndex === 0 || !originalQuestion.variants || originalQuestion.variants.length === 0) {
      return originalQuestion;
    }
    // Cycle through variants infinitely
    const variantIdx = ((vIndex - 1) % originalQuestion.variants.length);
    return originalQuestion.variants[variantIdx] || originalQuestion;
  };

  const isQuestionMastered = (qIndex: number) => {
    return (correctCounts[qIndex] || 0) >= REQUIRED_CORRECT_ANSWERS;
  };

  // Get or create shuffled option indices for a question+variant
  const getShuffledIndices = (qIndex: number, optionsLength: number): number[] => {
    const vIndex = variantIndex[qIndex] || 0;
    const key = `${qIndex}-${vIndex}`;

    if (!shuffledOptionsRef.current[key]) {
      const indices = Array.from({ length: optionsLength }, (_, i) => i);
      const shuffled = shuffleArray(indices);
      shuffledOptionsRef.current[key] = shuffled;
    }
    return shuffledOptionsRef.current[key];
  };

  const handleSelectAnswer = (qIndex: number, shuffledIndex: number) => {
    // Already mastered, ignore
    if (isQuestionMastered(qIndex)) return;

    const currentQ = getCurrentQuestion(qIndex);
    if (!currentQ) return;

    const currentVIndex = variantIndex[qIndex] || 0;

    // Map shuffled index back to original index
    const shuffledIndices = getShuffledIndices(qIndex, currentQ.options.length);
    const originalIndex = shuffledIndices[shuffledIndex];

    const isCorrect = originalIndex === currentQ.correctAnswer;

    // Save the attempt to show on side with unique ID (store original index)
    const newAttemptId = attemptCounter;
    setAttemptCounter(prev => prev + 1);
    setAllAttempts(prev => ({
      ...prev,
      [qIndex]: [...(prev[qIndex] || []), { id: newAttemptId, question: currentQ, selectedAnswer: originalIndex, isCorrect }]
    }));

    if (isCorrect) {
      // Increment correct count
      setCorrectCounts(prev => ({
        ...prev,
        [qIndex]: (prev[qIndex] || 0) + 1
      }));
      // Track which variant was used for correct answer
      setCorrectVariants(prev => ({
        ...prev,
        [qIndex]: [...(prev[qIndex] || []), currentVIndex]
      }));
    }

    // Find next variant that hasn't been used for a correct answer
    const originalQuestion = questions[qIndex];
    const totalVariants = 1 + (originalQuestion?.variants?.length || 0); // original + variants
    const usedForCorrect = isCorrect
      ? [...(correctVariants[qIndex] || []), currentVIndex]
      : (correctVariants[qIndex] || []);

    let nextVIndex = currentVIndex + 1;
    // Skip variants already used for correct answers (up to totalVariants cycles)
    for (let i = 0; i < totalVariants; i++) {
      const checkVIndex = (currentVIndex + 1 + i) % totalVariants;
      if (!usedForCorrect.includes(checkVIndex)) {
        nextVIndex = checkVIndex;
        break;
      }
    }

    setVariantIndex(prev => ({ ...prev, [qIndex]: nextVIndex }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updated = questions.filter(q => q.id !== questionId);
    setQuestions(updated);
    localStorage.setItem("reviewMistakes", JSON.stringify(updated));
    setShowDeleteConfirm(null);
  };

  const handleClearAll = () => {
    setQuestions([]);
    localStorage.removeItem("reviewMistakes");
  };

  const handleRetry = (qIndex: number) => {
    setVariantIndex(prev => {
      const newVariants = { ...prev };
      delete newVariants[qIndex];
      return newVariants;
    });
    setAllAttempts(prev => {
      const newAttempts = { ...prev };
      delete newAttempts[qIndex];
      return newAttempts;
    });
    setCorrectCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[qIndex];
      return newCounts;
    });
    // Clear correct variants tracking
    setCorrectVariants(prev => {
      const newVariants = { ...prev };
      delete newVariants[qIndex];
      return newVariants;
    });
    // Clear shuffled options for this question
    Object.keys(shuffledOptionsRef.current).forEach(key => {
      if (key.startsWith(`${qIndex}-`)) {
        delete shuffledOptionsRef.current[key];
      }
    });
    // Reset attempt counter to avoid key conflicts
    setAttemptCounter(prev => prev + 100);
  };

  const masteredCount = questions.filter((_, qIndex) => isQuestionMastered(qIndex)).length;

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header - only show when there are questions */}
      {questions.length > 0 && (
        <motion.div
          className="flex items-center gap-3 mb-6 sticky top-4 bg-card/95 backdrop-blur-sm py-4 px-4 z-20 rounded-3xl shadow-sm border border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">راجع أخطاءك</h1>
              <p className="text-xs text-muted-foreground truncate">
                {questions.length} سؤال للمراجعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-center min-w-[60px]">
              <p className="text-xs text-muted-foreground">أتقنت</p>
              <p className="text-base font-bold text-blue-500">{masteredCount}/{questions.length}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {questions.length === 0 && (
        <motion.div
          className="text-center flex flex-col items-center justify-center h-[calc(100vh-200px)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">ممتاز!</h2>
          <p className="text-muted-foreground">ما عندك أسئلة للمراجعة حالياً</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-violet-500 text-white rounded-2xl font-semibold hover:bg-violet-600 transition-colors"
          >
            العودة للرئيسية
          </button>
        </motion.div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {questions.map((originalQuestion, qIndex) => {
            const currentQuestion = getCurrentQuestion(qIndex);
            if (!currentQuestion) return null;

            const isMastered = isQuestionMastered(qIndex);
            const attempts = allAttempts[qIndex] || [];
            const currentCorrectCount = correctCounts[qIndex] || 0;

            // Show last 2 attempts (correct or wrong), oldest slides out when new one comes - total 3 with current question
            const visibleAttempts = attempts.slice(-2);
            const hasVisibleAttempts = visibleAttempts.length > 0;

            return (
              <div key={originalQuestion.id}>
                <div className="flex gap-4 items-stretch">
                  {/* Current question on the right */}
                  <div
                    className={`flex-1 bg-card rounded-3xl overflow-hidden ${isMastered ? 'ring-2 ring-green-500/50' : ''}`}
                  >
                    <div className="p-6">
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            isMastered
                              ? "bg-green-500/20 text-green-500"
                              : "bg-primary text-primary-foreground"
                          }`}>
                            {isMastered ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : qIndex + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-lg font-medium">{currentQuestion.prompt}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                من: {originalQuestion.collectionName}
                              </p>
                              {!isMastered && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                  {currentCorrectCount}/{REQUIRED_CORRECT_ANSWERS} صحيح
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {(isMastered || attempts.length > 0) && (
                            <button
                              onClick={() => handleRetry(qIndex)}
                              className="p-2 hover:bg-muted rounded-full transition-colors"
                              title="إعادة المحاولة"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(originalQuestion.id)}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-muted-foreground hover:text-red-500"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      <AnimatePresence>
                        {showDeleteConfirm === originalQuestion.id && (
                          <motion.div
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <span className="text-sm">متأكد من الحذف؟</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-3 py-1 text-sm rounded-lg bg-muted hover:bg-muted/80"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(originalQuestion.id)}
                                className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                              >
                                حذف
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Options - only show if not mastered */}
                      {!isMastered && (() => {
                        const shuffledIndices = getShuffledIndices(qIndex, currentQuestion.options.length);
                        return (
                        <div className="grid grid-cols-2 gap-3 mr-13">
                          {shuffledIndices.map((originalIdx, shuffledIdx) => (
                            <motion.button
                              key={shuffledIdx}
                              onClick={() => handleSelectAnswer(qIndex, shuffledIdx)}
                              className="p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[50px] flex items-center justify-end bg-muted hover:bg-muted/80 border-transparent"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {currentQuestion.options[originalIdx]}
                            </motion.button>
                          ))}
                        </div>
                        );
                      })()}

                      {/* Mastered message */}
                      {isMastered && (
                        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-green-500 font-semibold">أحسنت! أتقنت هذا السؤال</p>
                          <p className="text-xs text-muted-foreground mt-1">يمكنك حذفه من القائمة</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attempts on the left */}
                  {hasVisibleAttempts && (
                    <div className="flex gap-2 flex-shrink-0">
                      {visibleAttempts.map((attempt, idx) => (
                        <div
                          key={attempt.id}
                          className={`w-64 rounded-2xl p-4 flex-shrink-0 opacity-85 ${
                            attempt.isCorrect
                              ? 'bg-green-500/10 border border-green-500/30'
                              : 'bg-red-500/10 border border-red-500/30'
                          }`}
                          style={{ zIndex: 10 - idx }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              attempt.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                              {attempt.isCorrect
                                ? <CheckCircle className="w-4 h-4 text-green-500" />
                                : <XCircle className="w-4 h-4 text-red-400" />
                              }
                            </span>
                            <p className="text-sm font-medium text-muted-foreground line-clamp-2">{attempt.question.prompt}</p>
                          </div>
                          <div className="space-y-1.5">
                            {attempt.question.options.map((opt, optIdx) => {
                              const wasSelected = attempt.selectedAnswer === optIdx;
                              const isCorrectOpt = optIdx === attempt.question.correctAnswer;
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded-xl text-xs text-right ${
                                    isCorrectOpt
                                      ? "bg-green-500/20 text-green-500 border border-green-500/30"
                                      : wasSelected
                                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                      : "bg-muted/30 text-muted-foreground"
                                  }`}
                                >
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                          {/* Explanation for attempt */}
                          {attempt.question.explanation && (
                            <div className="mt-3 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5 text-violet-500" />
                                <p className="text-xs text-muted-foreground line-clamp-3">{attempt.question.explanation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      {questions.length > 0 && (
        <motion.button
          onClick={onBack}
          className="w-full mt-6 py-4 bg-violet-500 text-white rounded-3xl font-bold text-lg hover:bg-violet-600 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          العودة للرئيسية
        </motion.button>
      )}
    </div>
  );
};

export default ReviewMistakesView;
