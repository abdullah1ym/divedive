import { motion } from "framer-motion";
import { useState } from "react";
import {
  Target,
  Clock,
  Brain,
  Trophy,
  Star,
  Zap,
  Award,
  Rocket,
  TrendingUp,
  CheckCircle2,
  Flame,
  Calendar,
  Layers,
  RotateCcw,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

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

// Generate activity data for the last 12 weeks (like GitHub)
const generateActivityData = (currentStreak: number, exercisesCompleted: number) => {
  const weeks = [];
  const today = new Date();

  for (let week = 11; week >= 0; week--) {
    const days = [];
    for (let day = 6; day >= 0; day--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + day));

      const daysAgo = week * 7 + day;
      // Simulate activity: recent days based on streak, older days random based on total exercises
      let level = 0;
      if (daysAgo < currentStreak) {
        level = Math.floor(Math.random() * 3) + 1; // 1-3 for streak days
      } else if (exercisesCompleted > 0 && Math.random() < 0.3) {
        level = Math.floor(Math.random() * 2) + 1; // Some random past activity
      }

      days.push({
        date: date.toLocaleDateString('ar-SA'),
        level,
        isToday: daysAgo === 0,
      });
    }
    weeks.push(days);
  }
  return weeks;
};

const ProfileView = () => {
  const { stats, badges, flashcards, removeFlashcard, markFlashcardReviewed } = useUserProfile();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardTab, setFlashcardTab] = useState<"quantitative" | "verbal">("quantitative");

  const mathFlashcards = flashcards.filter(fc => fc.category === "quantitative");
  const verbalFlashcards = flashcards.filter(fc => fc.category === "verbal");
  const currentCategoryFlashcards = flashcardTab === "quantitative" ? mathFlashcards : verbalFlashcards;

  const xpProgress = ((stats.totalXpForNextLevel - stats.xpToNextLevel) / stats.totalXpForNextLevel) * 100;
  const dailyExerciseProgress = (stats.dailyGoal.exercisesCompleted / stats.dailyGoal.exercisesTarget) * 100;
  const dailyXpProgress = (stats.dailyGoal.xpEarned / stats.dailyGoal.xpTarget) * 100;

  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const lockedBadges = badges.filter(b => !b.isUnlocked);

  const activityData = generateActivityData(stats.currentStreak, stats.exercisesCompleted);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} د`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} س ${mins} د`;
  };

  const currentFlashcard = currentCategoryFlashcards[currentFlashcardIndex];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex(prev =>
      prev < currentCategoryFlashcards.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex(prev =>
      prev > 0 ? prev - 1 : currentCategoryFlashcards.length - 1
    );
  };

  const handleMarkReviewed = () => {
    if (currentFlashcard) {
      markFlashcardReviewed(currentFlashcard.id);
      if (currentCategoryFlashcards.length > 1) {
        handleNextFlashcard();
      }
    }
  };

  const handleRemoveFlashcard = () => {
    if (currentFlashcard) {
      removeFlashcard(currentFlashcard.id);
      if (currentFlashcardIndex >= currentCategoryFlashcards.length - 1) {
        setCurrentFlashcardIndex(Math.max(0, currentCategoryFlashcards.length - 2));
      }
      setIsFlipped(false);
    }
  };

  const handleTabChange = (tab: "quantitative" | "verbal") => {
    setFlashcardTab(tab);
    setCurrentFlashcardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
              {stats.username.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow text-yellow-foreground rounded-full px-2 py-0.5 text-xs font-bold">
              {stats.level}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{stats.username}</h3>
            <p className="text-muted-foreground mb-3">{stats.title}</p>
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
        </div>
      </motion.div>

      {/* Activity Graph + Stats Row */}
      <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
        {/* Stats Grid - Right Side */}
        <motion.div
          className="bg-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-turquoise" />
            <h4 className="font-bold">الإحصائيات</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-turquoise mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">الدقة</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Brain className="w-6 h-6 text-violet-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalQuestionsAnswered}</p>
              <p className="text-sm text-muted-foreground">سؤال</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-mint mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.exercisesCompleted}</p>
              <p className="text-sm text-muted-foreground">تمرين مكتمل</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-yellow mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</p>
              <p className="text-sm text-muted-foreground">وقت التدريب</p>
            </div>
          </div>
        </motion.div>

        {/* Activity Contribution Graph - Left Side (Standalone) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-turquoise" />
              <h4 className="font-bold">نشاط التدريب</h4>
            </div>
            <div className="flex items-center gap-2 mr-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold">{stats.currentStreak} يوم متتالي</span>
            </div>
          </div>

          {/* Contribution Grid */}
          <div className="flex gap-[6px]">
            {activityData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[6px]">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    className={`w-8 h-8 rounded-lg ${
                      day.isToday
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : ""
                    } ${
                      day.level === 0
                        ? "bg-muted"
                        : day.level === 1
                        ? "bg-turquoise/30"
                        : day.level === 2
                        ? "bg-turquoise/60"
                        : "bg-turquoise"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + weekIndex * 0.02 + dayIndex * 0.01 }}
                    title={day.date}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-start gap-3 mt-4 text-sm text-muted-foreground">
            <span>أقل</span>
            <div className="w-4 h-4 rounded-md bg-muted" />
            <div className="w-4 h-4 rounded-md bg-turquoise/30" />
            <div className="w-4 h-4 rounded-md bg-turquoise/60" />
            <div className="w-4 h-4 rounded-md bg-turquoise" />
            <span>أكثر</span>
          </div>
        </motion.div>
      </div>

      {/* Flashcards Section */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-coral" />
            <h4 className="font-bold">البطاقات التعليمية</h4>
            <span className="text-sm text-muted-foreground">({flashcards.length})</span>
          </div>
          {flashcards.length > 0 && (
            <span className="text-xs text-muted-foreground">
              اضغط على البطاقة لرؤية الإجابة
            </span>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleTabChange("quantitative")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              flashcardTab === "quantitative"
                ? "bg-turquoise text-turquoise-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <Brain className="w-4 h-4" />
            الكمي
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              flashcardTab === "quantitative" ? "bg-white/20" : "bg-muted-foreground/20"
            }`}>
              {mathFlashcards.length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("verbal")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              flashcardTab === "verbal"
                ? "bg-violet-500 text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <Award className="w-4 h-4" />
            اللفظي
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              flashcardTab === "verbal" ? "bg-white/20" : "bg-muted-foreground/20"
            }`}>
              {verbalFlashcards.length}
            </span>
          </button>
        </div>

        {currentCategoryFlashcards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">لا توجد بطاقات {flashcardTab === "quantitative" ? "كمية" : "لفظية"} حالياً</p>
            <p className="text-sm mt-1">الأسئلة التي تجيب عليها بشكل خاطئ ستظهر هنا للمراجعة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Flashcard */}
            <div
              className="relative h-48 cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front - Question */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 flex flex-col items-center justify-center border-2 border-primary/20"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xs text-muted-foreground mb-2">{currentFlashcard?.exerciseTitle}</p>
                  <p className="text-lg font-medium text-center">{currentFlashcard?.question}</p>
                  <p className="text-sm text-red-400 mt-3">
                    إجابتك: {currentFlashcard?.userAnswer}
                  </p>
                </div>

                {/* Back - Answer */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-turquoise/20 to-mint/20 rounded-xl p-6 flex flex-col items-center justify-center border-2 border-turquoise/30"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <p className="text-xs text-muted-foreground mb-2">الإجابة الصحيحة</p>
                  <p className="text-2xl font-bold text-turquoise text-center">
                    {currentFlashcard?.correctAnswer}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    تمت المراجعة {currentFlashcard?.reviewCount || 0} مرات
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevFlashcard}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                disabled={currentCategoryFlashcards.length <= 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentFlashcardIndex + 1} / {currentCategoryFlashcards.length}
                </span>
              </div>

              <button
                onClick={handleNextFlashcard}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                disabled={currentCategoryFlashcards.length <= 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleRemoveFlashcard}
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                حذف البطاقة
              </motion.button>
              <motion.button
                onClick={handleMarkReviewed}
                className="flex-1 py-3 bg-turquoise/10 hover:bg-turquoise/20 text-turquoise rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                تمت المراجعة
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Daily Goals + More Stats Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Daily Goals */}
        <motion.div className="bg-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-turquoise" />
            <h4 className="font-bold">أهداف اليوم</h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>التمارين</span>
                <span className="font-semibold">{stats.dailyGoal.exercisesCompleted}/{stats.dailyGoal.exercisesTarget}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-turquoise rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(dailyExerciseProgress, 100)}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>نقاط الخبرة</span>
                <span className="font-semibold">{stats.dailyGoal.xpEarned}/{stats.dailyGoal.xpTarget} XP</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-yellow rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(dailyXpProgress, 100)}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div className="bg-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow" />
            <h4 className="font-bold">إنجازات إضافية</h4>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">إجابات صحيحة</p>
              <p className="text-xl font-bold text-turquoise">{stats.correctAnswers}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">أفضل streak</p>
              <p className="text-xl font-bold text-orange-500">{stats.longestStreak}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">إجمالي XP</p>
              <p className="text-xl font-bold text-yellow">{stats.xp}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div className="bg-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow" />
          <h4 className="font-bold">الشارات</h4>
          <span className="text-sm text-muted-foreground">({unlockedBadges.length}/{badges.length})</span>
        </div>

        {unlockedBadges.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3">مفتوحة</p>
            <div className="grid grid-cols-7 gap-3">
              {unlockedBadges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center p-3 bg-gradient-to-br from-yellow/20 to-orange-500/20 rounded-xl border border-yellow/30">
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
          <div className="grid grid-cols-7 gap-3">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center p-3 bg-muted/50 rounded-xl opacity-50" title={badge.description}>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-1">
                  {iconMap[badge.icon] || <Star className="w-4 h-4" />}
                </div>
                <p className="text-xs font-semibold text-center text-muted-foreground">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileView;
