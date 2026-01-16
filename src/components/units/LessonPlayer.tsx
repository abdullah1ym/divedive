import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FoundationalLesson, LessonContent } from "@/types/units";
import { useUnits } from "@/contexts/UnitsContext";
import { ArrowRight, ArrowLeft, CheckCircle2, Lightbulb, BookOpen, Calculator, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LessonPlayerProps {
  lesson: FoundationalLesson;
  unitId: string;
  onBack: () => void;
  onComplete: () => void;
}

const ContentCard = ({ content }: { content: LessonContent }) => {
  const getIcon = () => {
    switch (content.type) {
      case "tip":
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case "example":
        return <BookOpen className="w-5 h-5 text-primary" />;
      case "formula":
        return <Calculator className="w-5 h-5 text-turquoise" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (content.type) {
      case "tip":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "example":
        return "bg-primary/10 border-primary/20";
      case "formula":
        return "bg-turquoise/10 border-turquoise/20";
      default:
        return "bg-card border-border/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 border ${getBgColor()}`}
    >
      {content.title && (
        <div className="flex items-center gap-2 mb-4">
          {getIcon()}
          <h3 className="font-bold text-lg">{content.title}</h3>
        </div>
      )}

      <div className="text-foreground/90 whitespace-pre-line leading-relaxed">
        {content.content}
      </div>

      {content.example && (
        <div className="mt-4 p-4 rounded-xl bg-background/50 space-y-3">
          <div className="font-medium text-primary">{content.example.problem}</div>
          <div className="space-y-2">
            {content.example.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-border/50">
            <span className="text-muted-foreground">الجواب: </span>
            <span className="font-bold text-green-500">{content.example.solution}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const LessonPlayer = ({ lesson, unitId, onBack, onComplete }: LessonPlayerProps) => {
  const { markLessonWatched } = useUnits();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showKeyPoints, setShowKeyPoints] = useState(false);

  const totalSteps = lesson.contents.length + 1; // +1 for key points
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentIndex < lesson.contents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (!showKeyPoints) {
      setShowKeyPoints(true);
    }
  };

  const handlePrev = () => {
    if (showKeyPoints) {
      setShowKeyPoints(false);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    markLessonWatched(unitId);
    onComplete();
  };

  const isLastStep = showKeyPoints;
  const isFirstStep = currentIndex === 0 && !showKeyPoints;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.duration}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {showKeyPoints ? "النقاط المهمة" : `${currentIndex + 1} / ${lesson.contents.length}`}
          </span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!showKeyPoints ? (
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ContentCard content={lesson.contents[currentIndex]} />
          </motion.div>
        ) : (
          <motion.div
            key="keypoints"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-lg">النقاط المهمة</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0 text-sm">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isFirstStep}
            className="flex-1"
          >
            <ChevronRight className="w-4 h-4 ml-2" />
            السابق
          </Button>

          {isLastStep ? (
            <Button onClick={handleComplete} className="flex-1 bg-green-500 hover:bg-green-600">
              <CheckCircle2 className="w-4 h-4 ml-2" />
              إنهاء الدرس
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              التالي
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
