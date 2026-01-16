import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExerciseSet, UnitQuestion } from "@/types/units";
import { useUnits } from "@/contexts/UnitsContext";
import { useUserProfile, QuestionData } from "@/contexts/UserProfileContext";
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, ChevronLeft, ChevronRight, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ExercisePlayerProps {
  exerciseSet: ExerciseSet;
  unitId: string;
  onBack: () => void;
  onComplete: () => void;
}

const ExercisePlayer = ({ exerciseSet, unitId, onBack, onComplete }: ExercisePlayerProps) => {
  const { recordQuestionAnswer, completeExerciseSet, getUnitProgress } = useUnits();
  const { addXp, recordAnswer } = useUserProfile();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [showSummary, setShowSummary] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  const questions = exerciseSet.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Check if question was already answered
  const unitProgress = getUnitProgress(unitId);
  const setProgress = unitProgress?.exerciseProgress.find(ep => ep.setId === exerciseSet.id);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record the answer
    recordQuestionAnswer(unitId, exerciseSet.id, isCorrect, currentQuestion.id);

    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1)
    }));

    // Mark as answered
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));

    // Record answer and handle XP/flashcards
    const questionData: QuestionData = {
      prompt: currentQuestion.prompt,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      exerciseTitle: exerciseSet.title,
      exerciseType: "quantitative" // TODO: Get from unit category
    };

    recordAnswer(isCorrect, 0, questionData, selectedAnswer);

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      // Complete the set
      completeExerciseSet(unitId, exerciseSet.id);
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setSessionStats({ correct: 0, wrong: 0 });
    setShowSummary(false);
    setAnsweredQuestions(new Set());
  };

  if (showSummary) {
    const accuracy = Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.wrong)) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-turquoise flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold mb-2">أحسنت!</h1>
        <p className="text-muted-foreground mb-8">أكملت {exerciseSet.title}</p>

        <div className="grid grid-cols-2 gap-6 mb-8 w-full max-w-xs">
          <div className="bg-green-500/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-500">{sessionStats.correct}</div>
            <div className="text-sm text-muted-foreground">صحيح</div>
          </div>
          <div className="bg-red-500/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-red-500">{sessionStats.wrong}</div>
            <div className="text-sm text-muted-foreground">خطأ</div>
          </div>
        </div>

        <div className="w-full max-w-xs mb-8">
          <div className="text-sm text-muted-foreground mb-2">الدقة</div>
          <div className="text-4xl font-bold mb-2" style={{ color: accuracy >= 80 ? "#22c55e" : accuracy >= 50 ? "#eab308" : "#ef4444" }}>
            {accuracy}%
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        <div className="flex gap-4 w-full max-w-xs">
          <Button variant="outline" onClick={handleRestart} className="flex-1">
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة
          </Button>
          <Button onClick={onComplete} className="flex-1">
            إنهاء
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">{exerciseSet.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>سؤال {currentIndex + 1} من {questions.length}</span>
            {currentQuestion.source === "collection" && currentQuestion.year && (
              <span className="px-2 py-0.5 rounded-full bg-coral/10 text-coral text-xs">
                تجميعات {currentQuestion.year}
              </span>
            )}
          </div>
        </div>
        <div className="text-sm">
          <span className="text-green-500">{sessionStats.correct}</span>
          {" / "}
          <span className="text-red-500">{sessionStats.wrong}</span>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-1.5 mb-6" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.prompt}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrectness = showResult;

              let bgColor = "bg-card";
              let borderColor = "border-border/50";
              let textColor = "";

              if (showCorrectness) {
                if (isCorrect) {
                  bgColor = "bg-green-500/10";
                  borderColor = "border-green-500";
                  textColor = "text-green-500";
                } else if (isSelected && !isCorrect) {
                  bgColor = "bg-red-500/10";
                  borderColor = "border-red-500";
                  textColor = "text-red-500";
                }
              } else if (isSelected) {
                bgColor = "bg-primary/10";
                borderColor = "border-primary";
                textColor = "text-primary";
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-right transition-all ${bgColor} ${borderColor} ${textColor} ${
                    !showResult ? "hover:border-primary/50" : ""
                  }`}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      showCorrectness && isCorrect
                        ? "bg-green-500 text-white"
                        : showCorrectness && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : isSelected
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}>
                      {String.fromCharCode(1571 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showCorrectness && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {showCorrectness && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Hint */}
          {currentQuestion.hint && !showResult && (
            <div className="mb-4">
              {showHint ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0" />
                    <p className="text-sm">{currentQuestion.hint}</p>
                  </div>
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-yellow-500"
                >
                  <Lightbulb className="w-4 h-4 ml-2" />
                  عرض تلميح
                </Button>
              )}
            </div>
          )}

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-primary/10 border border-primary/20"
            >
              <h4 className="font-medium mb-2">الشرح:</h4>
              <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full"
            >
              تحقق من الإجابة
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1"
              >
                <ChevronRight className="w-4 h-4 ml-2" />
                السابق
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {currentIndex === questions.length - 1 ? "إنهاء" : "التالي"}
                <ChevronLeft className="w-4 h-4 mr-2" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePlayer;
