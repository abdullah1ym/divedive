import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, RotateCcw, ChevronLeft, BookOpen, Lightbulb } from "lucide-react";
import { LearningUnit, UnitQuestion, ExerciseSet } from "@/types/units";
import { useUnits } from "@/contexts/UnitsContext";

interface UnitExerciseModalProps {
  unit: LearningUnit;
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "select" | "exercise" | "lesson";

const UnitExerciseModal = ({ unit, isOpen, onClose }: UnitExerciseModalProps) => {
  const { recordQuestionAnswer } = useUnits();
  const [viewState, setViewState] = useState<ViewState>("select");
  const [selectedSet, setSelectedSet] = useState<ExerciseSet | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelectSet = (set: ExerciseSet) => {
    setSelectedSet(set);
    setViewState("exercise");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
    setShowHint(false);
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult || !selectedSet) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const question = selectedSet.questions[currentQuestion];
    const isCorrect = index === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    // Record the answer
    recordQuestionAnswer(unit.id, selectedSet.id, isCorrect, question.id);
  };

  const handleNext = () => {
    if (!selectedSet) return;

    if (currentQuestion === selectedSet.questions.length - 1) {
      setCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
    setShowHint(false);
  };

  const handleBack = () => {
    if (viewState === "exercise" || viewState === "lesson") {
      setViewState("select");
      setSelectedSet(null);
      handleRestart();
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setViewState("select");
    setSelectedSet(null);
    handleRestart();
    onClose();
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "تأسيسي";
      case "medium": return "متوسط";
      case "hard": return "تجميعات";
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-mint/20 text-mint border-mint/30";
      case "medium": return "bg-yellow/20 text-yellow border-yellow/30";
      case "hard": return "bg-coral/20 text-coral border-coral/30";
      default: return "bg-muted";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold">{unit.title}</h2>
                <p className="text-sm text-muted-foreground">{unit.description}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {viewState === "select" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Foundational Lesson */}
                {unit.foundationalLesson && (
                  <motion.button
                    onClick={() => setViewState("lesson")}
                    className="w-full p-4 bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 rounded-xl text-right transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{unit.foundationalLesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{unit.foundationalLesson.duration} • درس تأسيسي</p>
                      </div>
                    </div>
                  </motion.button>
                )}

                <div className="pt-2">
                  <h3 className="font-bold mb-3">اختر مستوى التمارين:</h3>
                  <div className="space-y-3">
                    {unit.exerciseSets.map((set) => (
                      <motion.button
                        key={set.id}
                        onClick={() => handleSelectSet(set)}
                        className={`w-full p-4 border-2 rounded-xl text-right transition-colors ${getDifficultyColor(set.difficulty)}`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold">{set.title}</h4>
                            <p className="text-sm opacity-80">{set.questions.length} سؤال • {getDifficultyLabel(set.difficulty)}</p>
                          </div>
                          <span className="text-2xl">
                            {set.difficulty === "easy" ? "🌱" : set.difficulty === "medium" ? "🌿" : "🌳"}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {viewState === "lesson" && unit.foundationalLesson && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {unit.foundationalLesson.contents.map((content) => (
                  <div key={content.id} className="space-y-2">
                    {content.title && (
                      <h3 className="font-bold text-lg">{content.title}</h3>
                    )}

                    {content.type === "text" && (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.content}</p>
                    )}

                    {content.type === "tip" && (
                      <div className="p-4 bg-yellow/10 border border-yellow/30 rounded-xl">
                        <p className="whitespace-pre-line">{content.content}</p>
                      </div>
                    )}

                    {content.type === "formula" && (
                      <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl font-mono text-sm whitespace-pre-line">
                        {content.content}
                      </div>
                    )}

                    {content.type === "example" && content.example && (
                      <div className="p-4 bg-mint/10 border border-mint/30 rounded-xl space-y-3">
                        <p className="font-bold">{content.example.problem}</p>
                        <div className="space-y-1">
                          {content.example.steps.map((step, i) => (
                            <p key={i} className="text-sm text-muted-foreground">• {step}</p>
                          ))}
                        </div>
                        <p className="font-bold text-mint">الحل: {content.example.solution}</p>
                      </div>
                    )}
                  </div>
                ))}

                {unit.foundationalLesson.keyPoints && (
                  <div className="p-4 bg-muted rounded-xl">
                    <h4 className="font-bold mb-2">النقاط الأساسية:</h4>
                    <ul className="space-y-1">
                      {unit.foundationalLesson.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm text-muted-foreground">✓ {point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setViewState("select")}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                >
                  ابدأ التمارين
                </button>
              </motion.div>
            )}

            {viewState === "exercise" && selectedSet && !completed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>السؤال {currentQuestion + 1} من {selectedSet.questions.length}</span>
                    <span className="text-turquoise font-medium">النتيجة: {score}/{selectedSet.questions.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-turquoise"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / selectedSet.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <p className="text-lg font-medium whitespace-pre-line leading-relaxed">
                    {selectedSet.questions[currentQuestion].prompt}
                  </p>

                  {/* Hint Button */}
                  {selectedSet.questions[currentQuestion].hint && !showResult && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="mt-3 text-sm text-yellow flex items-center gap-1 hover:underline"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? "إخفاء التلميح" : "عرض تلميح"}
                    </button>
                  )}

                  {showHint && selectedSet.questions[currentQuestion].hint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 p-3 bg-yellow/10 border border-yellow/30 rounded-lg text-sm"
                    >
                      💡 {selectedSet.questions[currentQuestion].hint}
                    </motion.div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {selectedSet.questions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === selectedSet.questions[currentQuestion].correctAnswer;

                    let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                    if (showResult) {
                      if (isCorrectOption) {
                        buttonStyle = "bg-turquoise/20 border-turquoise text-turquoise";
                      } else if (isSelected && !isCorrectOption) {
                        buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                      } else {
                        buttonStyle = "bg-muted/50 border-transparent opacity-50";
                      }
                    } else if (isSelected) {
                      buttonStyle = "bg-primary/20 border-primary";
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleSelectAnswer(index)}
                        className={`w-full p-4 rounded-xl text-right font-medium border-2 transition-all ${buttonStyle}`}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center text-sm shrink-0">
                            {String.fromCharCode(1571 + index)}
                          </span>
                          {showResult && isCorrectOption && (
                            <CheckCircle className="w-5 h-5 text-turquoise shrink-0" />
                          )}
                          {showResult && isSelected && !isCorrectOption && (
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                          )}
                          <span className="flex-1">{option}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Result & Explanation */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <div className={`p-4 rounded-xl ${
                      selectedAnswer === selectedSet.questions[currentQuestion].correctAnswer
                        ? "bg-turquoise/20 text-turquoise"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      <p className="font-bold">
                        {selectedAnswer === selectedSet.questions[currentQuestion].correctAnswer
                          ? "✓ إجابة صحيحة!"
                          : "✗ إجابة خاطئة"}
                      </p>
                    </div>

                    {selectedSet.questions[currentQuestion].explanation && (
                      <div className="mt-3 p-4 bg-muted rounded-xl">
                        <p className="text-sm font-medium mb-1">التفسير:</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedSet.questions[currentQuestion].explanation}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleNext}
                      className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                    >
                      {currentQuestion === selectedSet.questions.length - 1 ? "عرض النتيجة" : "السؤال التالي"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {viewState === "exercise" && completed && selectedSet && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-turquoise/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-12 h-12 text-turquoise" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-2">أحسنت!</h3>
                <p className="text-muted-foreground mb-6">لقد أكملت التمرين</p>

                <div className="bg-muted/50 rounded-xl p-6 mb-6">
                  <p className="text-4xl font-bold text-turquoise mb-2">
                    {score}/{selectedSet.questions.length}
                  </p>
                  <p className="text-muted-foreground">
                    {score === selectedSet.questions.length
                      ? "ممتاز! إجابات صحيحة بالكامل 🎉"
                      : score >= selectedSet.questions.length * 0.7
                      ? "جيد جداً! استمر في التدريب 👏"
                      : score >= selectedSet.questions.length * 0.5
                      ? "لا بأس، حاول مرة أخرى 💪"
                      : "راجع الدرس وحاول مرة أخرى 📚"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleRestart}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    إعادة
                  </motion.button>
                  <motion.button
                    onClick={() => setViewState("select")}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    مستوى آخر
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UnitExerciseModal;
