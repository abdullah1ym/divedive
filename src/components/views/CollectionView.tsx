import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, XCircle, Library, Zap, Lock, ChevronDown, ChevronUp, Layers, List, Unlock, Lightbulb, AlertCircle, Flag, X, RotateCcw, HelpCircle, BookOpen } from "lucide-react";
import { Collection } from "@/components/LessonGrid";
import { useSkillProgress } from "@/contexts/SkillProgressContext";

// Progress persistence system
const COLLECTION_PROGRESS_KEY = "divedive-collection-progress";

interface CollectionProgress {
  answers: Record<string, number | null>;
  revealedCount: number;
  currentIndex: number;
  viewMode: "progressive" | "scroll" | "normal";
  selectedBankId: string | null;
  variantIndex: Record<number, number>;
  submitted: boolean;
  score: number;
  lastUpdated: string;
}

const saveCollectionProgress = (collectionId: string, bankId: string | null, progress: Partial<CollectionProgress>) => {
  try {
    const stored = localStorage.getItem(COLLECTION_PROGRESS_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    const key = bankId ? `${collectionId}-${bankId}` : collectionId;
    allProgress[key] = {
      ...allProgress[key],
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(COLLECTION_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch {
    // ignore
  }
};

const getCollectionProgress = (collectionId: string, bankId: string | null): CollectionProgress | null => {
  try {
    const stored = localStorage.getItem(COLLECTION_PROGRESS_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    const key = bankId ? `${collectionId}-${bankId}` : collectionId;
    return allProgress[key] || null;
  } catch {
    return null;
  }
};

const clearCollectionProgress = (collectionId: string, bankId: string | null) => {
  try {
    const stored = localStorage.getItem(COLLECTION_PROGRESS_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    const key = bankId ? `${collectionId}-${bankId}` : collectionId;
    delete allProgress[key];
    localStorage.setItem(COLLECTION_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch {
    // ignore
  }
};

interface CollectionViewProps {
  collection: Collection;
  onBack: () => void;
}

type ViewMode = "progressive" | "scroll" | "normal";

const modeLabels: Record<ViewMode, { label: string; icon: React.ReactNode }> = {
  progressive: { label: "تدريجي", icon: <Unlock className="w-4 h-4" /> },
  scroll: { label: "تمرير", icon: <Layers className="w-4 h-4" /> },
  normal: { label: "طبيعي", icon: <List className="w-4 h-4" /> },
};

const CollectionView = ({ collection, onBack }: CollectionViewProps) => {
  // Bank selection state for collections with banks
  // Select first bank (bank-1) by default
  const initialBankId = collection.banks && collection.banks.length > 0 ? collection.banks[0].id : null;
  const [selectedBankId, setSelectedBankId] = useState<string | null>(initialBankId);

  // Load saved progress
  const savedProgress = getCollectionProgress(collection.id, selectedBankId);

  const [answers, setAnswers] = useState<Record<string, number | null>>(savedProgress?.answers || {});
  const [submitted, setSubmitted] = useState(savedProgress?.submitted || false);
  const [viewMode, setViewMode] = useState<ViewMode>(savedProgress?.viewMode || "progressive");
  const [showModeSelector, setShowModeSelector] = useState(false);

  // Get the questions array from selected bank or directly from collection
  const questions = (() => {
    if (collection.banks && selectedBankId) {
      const selectedBank = collection.banks.find(b => b.id === selectedBankId);
      return selectedBank ? selectedBank.questions : [];
    }
    return collection.questions;
  })();

  // Progressive mode state - restore from saved progress
  const [revealedCount, setRevealedCount] = useState(savedProgress?.revealedCount || 1);

  // Scroll mode state - restore from saved progress
  const [currentIndex, setCurrentIndex] = useState(savedProgress?.currentIndex || 0);

  // Variant tracking - which variant index each question is showing
  const [variantIndex, setVariantIndex] = useState<Record<number, number>>(savedProgress?.variantIndex || {});
  // Track failed questions with their wrong answers (to show on left side)
  const [failedAttempts, setFailedAttempts] = useState<Record<number, { question: typeof questions[0], wrongAnswer: number }[]>>({});

  // Notification for questions moved to "راجع أخطاءك"
  const [reviewNotification, setReviewNotification] = useState<{ show: boolean; questionPrompt: string }>({ show: false, questionPrompt: "" });

  // Report modal state
  const [reportModal, setReportModal] = useState<{ show: boolean; questionId: string; questionPrompt: string }>({ show: false, questionId: "", questionPrompt: "" });
  const [reportReason, setReportReason] = useState<string>("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Flip card state - tracks which questions are flipped to show "how to solve"
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasScrolledOnMount = useRef(false);

  // Skill progress tracking
  const { recordCorrectAnswer } = useSkillProgress();

  // Save progress whenever state changes
  useEffect(() => {
    saveCollectionProgress(collection.id, selectedBankId, {
      answers,
      revealedCount,
      currentIndex,
      viewMode,
      variantIndex,
      submitted,
      selectedBankId,
    });
  }, [answers, revealedCount, currentIndex, viewMode, variantIndex, submitted, collection.id, selectedBankId]);

  // Auto-scroll to current question on mount if there's saved progress
  useEffect(() => {
    if (hasScrolledOnMount.current) return;

    // Read progress directly from localStorage for initial scroll
    const initialProgress = getCollectionProgress(collection.id, selectedBankId);
    if (initialProgress && !initialProgress.submitted && Object.keys(initialProgress.answers || {}).length > 0) {
      hasScrolledOnMount.current = true;
      const targetIndex = (initialProgress.viewMode === "scroll")
        ? (initialProgress.currentIndex || 0)
        : Math.max(0, (initialProgress.revealedCount || 1) - 1);

      // Wait for refs to be populated
      setTimeout(() => {
        questionRefs.current[targetIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 500);
    }
  }, [collection.id, selectedBankId]);

  // Load progress when bank changes
  useEffect(() => {
    const progress = getCollectionProgress(collection.id, selectedBankId);
    if (progress) {
      setAnswers(progress.answers || {});
      setRevealedCount(progress.revealedCount || 1);
      setCurrentIndex(progress.currentIndex || 0);
      setViewMode(progress.viewMode || "progressive");
      setVariantIndex(progress.variantIndex || {});
      setSubmitted(progress.submitted || false);
    }
  }, [selectedBankId, collection.id]);

  // Get current question (original or variant)
  const getCurrentQuestion = (qIndex: number) => {
    const originalQuestion = questions[qIndex];
    const vIndex = variantIndex[qIndex] || 0;
    if (vIndex === 0 || !originalQuestion.variants) {
      return originalQuestion;
    }
    return originalQuestion.variants[vIndex - 1] || originalQuestion;
  };

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const score = Object.entries(answers).reduce((acc, [questionId, answerIndex]) => {
    // Check in original questions
    let question = questions.find(q => q.id === questionId);
    // Check in variants
    if (!question) {
      for (const q of questions) {
        if (q.variants) {
          const variant = q.variants.find(v => v.id === questionId);
          if (variant) {
            question = variant;
            break;
          }
        }
      }
    }
    if (question && answerIndex === question.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleSelectAnswer = (questionId: string, answerIndex: number, qIndex: number) => {
    if (submitted) return;

    const currentQ = getCurrentQuestion(qIndex);
    const isCorrect = answerIndex === currentQ.correctAnswer;
    const originalQuestion = questions[qIndex];
    const currentVIndex = variantIndex[qIndex] || 0;
    const hasMoreVariants = originalQuestion.variants && currentVIndex < originalQuestion.variants.length;

    // If wrong and has variants, save failed attempt and show next variant
    if (!isCorrect && hasMoreVariants) {
      // Save the failed question with wrong answer
      setFailedAttempts(prev => ({
        ...prev,
        [qIndex]: [...(prev[qIndex] || []), { question: currentQ, wrongAnswer: answerIndex }]
      }));

      // Switch to next variant
      setVariantIndex(prev => ({ ...prev, [qIndex]: currentVIndex + 1 }));
      return;
    }

    // If wrong and NO more variants (3rd wrong attempt) - move to "راجع أخطاءك"
    if (!isCorrect && !hasMoreVariants && currentVIndex > 0) {
      // Save to "راجع أخطاءك" in localStorage
      const reviewQuestions = JSON.parse(localStorage.getItem("reviewMistakes") || "[]");
      const questionToSave = {
        ...originalQuestion,
        collectionName: collection.name,
        failedAt: new Date().toISOString(),
        attempts: currentVIndex + 1
      };
      // Avoid duplicates
      if (!reviewQuestions.find((q: { id: string }) => q.id === originalQuestion.id)) {
        reviewQuestions.push(questionToSave);
        localStorage.setItem("reviewMistakes", JSON.stringify(reviewQuestions));
      }

      // Show notification
      setReviewNotification({ show: true, questionPrompt: originalQuestion.prompt });
      setTimeout(() => setReviewNotification({ show: false, questionPrompt: "" }), 4000);
    }

    // Record the answer
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));

    // Record skill progress for correct answers
    if (isCorrect && currentQ.skillTag) {
      const category = collection.category === "quantitative" ? "math" : "verbal";
      recordCorrectAnswer(currentQ.skillTag, questionId, category);
    }

    // Progressive mode: reveal next question
    if (viewMode === "progressive" && qIndex + 1 < questions.length && qIndex + 1 >= revealedCount) {
      setTimeout(() => {
        setRevealedCount(prev => Math.max(prev, qIndex + 2));
        setTimeout(() => {
          questionRefs.current[qIndex + 1]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }, 400);
    }

    // Scroll mode: go to next question
    if (viewMode === "scroll" && qIndex < questions.length - 1) {
      setTimeout(() => {
        scrollToQuestion(qIndex + 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    setCurrentIndex(index);
  };

  const xpEarned = submitted ? (score * 10) + 25 : 0;

  // Reset states when changing mode
  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setShowModeSelector(false);
    if (mode === "progressive") {
      setRevealedCount(Math.max(1, answeredCount + 1));
    }
  };

  // Handle bank selection
  const handleBankSelect = (bankId: string) => {
    if (bankId === selectedBankId) return;
    // Switch bank - useEffect will load saved progress for this bank
    setSelectedBankId(bankId);
    setFailedAttempts({});
    // Load progress for new bank (or reset if no saved progress)
    const progress = getCollectionProgress(collection.id, bankId);
    if (progress) {
      setAnswers(progress.answers || {});
      setRevealedCount(progress.revealedCount || 1);
      setCurrentIndex(progress.currentIndex || 0);
      setViewMode(progress.viewMode || "progressive");
      setVariantIndex(progress.variantIndex || {});
      setSubmitted(progress.submitted || false);
    } else {
      // No saved progress, reset to defaults
      setAnswers({});
      setSubmitted(false);
      setRevealedCount(1);
      setCurrentIndex(0);
      setVariantIndex({});
    }
  };

  // Toggle flip card
  const toggleFlipCard = (qIndex: number) => {
    setFlippedCards(prev => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  // Restart exercise - clear progress and reset state
  const handleRestart = () => {
    clearCollectionProgress(collection.id, selectedBankId);
    setAnswers({});
    setSubmitted(false);
    setRevealedCount(1);
    setCurrentIndex(0);
    setVariantIndex({});
    setFailedAttempts({});
    setFlippedCards({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle report submission
  const handleReportSubmit = () => {
    if (!reportReason.trim()) return;

    // Save report to localStorage
    const reports = JSON.parse(localStorage.getItem("questionReports") || "[]");
    reports.push({
      questionId: reportModal.questionId,
      questionPrompt: reportModal.questionPrompt,
      collectionId: collection.id,
      collectionName: collection.name,
      reason: reportReason,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("questionReports", JSON.stringify(reports));

    setReportSubmitted(true);
    setTimeout(() => {
      setReportModal({ show: false, questionId: "", questionPrompt: "" });
      setReportReason("");
      setReportSubmitted(false);
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Bank Sidebar - fixed on the left side (desktop only) */}
      {collection.banks && collection.banks.length > 0 && (
        <div className="hidden lg:block fixed left-4 top-24 w-44 z-10">
          <div className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground mb-3 px-2">الإصدارات</h3>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto">
              {collection.banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank.id)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedBankId === bank.id
                      ? 'bg-violet-500/90 text-white'
                      : 'hover:bg-violet-500/10 text-foreground'
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bank Selector - Mobile horizontal scroll */}
      {collection.banks && collection.banks.length > 0 && (
        <div className="lg:hidden mb-4 -mx-3 px-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {collection.banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleBankSelect(bank.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedBankId === bank.id
                    ? 'bg-violet-500/90 text-white'
                    : 'bg-card hover:bg-muted text-foreground'
                }`}
              >
                {bank.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content - centered like before */}
      <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Notification for "راجع أخطاءك" */}
      <AnimatePresence>
        {reviewNotification.show && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-violet-500/90 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 max-w-md"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">انتقل السؤال لـ "راجع أخطاءك"</p>
              <p className="text-xs opacity-90 mt-1">يمكنك مراجعته لاحقاً من القائمة الرئيسية</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {reportModal.show && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !reportSubmitted && setReportModal({ show: false, questionId: "", questionPrompt: "" })}
          >
            <motion.div
              className="bg-card rounded-3xl p-6 m-4 max-w-md w-full shadow-xl border border-border"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {reportSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-bold">تم إرسال البلاغ</p>
                  <p className="text-sm text-muted-foreground mt-2">شكراً لمساعدتك في تحسين الأسئلة</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Flag className="w-5 h-5 text-red-500" />
                      الإبلاغ عن السؤال
                    </h3>
                    <button
                      onClick={() => setReportModal({ show: false, questionId: "", questionPrompt: "" })}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: reportModal.questionPrompt }} />

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">سبب البلاغ:</p>
                    <div className="space-y-2">
                      {[
                        { id: "wrong-answer", label: "الإجابة الصحيحة خاطئة" },
                        { id: "unclear", label: "السؤال غير واضح" },
                        { id: "typo", label: "خطأ إملائي أو كتابي" },
                        { id: "technical", label: "مشكلة تقنية" },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setReportReason(option.label)}
                          className={`w-full text-right px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                            reportReason === option.label
                              ? 'bg-violet-500/20 border-violet-400 text-violet-400'
                              : 'bg-muted/50 border-transparent hover:bg-muted'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleReportSubmit}
                    disabled={!reportReason}
                    className={`w-full py-3 rounded-2xl font-bold transition-all ${
                      reportReason
                        ? 'bg-violet-500/90 text-white hover:bg-violet-500'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    إرسال البلاغ
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 sticky top-2 md:top-4 bg-card/95 backdrop-blur-sm py-3 md:py-4 px-3 md:px-4 z-20 rounded-2xl md:rounded-3xl shadow-sm border border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={onBack}
          className="p-1.5 md:p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-primary/20 items-center justify-center flex-shrink-0">
            <Library className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold truncate">{collection.name}</h1>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">{collection.description}</p>
          </div>
        </div>

        {/* Restart Button */}
        {(Object.keys(answers).length > 0 || submitted) && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            title="إعادة البدء"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">إعادة</span>
          </button>
        )}

        {/* Mode Selector */}
        {!submitted && (
          <div className="relative">
            <button
              onClick={() => setShowModeSelector(!showModeSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {modeLabels[viewMode].icon}
              <span className="text-sm font-medium">{modeLabels[viewMode].label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showModeSelector ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showModeSelector && (
                <motion.div
                  className="absolute left-0 top-full mt-2 bg-card rounded-2xl shadow-lg border border-border overflow-hidden z-30"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {(Object.keys(modeLabels) as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`flex items-center gap-2 w-full px-4 py-3 text-right hover:bg-muted transition-colors ${
                        viewMode === mode ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {modeLabels[mode].icon}
                      <span className="text-sm font-medium">{modeLabels[mode].label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex-shrink-0 text-center min-w-[50px] md:min-w-[60px]">
          <p className="text-[10px] md:text-xs text-muted-foreground">التقدم</p>
          <p className="text-sm md:text-base font-bold">{answeredCount}/{questions.length}</p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
      >
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-violet-500 dark:to-purple-600 shadow-lg shadow-blue-500/50 dark:shadow-violet-500/50 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Results Banner */}
      {submitted && (() => {
        const percentage = (score / questions.length) * 100;
        const gradeColor = percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red';
        const bgClass = gradeColor === 'green'
          ? 'from-green-500/20 to-primary/20'
          : gradeColor === 'yellow'
          ? 'from-yellow-500/20 to-primary/20'
          : 'from-red-500/20 to-primary/20';
        const textClass = gradeColor === 'green'
          ? 'text-green-500'
          : gradeColor === 'yellow'
          ? 'text-yellow-500'
          : 'text-red-500';

        return (
          <motion.div
            className={`bg-gradient-to-l ${bgClass} rounded-3xl p-6 mb-6`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">النتيجة</h2>
                <p className={`text-4xl font-bold ${textClass}`}>{score}/{questions.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {score === questions.length
                    ? "ممتاز! إجابات صحيحة بالكامل"
                    : score >= questions.length / 2
                    ? "جيد جداً! استمر في التدريب"
                    : "حاول مرة أخرى للتحسن"}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-yellow/20 px-4 py-2 rounded-2xl">
                <Zap className="w-6 h-6 text-yellow" />
                <span className="text-xl font-bold text-yellow">+{xpEarned} XP</span>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* MODE 1: Progressive Reveal */}
      {viewMode === "progressive" && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {questions.map((originalQuestion, qIndex) => {
              const question = getCurrentQuestion(qIndex);
              const selectedAnswer = answers[question.id];
              const isRevealed = qIndex < revealedCount || submitted;
              const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
              const isCorrect = selectedAnswer === question.correctAnswer;
              const isLatest = qIndex === revealedCount - 1 && !submitted;
              const failed = failedAttempts[qIndex] || [];
              const hasFailedAttempts = failed.length > 0;

              if (!isRevealed) return null;

              const isFlipped = flippedCards[qIndex] || false;

              return (
                <div key={originalQuestion.id} ref={el => questionRefs.current[qIndex] = el}>
                  <div className={`flex gap-4 ${hasFailedAttempts ? 'items-stretch' : ''}`}>
                    {/* Current question on the right - with flip card support */}
                    <motion.div
                      className={`flex-1 ${isLatest ? "ring-2 ring-primary/50 shadow-lg rounded-3xl" : ""}`}
                      initial={hasFailedAttempts ? { opacity: 0, x: 100 } : { opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ perspective: "1000px" }}
                    >
                      <AnimatePresence mode="wait">
                        {!isFlipped ? (
                          <motion.div
                            key="front"
                            className="bg-card rounded-3xl overflow-hidden"
                            initial={{ rotateY: -90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 90, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                          <div className="p-8 relative">
                            {/* Top Left Buttons Container */}
                            <div className="absolute top-3 left-2 flex items-center gap-0.5">
                              {/* Report Button */}
                              <button
                                onClick={() => setReportModal({ show: true, questionId: question.id, questionPrompt: question.prompt })}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                                title="الإبلاغ عن السؤال"
                              >
                                <Flag className="w-4 h-4" />
                              </button>

                              {/* Flip Button - Only show if hasFlipFeature and howToSolve exists */}
                              {collection.hasFlipFeature && question.howToSolve && !isAnswered && (
                                <motion.button
                                  onClick={() => toggleFlipCard(qIndex)}
                                  className="p-2 rounded-full hover:bg-amber-500/20 transition-colors text-amber-500 hover:text-amber-400"
                                  title="كيف أحل؟"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <HelpCircle className="w-5 h-5" />
                                </motion.button>
                              )}
                            </div>

                            {/* Reading Comprehension Passage Box */}
                            {question.passageText && (
                              <motion.div
                                className="mb-6 relative"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <div className="absolute -right-3 top-4 w-1 h-16 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-violet-500 dark:to-purple-500 rounded-full" />
                                <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-6 border border-blue-300/60 dark:border-slate-700/50 shadow-sm">
                                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200/50 dark:border-slate-700/50">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-500 dark:to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-violet-500/20">
                                      <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-sm text-blue-800 dark:text-slate-200">{question.passageTitle || "القطعة"}</h4>
                                      <p className="text-xs text-blue-600 dark:text-slate-400">اقرأ النص بتمعن ثم أجب</p>
                                    </div>
                                  </div>
                                  <p className="text-lg leading-loose text-blue-900 dark:text-slate-300 whitespace-pre-line">
                                    {question.passageText}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {/* Question Section */}
                            <div className={`flex items-start gap-4 ${question.passageText ? 'mb-4 pt-4 border-t border-border/50' : 'mb-6'}`}>
                              <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                isAnswered
                                  ? isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
                                  : "bg-primary text-primary-foreground"
                              }`}>
                                {isAnswered ? (
                                  isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                                ) : qIndex + 1}
                              </span>
                              <div className="flex-1">
                                {question.passageText && (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-500 dark:text-violet-400 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                    السؤال
                                  </span>
                                )}
                                <p className="text-xl font-medium" dangerouslySetInnerHTML={{ __html: question.prompt }} />
                              </div>
                            </div>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 ${question.passageText ? 'mr-0' : 'mr-0 sm:mr-16'}`}>
                              {question.options.map((option, optIndex) => {
                                const isSelected = selectedAnswer === optIndex;
                                const isCorrectOption = optIndex === question.correctAnswer;
                                let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                                if (isAnswered) {
                                  if (isCorrectOption) buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                                  else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                                  else buttonStyle = "bg-muted/50 border-transparent opacity-50";
                                }

                                return (
                                  <motion.button
                                    key={optIndex}
                                    onClick={() => handleSelectAnswer(question.id, optIndex, qIndex)}
                                    className={`p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                    disabled={isAnswered}
                                  >
                                    <span className="flex items-center gap-2">
                                      {isAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                                      {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                                      {option}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Explanation - shows after answering */}
                            <AnimatePresence>
                              {isAnswered && question.explanation && (
                                <motion.div
                                  className="mt-4 p-4 rounded-2xl flex items-start gap-3 bg-violet-500/10 border border-violet-500/30"
                                  initial={{ opacity: 0, y: -10, height: 0 }}
                                  animate={{ opacity: 1, y: 0, height: "auto" }}
                                  exit={{ opacity: 0, y: -10, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-violet-500" />
                                  <div>
                                    <p className="font-semibold text-sm mb-1">الشرح:</p>
                                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                        ) : (
                          <motion.div
                            key="back"
                            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-3xl overflow-hidden"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-8 relative">
                              {/* Top Left Buttons Container */}
                              <div className="absolute top-3 left-2 flex items-center gap-0.5">
                                {/* Report Button */}
                                <button
                                  onClick={() => setReportModal({ show: true, questionId: question.id, questionPrompt: question.prompt })}
                                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                                  title="الإبلاغ عن السؤال"
                                >
                                  <Flag className="w-4 h-4" />
                                </button>

                                {/* Back to Question Button */}
                                <motion.button
                                  onClick={() => toggleFlipCard(qIndex)}
                                  className="p-2 rounded-full hover:bg-amber-500/20 transition-colors text-amber-500 hover:text-amber-400"
                                  title="العودة للسؤال"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <RotateCcw className="w-5 h-5" />
                                </motion.button>
                              </div>

                              <div className="flex items-center gap-3 mb-6 mt-6">
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                  <Lightbulb className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-amber-500">كيف أحل؟</h3>
                                  <p className="text-sm text-muted-foreground">طريقة حل هذا النوع من الأسئلة</p>
                                </div>
                              </div>

                              <div className="bg-card/50 rounded-2xl p-6">
                                {question.howToSolve?.split('\n\n').map((paragraph, pIdx) => (
                                  <div key={pIdx} className={pIdx > 0 ? "mt-5 pt-5 border-t border-amber-500/20" : ""}>
                                    {paragraph.split('\n').map((line, lIdx) => (
                                      <p
                                        key={lIdx}
                                        className={`text-base leading-relaxed mb-2 ${
                                          line.startsWith('مثال') || (line.includes('=') && !line.startsWith('١') && !line.startsWith('٢') && !line.startsWith('٣'))
                                            ? 'font-mono bg-amber-500/10 rounded-lg px-4 py-2 my-3 text-amber-600 dark:text-amber-400'
                                            : 'text-foreground'
                                        }`}
                                        dir="rtl"
                                      >
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                ))}
                              </div>

                              <motion.button
                                onClick={() => toggleFlipCard(qIndex)}
                                className="w-full mt-6 py-4 bg-amber-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <RotateCcw className="w-5 h-5" />
                                فهمت، أريد الإجابة
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Failed attempts on the left (in RTL layout) */}
                    {hasFailedAttempts && (
                      <div className="flex gap-2 flex-shrink-0">
                        {failed.map((attempt, attemptIdx) => (
                          <motion.div
                            key={`failed-${attemptIdx}`}
                            className="w-72 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 opacity-60"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 0.6, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                <XCircle className="w-4 h-4 text-red-400" />
                              </span>
                              <p className="text-sm font-medium text-muted-foreground">{attempt.question.prompt}</p>
                            </div>
                            <div className="space-y-2">
                              {attempt.question.options.map((opt, optIdx) => {
                                const wasSelected = attempt.wrongAnswer === optIdx;
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
                            {/* Explanation for failed attempt */}
                            {attempt.question.explanation && (
                              <div className="mt-3 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <div className="flex items-start gap-2">
                                  <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5 text-violet-500" />
                                  <p className="text-xs text-muted-foreground">{attempt.question.explanation}</p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>

          {!submitted && revealedCount < questions.length && (
            <motion.div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
              <Lock className="w-5 h-5" />
              <span>{questions.length - revealedCount} أسئلة متبقية</span>
            </motion.div>
          )}
        </div>
      )}

      {/* MODE 2: Scroll Snap */}
      {viewMode === "scroll" && (
        <>
          <div className="relative">
            {questions.map((originalQuestion, qIndex) => {
              const question = getCurrentQuestion(qIndex);
              const selectedAnswer = answers[question.id];
              const isActive = qIndex === currentIndex;
              const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
              const isCorrect = selectedAnswer === question.correctAnswer;

              return (
                <motion.div
                  key={`${originalQuestion.id}-${variantIndex[qIndex] || 0}`}
                  ref={el => questionRefs.current[qIndex] = el}
                  className={`transition-all duration-300 mb-8 ${
                    isActive ? "opacity-100 scale-100" : "opacity-20 scale-95 pointer-events-none"
                  }`}
                  initial={(variantIndex[qIndex] || 0) > 0 ? { opacity: 0, x: 300 } : { opacity: 0, y: 20 }}
                  animate={{
                    opacity: isActive ? 1 : 0.2,
                    x: 0,
                    y: 0
                  }}
                >
                  <div className="bg-card rounded-3xl p-8 relative">
                    {/* Report Button */}
                    <button
                      onClick={() => setReportModal({ show: true, questionId: question.id, questionPrompt: question.prompt })}
                      className="absolute top-3 left-2 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                      title="الإبلاغ عن السؤال"
                    >
                      <Flag className="w-4 h-4" />
                    </button>

                    {/* Reading Comprehension Passage Box */}
                    {question.passageText && (
                      <motion.div
                        className="mb-6 relative"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="absolute -right-3 top-4 w-1 h-16 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-violet-500 dark:to-purple-500 rounded-full" />
                        <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-6 border border-blue-300/60 dark:border-slate-700/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200/50 dark:border-slate-700/50">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-500 dark:to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-violet-500/20">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-blue-800 dark:text-slate-200">{question.passageTitle || "القطعة"}</h4>
                              <p className="text-xs text-blue-600 dark:text-slate-400">اقرأ النص بتمعن ثم أجب</p>
                            </div>
                          </div>
                          <p className="text-lg leading-loose text-blue-900 dark:text-slate-300 whitespace-pre-line">
                            {question.passageText}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Question Section */}
                    <div className={`flex items-start gap-4 ${question.passageText ? 'mb-4 pt-4 border-t border-border/50' : 'mb-6'}`}>
                      <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        isAnswered
                          ? isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
                          : "bg-primary text-primary-foreground"
                      }`}>
                        {isAnswered ? (
                          isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                        ) : qIndex + 1}
                      </span>
                      <div className="flex-1">
                        {question.passageText && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-500 dark:text-violet-400 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            السؤال
                          </span>
                        )}
                        <p className="text-xl font-medium" dangerouslySetInnerHTML={{ __html: question.prompt }} />
                      </div>
                    </div>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 ${question.passageText ? 'mr-0' : 'mr-0 sm:mr-16'}`}>
                      {question.options.map((option, optIndex) => {
                        const isSelected = selectedAnswer === optIndex;
                        const isCorrectOption = optIndex === question.correctAnswer;
                        let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                        if (isAnswered) {
                          if (isCorrectOption) buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                          else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                          else buttonStyle = "bg-muted/50 border-transparent opacity-50";
                        }

                        return (
                          <motion.button
                            key={optIndex}
                            onClick={() => handleSelectAnswer(question.id, optIndex, qIndex)}
                            className={`p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                            whileHover={!isAnswered && isActive ? { scale: 1.02 } : {}}
                            whileTap={!isAnswered && isActive ? { scale: 0.98 } : {}}
                            disabled={isAnswered || !isActive}
                          >
                            <span className="flex items-center gap-2">
                              {isAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                              {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                              {option}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Explanation - shows after answering */}
                    <AnimatePresence>
                      {isAnswered && question.explanation && (
                        <motion.div
                          className="mt-4 p-4 rounded-2xl flex items-start gap-3 bg-violet-500/10 border border-violet-500/30"
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-violet-500" />
                          <div>
                            <p className="font-semibold text-sm mb-1">الشرح:</p>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <motion.button
              onClick={() => scrollToQuestion(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full bg-card shadow-lg ${currentIndex === 0 ? "opacity-30" : "hover:bg-muted"}`}
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={() => scrollToQuestion(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1}
              className={`p-3 rounded-full bg-card shadow-lg ${currentIndex === questions.length - 1 ? "opacity-30" : "hover:bg-muted"}`}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Progress Dots */}
          <div className="fixed left-8 bottom-8 flex flex-col gap-1.5 z-20">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? "bg-primary scale-125" : answers[q.id] !== undefined ? "bg-green-500" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* MODE 3: Normal (All questions visible) */}
      {viewMode === "normal" && (
        <div className="space-y-6">
          {questions.map((originalQuestion, qIndex) => {
            const question = getCurrentQuestion(qIndex);
            const selectedAnswer = answers[question.id];
            const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
            const isCorrect = selectedAnswer === question.correctAnswer;

            return (
              <motion.div
                key={`${originalQuestion.id}-${variantIndex[qIndex] || 0}`}
                className="bg-card rounded-3xl p-8 relative"
                initial={(variantIndex[qIndex] || 0) > 0 ? { opacity: 0, x: 300 } : { opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Report Button */}
                <button
                  onClick={() => setReportModal({ show: true, questionId: question.id, questionPrompt: question.prompt })}
                  className="absolute top-3 left-2 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                  title="الإبلاغ عن السؤال"
                >
                  <Flag className="w-4 h-4" />
                </button>

                {/* Reading Comprehension Passage Box */}
                {question.passageText && (
                  <motion.div
                    className="mb-6 relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="absolute -right-3 top-4 w-1 h-16 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-violet-500 dark:to-purple-500 rounded-full" />
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-6 border border-blue-300/60 dark:border-slate-700/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200/50 dark:border-slate-700/50">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-500 dark:to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-violet-500/20">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-blue-800 dark:text-slate-200">{question.passageTitle || "القطعة"}</h4>
                          <p className="text-xs text-blue-600 dark:text-slate-400">اقرأ النص بتمعن ثم أجب</p>
                        </div>
                      </div>
                      <p className="text-base leading-loose text-blue-900 dark:text-slate-300 whitespace-pre-line">
                        {question.passageText}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Question Section */}
                <div className={`flex items-start gap-4 ${question.passageText ? 'mb-4 pt-4 border-t border-border/50' : 'mb-6'}`}>
                  <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    isAnswered
                      ? isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
                      : "bg-primary/20 text-primary"
                  }`}>
                    {isAnswered ? (
                      isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                    ) : qIndex + 1}
                  </span>
                  <div className="flex-1">
                    {question.passageText && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-500 dark:text-violet-400 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        السؤال
                      </span>
                    )}
                    <p className="text-xl font-medium" dangerouslySetInnerHTML={{ __html: question.prompt }} />
                  </div>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${question.passageText ? 'mr-0' : 'mr-16'}`}>
                  {question.options.map((option, optIndex) => {
                    const isSelected = selectedAnswer === optIndex;
                    const isCorrectOption = optIndex === question.correctAnswer;
                    let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                    if (isAnswered) {
                      if (isCorrectOption) buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                      else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                      else buttonStyle = "bg-muted/50 border-transparent opacity-50";
                    }

                    return (
                      <motion.button
                        key={optIndex}
                        onClick={() => handleSelectAnswer(question.id, optIndex, qIndex)}
                        className={`p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                        whileHover={!isAnswered ? { scale: 1.01 } : {}}
                        whileTap={!isAnswered ? { scale: 0.99 } : {}}
                        disabled={isAnswered}
                      >
                        <span className="flex items-center gap-2">
                          {isAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                          {option}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation - shows after answering */}
                <AnimatePresence>
                  {isAnswered && question.explanation && (
                    <motion.div
                      className="mt-4 p-4 rounded-2xl flex items-start gap-3 bg-violet-500/10 border border-violet-500/30"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-violet-500" />
                      <div>
                        <p className="font-semibold text-sm mb-1">الشرح:</p>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit Button */}
      {!submitted && (
        <motion.div
          className="sticky bottom-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
            className={`w-full py-4 rounded-3xl font-bold text-lg shadow-lg transition-all ${
              answeredCount === questions.length
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            whileHover={answeredCount === questions.length ? { scale: 1.02 } : {}}
            whileTap={answeredCount === questions.length ? { scale: 0.98 } : {}}
          >
            {answeredCount === questions.length
              ? "تسليم الإجابات"
              : `أجب على جميع الأسئلة (${answeredCount}/${questions.length})`}
          </motion.button>
        </motion.div>
      )}

      {/* Action Buttons after submission */}
      {submitted && (
        <motion.div
          className="flex gap-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={handleRestart}
            className="flex-1 py-4 bg-muted hover:bg-muted/80 rounded-3xl font-bold text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
            إعادة التمرين
          </motion.button>
          <motion.button
            onClick={onBack}
            className="flex-1 py-4 bg-primary text-primary-foreground rounded-3xl font-bold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            العودة للرئيسية
          </motion.button>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default CollectionView;
