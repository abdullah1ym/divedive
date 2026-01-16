import { motion } from "framer-motion";
import { LearningUnit, UnitProgress } from "@/types/units";
import { Brain, BookOpen, Calculator, FileText, Shapes, BarChart3, Lock, CheckCircle2, Star, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UnitCardProps {
  unit: LearningUnit;
  progress?: UnitProgress;
  onClick: () => void;
  index?: number;
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  BookOpen,
  Calculator,
  FileText,
  Shapes,
  BarChart3,
};

const colorClasses: Record<string, { bg: string; text: string; gradient: string }> = {
  turquoise: {
    bg: "bg-turquoise/10",
    text: "text-turquoise",
    gradient: "from-turquoise/20 to-turquoise/5",
  },
  coral: {
    bg: "bg-coral/10",
    text: "text-coral",
    gradient: "from-coral/20 to-coral/5",
  },
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  mint: {
    bg: "bg-mint/10",
    text: "text-mint",
    gradient: "from-mint/20 to-mint/5",
  },
};

const UnitCard = ({ unit, progress, onClick, index = 0 }: UnitCardProps) => {
  const Icon = iconMap[unit.icon] || Brain;
  const colors = colorClasses[unit.color] || colorClasses.primary;

  const isLocked = progress?.status === "locked";
  const isCompleted = progress?.status === "completed" || progress?.status === "mastered";
  const isMastered = progress?.status === "mastered";
  const progressPercent = progress?.overallProgress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={isLocked ? undefined : onClick}
      className={`
        relative rounded-2xl p-5 cursor-pointer transition-all duration-300
        bg-gradient-to-br ${colors.gradient} border border-border/50
        ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-lg"}
        ${isCompleted ? "ring-2 ring-green-500/30" : ""}
      `}
    >
      {/* Status badge */}
      {isLocked && (
        <div className="absolute top-3 left-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      {isMastered && (
        <div className="absolute top-3 left-3">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </div>
      )}
      {isCompleted && !isMastered && (
        <div className="absolute top-3 left-3">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-7 h-7 ${colors.text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1">{unit.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {unit.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span>{unit.totalQuestions} سؤال</span>
            <span>•</span>
            <span>{unit.estimatedDuration}</span>
            {unit.foundationalLesson && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  درس تأسيسي
                </span>
              </>
            )}
          </div>

          {/* Progress bar */}
          {progressPercent > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">التقدم</span>
                <span className={colors.text}>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          )}

          {/* Accuracy indicator */}
          {progress && progress.accuracy > 0 && (
            <div className="mt-2 text-xs">
              <span className="text-muted-foreground">الدقة: </span>
              <span className={progress.accuracy >= 80 ? "text-green-500" : progress.accuracy >= 50 ? "text-yellow-500" : "text-red-500"}>
                {progress.accuracy}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recommendation badge */}
      {progress?.needsLessonReview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-600 dark:text-yellow-400"
        >
          💡 ننصحك بمراجعة الدرس التأسيسي
        </motion.div>
      )}
    </motion.div>
  );
};

export default UnitCard;
