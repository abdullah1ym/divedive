import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, XCircle, Timer, Zap, BarChart3, AlertTriangle } from "lucide-react";
import { Exercise, useExercises } from "@/contexts/ExercisesContext";

interface SimulationTestViewProps {
  exercise: Exercise;
  onBack: () => void;
}

type QuestionState = "neutral" | "answered" | "skipped";

interface SimulationQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  type: "math" | "verbal";
  section: number;
  indexInSection: number;
}

const TOTAL_SECTIONS = 5;
const MATH_PER_SECTION = 11;
const VERBAL_PER_SECTION = 13;
const QUESTIONS_PER_SECTION = MATH_PER_SECTION + VERBAL_PER_SECTION; // 24
const TOTAL_QUESTIONS = TOTAL_SECTIONS * QUESTIONS_PER_SECTION; // 120
const TOTAL_TIME_MINUTES = 125;
const TOTAL_TIME_SECONDS = TOTAL_TIME_MINUTES * 60;

const SimulationTestView = ({ exercise, onBack }: SimulationTestViewProps) => {
  const { getExercisesByCategory } = useExercises();

  // Get questions from math and verbal categories
  const mathExercises = getExercisesByCategory("all-math");
  const verbalExercises = getExercisesByCategory("all-verbal");

  const allMathQuestions = mathExercises.flatMap(e => e.questions);
  const allVerbalQuestions = verbalExercises.flatMap(e => e.questions);

  // Build 120 questions: 5 sections × (11 math + 13 verbal)
  const [questions] = useState<SimulationQuestion[]>(() => {
    const result: SimulationQuestion[] = [];
    let globalIndex = 0;

    for (let section = 1; section <= TOTAL_SECTIONS; section++) {
      // Add 11 math questions
      for (let i = 0; i < MATH_PER_SECTION; i++) {
        const sourceQ = allMathQuestions[globalIndex % allMathQuestions.length] || {
          id: `math-${section}-${i}`,
          prompt: `سؤال كمي ${globalIndex + 1}`,
          options: ["أ", "ب", "ج", "د"],
          correctAnswer: 0,
        };
        result.push({
          id: `sim-${section}-math-${i}`,
          prompt: sourceQ.prompt,
          options: sourceQ.options,
          correctAnswer: sourceQ.correctAnswer,
          type: "math",
          section,
          indexInSection: i,
        });
        globalIndex++;
      }

      // Add 13 verbal questions
      for (let i = 0; i < VERBAL_PER_SECTION; i++) {
        const sourceQ = allVerbalQuestions[i % allVerbalQuestions.length] || {
          id: `verbal-${section}-${i}`,
          prompt: `سؤال لفظي ${globalIndex + 1}`,
          options: ["أ", "ب", "ج", "د"],
          correctAnswer: 0,
        };
        result.push({
          id: `sim-${section}-verbal-${i}`,
          prompt: sourceQ.prompt,
          options: sourceQ.options,
          correctAnswer: sourceQ.correctAnswer,
          type: "verbal",
          section,
          indexInSection: MATH_PER_SECTION + i,
        });
        globalIndex++;
      }
    }

    return result;
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [currentIndexInSection, setCurrentIndexInSection] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>(() => {
    const initial: Record<number, QuestionState> = {};
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      initial[i] = "neutral";
    }
    return initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);
  const [sectionCompleted, setSectionCompleted] = useState<Record<number, boolean>>({
    1: false, 2: false, 3: false, 4: false, 5: false
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  const questionRef = useRef<HTMLDivElement>(null);

  // Get global index from section and index in section
  const getGlobalIndex = (section: number, indexInSection: number) => {
    return (section - 1) * QUESTIONS_PER_SECTION + indexInSection;
  };

  const currentGlobalIndex = getGlobalIndex(currentSection, currentIndexInSection);

  // Timer
  useEffect(() => {
    if (submitted) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigate to question within current section only
  const goToQuestion = (indexInSection: number) => {
    // Mark current question as skipped if not answered
    if (answers[currentGlobalIndex] === undefined && questionStates[currentGlobalIndex] === "neutral") {
      setQuestionStates(prev => ({ ...prev, [currentGlobalIndex]: "skipped" }));
    }
    setCurrentIndexInSection(indexInSection);
    questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Handle answer selection
  const handleSelectAnswer = (optionIndex: number) => {
    if (submitted) return;

    setAnswers(prev => ({ ...prev, [currentGlobalIndex]: optionIndex }));
    setQuestionStates(prev => ({ ...prev, [currentGlobalIndex]: "answered" }));
  };

  // Navigate to next question
  const goNext = () => {
    // Mark as skipped if not answered
    if (answers[currentGlobalIndex] === undefined) {
      setQuestionStates(prev => ({ ...prev, [currentGlobalIndex]: "skipped" }));
    }

    if (currentIndexInSection < QUESTIONS_PER_SECTION - 1) {
      // Move to next question in current section
      setCurrentIndexInSection(prev => prev + 1);
    }
    // If at end of section, user must click "إنهاء القسم" button
  };

  // Navigate to previous question (only within current section)
  const goPrev = () => {
    if (currentIndexInSection > 0) {
      setCurrentIndexInSection(prev => prev - 1);
    }
  };

  // Count unanswered questions in current section
  const getUnansweredInSection = () => {
    const sectionStart = (currentSection - 1) * QUESTIONS_PER_SECTION;
    let count = 0;
    for (let i = 0; i < QUESTIONS_PER_SECTION; i++) {
      if (answers[sectionStart + i] === undefined) count++;
    }
    return count;
  };

  // Try to finish section - check for unanswered first
  const tryFinishSection = () => {
    const unanswered = getUnansweredInSection();
    if (unanswered > 0) {
      setUnansweredCount(unanswered);
      setShowConfirmModal(true);
    } else {
      confirmFinishSection();
    }
  };

  // Actually finish the section
  const confirmFinishSection = () => {
    setShowConfirmModal(false);

    // Mark all unanswered in current section as skipped
    const sectionStart = (currentSection - 1) * QUESTIONS_PER_SECTION;
    const newStates = { ...questionStates };
    for (let i = 0; i < QUESTIONS_PER_SECTION; i++) {
      const globalIdx = sectionStart + i;
      if (answers[globalIdx] === undefined) {
        newStates[globalIdx] = "skipped";
      }
    }
    setQuestionStates(newStates);

    // Mark section as completed
    setSectionCompleted(prev => ({ ...prev, [currentSection]: true }));

    if (currentSection < TOTAL_SECTIONS) {
      // Move to next section
      setCurrentSection(prev => prev + 1);
      setCurrentIndexInSection(0);
    } else {
      // Last section - submit the test
      handleSubmit();
    }
  };

  // Cancel and go back to answer questions
  const cancelFinishSection = () => {
    setShowConfirmModal(false);
  };

  // Submit test
  const handleSubmit = () => {
    // Mark all unanswered as skipped
    const finalStates = { ...questionStates };
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      if (answers[i] === undefined) {
        finalStates[i] = "skipped";
      }
    }
    setQuestionStates(finalStates);
    setSubmitted(true);
  };

  // Calculate score
  const score = Object.entries(answers).reduce((acc, [idx, answer]) => {
    const q = questions[parseInt(idx)];
    if (q && answer === q.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentGlobalIndex];

  // Get questions for current section in nav panel
  const getCurrentSectionQuestions = () => {
    const start = (currentSection - 1) * QUESTIONS_PER_SECTION;
    return questions.slice(start, start + QUESTIONS_PER_SECTION);
  };

  // Count answered in current section
  const answeredInSection = () => {
    const start = (currentSection - 1) * QUESTIONS_PER_SECTION;
    let count = 0;
    for (let i = 0; i < QUESTIONS_PER_SECTION; i++) {
      if (answers[start + i] !== undefined) count++;
    }
    return count;
  };

  const xpEarned = submitted ? (score * 5) + 100 : 0;
  const percentage = (score / TOTAL_QUESTIONS) * 100;

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelFinishSection}
          >
            <motion.div
              className="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">أسئلة غير مجابة</h3>
                  <p className="text-sm text-muted-foreground">
                    لديك {unansweredCount} سؤال بدون إجابة
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {currentSection === TOTAL_SECTIONS
                  ? "هل أنت متأكد من تسليم الاختبار؟ لن تتمكن من العودة للإجابة على الأسئلة المتبقية."
                  : "هل أنت متأكد من الانتقال للقسم التالي؟ لن تتمكن من العودة لهذا القسم."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelFinishSection}
                  className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors"
                >
                  العودة للإجابة
                </button>
                <button
                  onClick={confirmFinishSection}
                  className="flex-1 py-3 bg-jellyfish text-jellyfish-foreground hover:bg-jellyfish/90 rounded-xl font-bold transition-colors"
                >
                  {currentSection === TOTAL_SECTIONS ? "تسليم" : "انتقال"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              className="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">الخروج من الاختبار؟</h3>
                  <p className="text-sm text-muted-foreground">سيتم فقدان تقدمك الحالي</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                أنت على وشك الخروج من الاختبار التجريبي. لن يتم حفظ إجاباتك.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl font-bold transition-colors"
                >
                  متابعة الاختبار
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold transition-colors"
                >
                  خروج
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6 sticky top-4 bg-card/95 backdrop-blur-sm py-4 px-4 z-30 rounded-3xl shadow-sm border border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => submitted ? onBack() : setShowExitModal(true)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-jellyfish/20 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-jellyfish" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{exercise.title}</h1>
            <p className="text-xs text-muted-foreground">القسم {currentSection} من {TOTAL_SECTIONS}</p>
          </div>
        </div>

        {/* Timer */}
        {!submitted && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
            timeRemaining < 300 ? "bg-red-500/20 text-red-500" : "bg-muted"
          }`}>
            <Timer className="w-5 h-5" />
            <span className="text-lg font-bold font-mono">{formatTime(timeRemaining)}</span>
          </div>
        )}

        {/* Progress */}
        <div className="flex-shrink-0 text-center min-w-[80px]">
          <p className="text-xs text-muted-foreground">التقدم</p>
          <p className="text-base font-bold">{answeredCount}/{TOTAL_QUESTIONS}</p>
        </div>
      </motion.div>

      {/* Results Banner */}
      {submitted && (
        <motion.div
          className={`bg-gradient-to-l ${
            percentage >= 80 ? 'from-green-500/20 to-jellyfish/20' :
            percentage >= 50 ? 'from-yellow-500/20 to-jellyfish/20' :
            'from-red-500/20 to-jellyfish/20'
          } rounded-3xl p-6 mb-6`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">النتيجة</h2>
              <p className={`text-4xl font-bold ${
                percentage >= 80 ? 'text-green-500' :
                percentage >= 50 ? 'text-yellow-500' :
                'text-red-500'
              }`}>{score}/{TOTAL_QUESTIONS}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {percentage >= 80 ? "ممتاز! أداء رائع" :
                 percentage >= 50 ? "جيد! استمر في التدريب" :
                 "تحتاج لمزيد من التدريب"}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-yellow/20 px-4 py-2 rounded-2xl">
              <Zap className="w-6 h-6 text-yellow" />
              <span className="text-xl font-bold text-yellow">+{xpEarned} XP</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-6">
        {/* Main Question Area */}
        <div className="flex-1">
          {/* Section Progress Bar */}
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(section => (
                <div
                  key={section}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium text-center transition-colors ${
                    currentSection === section
                      ? "bg-jellyfish text-jellyfish-foreground"
                      : sectionCompleted[section]
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {sectionCompleted[section] ? "✓" : ""} القسم {section}
                </div>
              ))}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-jellyfish to-purple-600 rounded-full"
                animate={{ width: `${((currentIndexInSection + 1) / QUESTIONS_PER_SECTION) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              السؤال {currentIndexInSection + 1} من {QUESTIONS_PER_SECTION} في القسم {currentSection}
            </p>
          </div>

          {/* Question Card */}
          <motion.div
            ref={questionRef}
            className="bg-card rounded-3xl p-8 mb-4"
            key={currentGlobalIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-jellyfish text-jellyfish-foreground flex items-center justify-center text-lg font-bold">
                  {currentIndexInSection + 1}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentQuestion?.type === "math"
                    ? "bg-coral/20 text-coral"
                    : "bg-turquoise/20 text-turquoise"
                }`}>
                  {currentQuestion?.type === "math" ? "كمي" : "لفظي"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {currentIndexInSection + 1} / {QUESTIONS_PER_SECTION}
              </span>
            </div>

            {/* Question Prompt */}
            <p className="text-xl font-medium mb-8">{currentQuestion?.prompt}</p>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion?.options.map((option, optIndex) => {
                const isSelected = answers[currentGlobalIndex] === optIndex;
                const isCorrectOption = optIndex === currentQuestion.correctAnswer;

                let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                if (submitted) {
                  if (isCorrectOption) buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                  else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                  else buttonStyle = "bg-muted/50 border-transparent opacity-50";
                } else if (isSelected) {
                  buttonStyle = "bg-jellyfish/20 border-jellyfish text-jellyfish";
                }

                return (
                  <motion.button
                    key={optIndex}
                    onClick={() => handleSelectAnswer(optIndex)}
                    className={`p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                    whileHover={!submitted ? { scale: 1.02 } : {}}
                    whileTap={!submitted ? { scale: 0.98 } : {}}
                    disabled={submitted}
                  >
                    <span className="flex items-center gap-2">
                      {submitted && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {submitted && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndexInSection === 0}
              className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              السابق
            </button>

            {submitted ? (
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-jellyfish text-jellyfish-foreground hover:bg-jellyfish/90 rounded-xl font-bold transition-colors"
              >
                العودة للرئيسية
              </button>
            ) : currentIndexInSection === QUESTIONS_PER_SECTION - 1 ? (
              <button
                onClick={tryFinishSection}
                className="flex-1 py-3 bg-jellyfish text-jellyfish-foreground hover:bg-jellyfish/90 rounded-xl font-bold transition-colors"
              >
                {currentSection === TOTAL_SECTIONS ? "تسليم الاختبار" : "إنهاء القسم والانتقال للتالي"}
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex-1 py-3 bg-jellyfish text-jellyfish-foreground hover:bg-jellyfish/90 rounded-xl font-medium transition-colors"
              >
                التالي
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation Panel - Current Section Only */}
        <motion.div
          className="w-72 bg-card rounded-3xl p-4 sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="font-bold mb-2 text-center">القسم {currentSection}</h3>
          <p className="text-xs text-muted-foreground mb-4 text-center">
            {answeredInSection()} / {QUESTIONS_PER_SECTION} تم الإجابة
          </p>

          {/* Current section questions grid */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {getCurrentSectionQuestions().map((q, idx) => {
              const globalIdx = getGlobalIndex(currentSection, idx);
              const state = questionStates[globalIdx];
              const isCurrent = idx === currentIndexInSection;

              let bgColor = "bg-muted hover:bg-muted/80"; // neutral
              if (state === "answered") bgColor = "bg-green-500 text-white hover:bg-green-600";
              else if (state === "skipped") bgColor = "bg-red-500 text-white hover:bg-red-600";

              return (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${bgColor} ${
                    isCurrent ? "ring-2 ring-jellyfish ring-offset-2 ring-offset-card" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Section type indicators */}
          <div className="flex flex-col gap-2 mb-4 p-3 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-coral"></span>
                كمي
              </span>
              <span className="text-muted-foreground">أسئلة 1-11</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-turquoise"></span>
                لفظي
              </span>
              <span className="text-muted-foreground">أسئلة 12-24</span>
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">الحالة:</p>
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-muted"></span>
                لم يُجب
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-green-500"></span>
                تم الإجابة
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-500"></span>
                تم التخطي
              </span>
            </div>
          </div>

          {/* Finish Section Button */}
          {!submitted && (
            <button
              onClick={tryFinishSection}
              className="w-full mt-4 py-3 bg-jellyfish text-jellyfish-foreground hover:bg-jellyfish/90 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {currentSection === TOTAL_SECTIONS ? "تسليم الاختبار" : "إنهاء القسم"}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SimulationTestView;
