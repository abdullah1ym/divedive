import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LearningUnit, UnitProgress, ExerciseSet } from "@/types/units";
import { useUnits } from "@/contexts/UnitsContext";
import { ArrowRight, Play, BookOpen, Target, Trophy, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LessonPlayer from "./LessonPlayer";
import ExercisePlayer from "./ExercisePlayer";

interface UnitViewProps {
  unit: LearningUnit;
  onBack: () => void;
}

type ViewMode = "overview" | "lesson" | "exercise";

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: "سهل", color: "text-green-500" },
  medium: { label: "متوسط", color: "text-yellow-500" },
  hard: { label: "صعب", color: "text-red-500" },
};

const UnitView = ({ unit, onBack }: UnitViewProps) => {
  const { getUnitProgress, getRecommendations } = useUnits();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [activeExerciseSet, setActiveExerciseSet] = useState<ExerciseSet | null>(null);

  const progress = getUnitProgress(unit.id);
  const recommendations = getRecommendations(unit.id);

  const handleStartLesson = () => {
    setViewMode("lesson");
  };

  const handleStartExercise = (set: ExerciseSet) => {
    setActiveExerciseSet(set);
    setViewMode("exercise");
  };

  const handleBackToOverview = () => {
    setViewMode("overview");
    setActiveExerciseSet(null);
  };

  const getSetProgress = (setId: string) => {
    return progress?.exerciseProgress.find((ep) => ep.setId === setId);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {viewMode === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{unit.title}</h1>
                <p className="text-muted-foreground">{unit.description}</p>
              </div>
            </div>

            {/* Progress overview */}
            {progress && progress.overallProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-5 mb-6 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">تقدمك في هذه الوحدة</span>
                  <span className="text-primary font-bold">{progress.overallProgress}%</span>
                </div>
                <Progress value={progress.overallProgress} className="h-2 mb-3" />
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">الدقة: </span>
                    <span className={progress.accuracy >= 80 ? "text-green-500" : progress.accuracy >= 50 ? "text-yellow-500" : "text-red-500"}>
                      {progress.accuracy}%
                    </span>
                  </div>
                  {progress.lessonWatched && (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>شاهدت الدرس</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-5 mb-6 border border-yellow-500/20"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">{recommendations[0].message}</h3>
                    <p className="text-sm text-muted-foreground">{recommendations[0].reason}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Foundational Lesson */}
            {unit.foundationalLesson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-5 mb-6 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{unit.foundationalLesson.title}</h3>
                      {progress?.lessonWatched && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {unit.foundationalLesson.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {unit.foundationalLesson.duration}
                    </span>
                  </div>
                  <Button onClick={handleStartLesson} variant="outline">
                    {progress?.lessonWatched ? "إعادة المشاهدة" : "ابدأ"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Exercise Sets */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                التمارين
              </h2>

              {unit.exerciseSets.map((set, index) => {
                const setProgress = getSetProgress(set.id);
                const isCompleted = setProgress?.completedAt;
                const questionsAnswered = setProgress?.questionsAnswered || 0;
                const correctAnswers = setProgress?.correctAnswers || 0;
                const setAccuracy = questionsAnswered > 0
                  ? Math.round((correctAnswers / questionsAnswered) * 100)
                  : 0;

                return (
                  <motion.div
                    key={set.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-card rounded-2xl p-5 border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        set.type === "collection"
                          ? "bg-coral/10"
                          : "bg-turquoise/10"
                      }`}>
                        {set.type === "collection" ? (
                          <Trophy className={`w-5 h-5 text-coral`} />
                        ) : (
                          <BookOpen className={`w-5 h-5 text-turquoise`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{set.title}</h3>
                          <span className={`text-xs ${difficultyLabels[set.difficulty].color}`}>
                            ({difficultyLabels[set.difficulty].label})
                          </span>
                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{set.questions.length} سؤال</span>
                          {questionsAnswered > 0 && (
                            <>
                              <span>•</span>
                              <span>أجبت {questionsAnswered}</span>
                              <span>•</span>
                              <span className={setAccuracy >= 80 ? "text-green-500" : setAccuracy >= 50 ? "text-yellow-500" : "text-red-500"}>
                                {setAccuracy}% صحيح
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartExercise(set)}
                        variant={questionsAnswered > 0 ? "outline" : "default"}
                      >
                        {questionsAnswered > 0 ? "متابعة" : "ابدأ"}
                      </Button>
                    </div>

                    {/* Progress bar for set */}
                    {questionsAnswered > 0 && (
                      <div className="mt-4">
                        <Progress
                          value={(questionsAnswered / set.questions.length) * 100}
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === "lesson" && unit.foundationalLesson && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <LessonPlayer
              lesson={unit.foundationalLesson}
              unitId={unit.id}
              onBack={handleBackToOverview}
              onComplete={handleBackToOverview}
            />
          </motion.div>
        )}

        {viewMode === "exercise" && activeExerciseSet && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <ExercisePlayer
              exerciseSet={activeExerciseSet}
              unitId={unit.id}
              onBack={handleBackToOverview}
              onComplete={handleBackToOverview}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnitView;
