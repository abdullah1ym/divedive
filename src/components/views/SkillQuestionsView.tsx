import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle, Lightbulb, Circle, Brain } from "lucide-react";
import { useState } from "react";
import { SkillNode } from "@/contexts/SkillsContext";
import { pinnedCollections } from "@/components/LessonGrid";

interface SkillQuestionsViewProps {
  skill: SkillNode;
  onBack: () => void;
  mapType: "math" | "verbal";
}

// Get questions for a specific skill from collections
const getQuestionsForSkill = (skillTag: string, mapType: "math" | "verbal") => {
  const category = mapType === "math" ? "quantitative" : "verbal";
  const collections = pinnedCollections[category] || [];

  const questions: Array<{
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    collectionName: string;
  }> = [];

  collections.forEach(collection => {
    collection.questions.forEach(q => {
      if (q.skillTag === skillTag) {
        questions.push({
          ...q,
          collectionName: collection.name,
        });
      }
    });
  });

  return questions;
};

type SkillQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  collectionName: string;
};

const SkillQuestionsView = ({ skill, onBack, mapType }: SkillQuestionsViewProps) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<"unanswered" | "answered">("unanswered");
  const [activeQuestion, setActiveQuestion] = useState<SkillQuestion | null>(null);

  const questions = getQuestionsForSkill(skill.skillTag || "", mapType);
  const unansweredQuestions = questions.filter(q => answeredQuestions[q.id] === undefined);
  const answeredQuestionsList = questions.filter(q => answeredQuestions[q.id] !== undefined);

  // Use activeQuestion while showing result, otherwise use current from list
  const currentQuestion = showResult && activeQuestion ? activeQuestion : unansweredQuestions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || showResult) return;

    // Save the current question before it gets filtered out
    setActiveQuestion(currentQuestion);
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }));
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setActiveQuestion(null);
    // Don't increment index since the answered question is now filtered out
    // The next unanswered question will automatically be at the same index
  };

  const totalAnswered = Object.keys(answeredQuestions).length;
  const correctCount = Object.entries(answeredQuestions).filter(
    ([id, answer]) => questions.find(q => q.id === id)?.correctAnswer === answer
  ).length;

  return (
    <div className="absolute inset-0 bg-background p-6 overflow-y-auto z-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-6 sticky top-0 bg-card/95 backdrop-blur-sm py-4 px-4 z-20 rounded-3xl shadow-sm border border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{skill.title}</h1>
              <p className="text-xs text-muted-foreground truncate">
                {questions.length} سؤال متاح • {totalAnswered} تمت الإجابة عليه
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-center min-w-[60px]">
            <p className="text-xs text-muted-foreground">النتيجة</p>
            <p className="text-base font-bold">{correctCount}/{questions.length}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setActiveTab("unanswered")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === "unanswered"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            لم تُجب ({unansweredQuestions.length})
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("answered")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === "answered"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تمت الإجابة ({answeredQuestionsList.length})
          </motion.button>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 shadow-lg shadow-violet-500/50 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalAnswered / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Unanswered Tab Content */}
        {activeTab === "unanswered" && (
          <>
            {currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                className="bg-card rounded-3xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    showResult
                      ? answeredQuestions[currentQuestion.id] === currentQuestion.correctAnswer
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-400"
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {showResult ? (
                      answeredQuestions[currentQuestion.id] === currentQuestion.correctAnswer
                        ? <CheckCircle className="w-6 h-6" />
                        : <XCircle className="w-6 h-6" />
                    ) : currentQuestionIndex + 1}
                  </span>
                  <p className="text-xl font-medium pt-2">{currentQuestion.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mr-16">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answeredQuestions[currentQuestion.id] === index;
                    const isCorrectAnswer = index === currentQuestion.correctAnswer;

                    let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                    if (showResult) {
                      if (isCorrectAnswer) {
                        buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                      } else {
                        buttonStyle = "bg-muted/50 border-transparent opacity-50";
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={`p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                        whileHover={!showResult ? { scale: 1.02 } : {}}
                        whileTap={!showResult ? { scale: 0.98 } : {}}
                      >
                        <span className="flex items-center gap-2">
                          {showResult && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          {showResult && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                          {option}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && currentQuestion.explanation && (
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
                        <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {showResult && (
                  <motion.div
                    className="mt-6 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {currentQuestionIndex < unansweredQuestions.length - 1 ? (
                      <motion.button
                        onClick={handleNext}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        السؤال التالي
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => setActiveTab("answered")}
                        className="px-8 py-3 bg-turquoise text-turquoise-foreground rounded-xl font-semibold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        مراجعة الإجابات
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="bg-card rounded-3xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turquoise/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-turquoise" />
                </div>
                <h2 className="text-xl font-bold mb-2">أحسنت!</h2>
                <p className="text-muted-foreground mb-6">
                  لقد أجبت على جميع الأسئلة المتاحة لهذه المهارة
                </p>
                <p className="text-lg font-semibold text-turquoise mb-6">
                  {correctCount}/{questions.length} إجابة صحيحة
                </p>
                <motion.button
                  onClick={() => setActiveTab("answered")}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  مراجعة الإجابات
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Answered Tab Content */}
        {activeTab === "answered" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {answeredQuestionsList.length > 0 ? (
              <div className="space-y-4">
                {answeredQuestionsList.map((question, qIndex) => {
                  const userAnswer = answeredQuestions[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <motion.div
                      key={question.id}
                      className="bg-card rounded-3xl p-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.05 }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
                        }`}>
                          {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">{question.collectionName}</p>
                          <p className="text-xl font-medium">{question.prompt}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mr-16">
                        {question.options.map((option, index) => {
                          const isUserAnswer = userAnswer === index;
                          const isCorrectAnswer = index === question.correctAnswer;

                          let buttonStyle = "bg-muted/50 border-transparent opacity-50";
                          if (isCorrectAnswer) {
                            buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                          }

                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-2xl text-right font-medium border-2 min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                            >
                              <span className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                                {isUserAnswer && !isCorrectAnswer ? <span className="line-through">{option}</span> : option}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="mt-4 p-4 rounded-2xl flex items-start gap-3 bg-violet-500/10 border border-violet-500/30">
                          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-violet-500" />
                          <div>
                            <p className="font-semibold text-sm mb-1">الشرح:</p>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                className="bg-card rounded-3xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Circle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">لا توجد إجابات بعد</h2>
                <p className="text-muted-foreground mb-6">
                  ابدأ بالإجابة على الأسئلة لتظهر هنا
                </p>
                <motion.button
                  onClick={() => setActiveTab("unanswered")}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ابدأ الآن
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Back to Map Button */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={onBack}
            className="px-6 py-2 bg-muted text-muted-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            العودة للخريطة
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillQuestionsView;
