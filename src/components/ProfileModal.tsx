import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Flame,
  Target,
  Clock,
  Brain,
  Trophy,
  Star,
  Zap,
  Award,
  Rocket,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Fire: <Flame className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
};

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { stats, badges } = useUserProfile();

  const xpProgress = ((stats.totalXpForNextLevel - stats.xpToNextLevel) / stats.totalXpForNextLevel) * 100;
  const dailyExerciseProgress = (stats.dailyGoal.exercisesCompleted / stats.dailyGoal.exercisesTarget) * 100;
  const dailyXpProgress = (stats.dailyGoal.xpEarned / stats.dailyGoal.xpTarget) * 100;

  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const lockedBadges = badges.filter(b => !b.isUnlocked);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} د`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} س ${mins} د`;
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-background rounded-3xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold">الملف الشخصي</h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header */}
                <motion.div
                  className="bg-gradient-to-br from-primary/20 via-accent/10 to-turquoise/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                        {stats.username.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-yellow text-yellow-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                        {stats.level}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{stats.username}</h3>
                      <p className="text-muted-foreground mb-3">{stats.title}</p>

                      {/* XP Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">المستوى {stats.level}</span>
                          <span className="font-semibold">{stats.xp} XP</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{stats.xpToNextLevel} XP للمستوى التالي</p>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="text-center bg-card rounded-xl p-4">
                      <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold">{stats.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">أيام متتالية</p>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card rounded-xl p-4 text-center">
                    <Target className="w-5 h-5 text-turquoise mx-auto mb-2" />
                    <p className="text-xl font-bold">{stats.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">الدقة</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center">
                    <Brain className="w-5 h-5 text-coral mx-auto mb-2" />
                    <p className="text-xl font-bold">{stats.totalQuestionsAnswered}</p>
                    <p className="text-xs text-muted-foreground">سؤال</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-mint mx-auto mb-2" />
                    <p className="text-xl font-bold">{stats.exercisesCompleted}</p>
                    <p className="text-xs text-muted-foreground">تمرين مكتمل</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-yellow mx-auto mb-2" />
                    <p className="text-xl font-bold">{formatTime(stats.totalTimeSpent)}</p>
                    <p className="text-xs text-muted-foreground">وقت التدريب</p>
                  </div>
                </div>

                {/* Daily Goals */}
                <div className="bg-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h4 className="font-bold">الأهداف اليومية</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>التمارين</span>
                        <span className="font-semibold">{stats.dailyGoal.exercisesCompleted}/{stats.dailyGoal.exercisesTarget}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-turquoise rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(dailyExerciseProgress, 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>نقاط الخبرة</span>
                        <span className="font-semibold">{stats.dailyGoal.xpEarned}/{stats.dailyGoal.xpTarget} XP</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-yellow rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(dailyXpProgress, 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-turquoise" />
                    <h4 className="font-bold">الإحصائيات</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">الإجابات الصحيحة</p>
                      <p className="text-lg font-bold text-turquoise">{stats.correctAnswers}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">أطول streak</p>
                      <p className="text-lg font-bold text-orange-500">{stats.longestStreak} يوم</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">إجمالي XP</p>
                      <p className="text-lg font-bold text-yellow">{stats.xp}</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="bg-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow" />
                    <h4 className="font-bold">الشارات</h4>
                    <span className="text-sm text-muted-foreground">({unlockedBadges.length}/{badges.length})</span>
                  </div>

                  {unlockedBadges.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-3">مفتوحة</p>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                        {unlockedBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="flex flex-col items-center p-3 bg-gradient-to-br from-yellow/20 to-orange-500/20 rounded-xl border border-yellow/30"
                          >
                            <div className="w-8 h-8 rounded-full bg-yellow/20 flex items-center justify-center text-yellow mb-1">
                              {iconMap[badge.icon] || <Star className="w-4 h-4" />}
                            </div>
                            <p className="text-xs font-semibold text-center">{badge.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">مقفلة</p>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                      {lockedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex flex-col items-center p-3 bg-muted/50 rounded-xl opacity-50"
                          title={badge.description}
                        >
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-1">
                            {iconMap[badge.icon] || <Star className="w-4 h-4" />}
                          </div>
                          <p className="text-xs font-semibold text-center text-muted-foreground">{badge.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProfileModal;
