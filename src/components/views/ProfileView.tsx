import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings2,
  X,
  Check,
} from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useActivityTracking } from "@/contexts/ActivityTrackingContext";

// Helper to convert number to Arabic numerals
const toArabicNumeral = (num: number): string => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().split("").map(d => arabicNumerals[parseInt(d)] || d).join("");
};

const ProfileView = () => {
  const { stats, badges, setDailyGoalTargets } = useUserProfile();
  const {
    recentActivities,
    mathPerformance: mathPerfData,
    languagePerformance: langPerfData,
    todayStats,
    weeklyComparison,
    activityHeatmap,
  } = useActivityTracking();
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editMathTarget, setEditMathTarget] = useState(stats.dailyGoal?.mathTarget ?? 3);
  const [editLanguageTarget, setEditLanguageTarget] = useState(stats.dailyGoal?.languageTarget ?? 2);

  // Sync edit values when goals change
  useEffect(() => {
    setEditMathTarget(stats.dailyGoal?.mathTarget ?? 3);
    setEditLanguageTarget(stats.dailyGoal?.languageTarget ?? 2);
  }, [stats.dailyGoal?.mathTarget, stats.dailyGoal?.languageTarget]);

  const handleSaveGoals = () => {
    setDailyGoalTargets(editMathTarget, editLanguageTarget);
    setIsEditingGoals(false);
  };

  const xpProgress = ((stats.totalXpForNextLevel - stats.xpToNextLevel) / stats.totalXpForNextLevel) * 100;
  const unlockedAchievements = badges.filter(b => b.isUnlocked).length;

  // Convert activity heatmap to the format expected by the UI (18 weeks × 7 days)
  const activityData = (() => {
    const weeks: { date: string; level: number; isToday: boolean }[][] = [];
    const today = new Date().toISOString().split("T")[0];

    for (let w = 0; w < 18; w++) {
      const week: { date: string; level: number; isToday: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const idx = w * 7 + d;
        const entry = activityHeatmap[idx] || { date: "", level: 0 };
        week.push({
          date: entry.date,
          level: entry.level,
          isToday: entry.date === today,
        });
      }
      weeks.push(week);
    }
    return weeks;
  })();

  // Daily goal data
  const { dailyGoal } = stats;
  const mathGoal = {
    completed: dailyGoal?.mathCompleted ?? 0,
    total: dailyGoal?.mathTarget ?? 3
  };
  const languageGoal = {
    completed: dailyGoal?.languageCompleted ?? 0,
    total: dailyGoal?.languageTarget ?? 2
  };
  const mathProgress = mathGoal.total > 0 ? (mathGoal.completed / mathGoal.total) * 100 : 0;
  const languageProgress = languageGoal.total > 0 ? (languageGoal.completed / languageGoal.total) * 100 : 0;

  // Performance by category - Math (from real data)
  const mathPerformance = mathPerfData.map(cat => ({
    name: cat.name,
    score: cat.totalQuestions > 0 ? cat.score : 0,
    color: "bg-turquoise",
    hasData: cat.totalQuestions > 0,
  }));

  // Performance by category - Language (from real data)
  const languagePerformance = langPerfData.map(cat => ({
    name: cat.name,
    score: cat.totalQuestions > 0 ? cat.score : 0,
    color: "bg-turquoise",
    hasData: cat.totalQuestions > 0,
  }));

  // Calculate total percentages (only from categories with data)
  const mathWithData = mathPerformance.filter(p => p.hasData);
  const langWithData = languagePerformance.filter(p => p.hasData);
  const mathTotalPercentage = mathWithData.length > 0
    ? Math.round(mathWithData.reduce((sum, item) => sum + item.score, 0) / mathWithData.length)
    : 0;
  const languageTotalPercentage = langWithData.length > 0
    ? Math.round(langWithData.reduce((sum, item) => sum + item.score, 0) / langWithData.length)
    : 0;

  // Week comparison data (from real data)
  const weekComparison = [
    { label: "التمارين", thisWeek: weeklyComparison.thisWeek.exercises, lastWeek: weeklyComparison.lastWeek.exercises, unit: "" },
    { label: "نسبة النجاح", thisWeek: weeklyComparison.thisWeek.successRate, lastWeek: weeklyComparison.lastWeek.successRate, unit: "٪" },
    { label: "الوقت", thisWeek: weeklyComparison.thisWeek.timeSpent, lastWeek: weeklyComparison.lastWeek.timeSpent, unit: " د", lowerIsBetter: true },
  ];

  // Format relative time in Arabic
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${toArabicNumeral(diffMins)} دقيقة`;
    if (diffHours < 24) return `منذ ${toArabicNumeral(diffHours)} ساعة`;
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${toArabicNumeral(diffDays)} أيام`;
    return date.toLocaleDateString("ar-SA");
  };

  const statsDisplay = [
    { label: "التمارين المكتملة", value: toArabicNumeral(stats.exercisesCompleted), icon: Target, color: "text-turquoise" },
    { label: "الوقت الكلي", value: `${toArabicNumeral(stats.totalTimeSpent)} د`, icon: Clock, color: "text-turquoise" },
    { label: "نسبة النجاح", value: `${toArabicNumeral(stats.accuracy)}٪`, icon: TrendingUp, color: "text-turquoise" },
    { label: "الإنجازات", value: toArabicNumeral(unlockedAchievements), icon: Award, color: "text-turquoise" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header - Level Section */}
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

      {/* Activity & Recent Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        {/* Activity Contribution Graph - Left */}
        <motion.div
          className="bg-card rounded-2xl p-5 w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-turquoise" />
              <h4 className="font-bold">نشاط التدريب</h4>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold">{stats.currentStreak} يوم متتالي</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            {activityData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    className={`w-5 h-5 rounded ${
                      day.isToday
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
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
                    transition={{ delay: 0.2 + weekIndex * 0.01 + dayIndex * 0.005 }}
                    title={day.date}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start gap-2 mt-3 text-xs text-muted-foreground">
            <span>أقل</span>
            <div className="w-3 h-3 rounded bg-muted" />
            <div className="w-3 h-3 rounded bg-turquoise/30" />
            <div className="w-3 h-3 rounded bg-turquoise/60" />
            <div className="w-3 h-3 rounded bg-turquoise" />
            <span>أكثر</span>
          </div>
        </motion.div>

        {/* Recent Activity - Right */}
        <motion.div
          className="bg-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-lg font-bold mb-4">النشاط الأخير</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                  <span className="text-turquoise font-bold">{toArabicNumeral(activity.score)}٪</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">لا يوجد نشاط بعد</p>
                <p className="text-xs mt-1">ابدأ بحل التمارين لرؤية نشاطك هنا</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Daily Goal & Week Comparison Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Goal Rings */}
        <motion.div
          className="bg-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">هدف اليوم</h2>
            <button
              onClick={() => setIsEditingGoals(true)}
              className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <Settings2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Edit Goals Modal */}
          <AnimatePresence>
            {isEditingGoals && (
              <motion.div
                className="mb-4 p-4 bg-muted/20 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">هدف الكمي</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditMathTarget(Math.max(1, editMathTarget - 1))}
                        className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{toArabicNumeral(editMathTarget)}</span>
                      <button
                        onClick={() => setEditMathTarget(editMathTarget + 1)}
                        className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">هدف اللفظي</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditLanguageTarget(Math.max(1, editLanguageTarget - 1))}
                        className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{toArabicNumeral(editLanguageTarget)}</span>
                      <button
                        onClick={() => setEditLanguageTarget(editLanguageTarget + 1)}
                        className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveGoals}
                      className="flex-1 py-2 bg-turquoise text-white rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      حفظ
                    </button>
                    <button
                      onClick={() => setIsEditingGoals(false)}
                      className="px-4 py-2 bg-muted/30 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-around">
            {/* Math Goal */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    key={`math-${mathGoal.total}`}
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className="text-turquoise"
                    initial={{ strokeDasharray: "0 377" }}
                    animate={{ strokeDasharray: `${mathProgress * 3.77} 377` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{toArabicNumeral(mathGoal.completed)}/{toArabicNumeral(mathGoal.total)}</span>
                  <span className="text-sm text-muted-foreground">تمارين</span>
                </div>
              </div>
              <p className="text-center text-muted-foreground mt-3 font-medium">الكمي</p>
            </div>

            {/* Language Goal */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    key={`lang-${languageGoal.total}`}
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className="text-turquoise"
                    initial={{ strokeDasharray: "0 377" }}
                    animate={{ strokeDasharray: `${languageProgress * 3.77} 377` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{toArabicNumeral(languageGoal.completed)}/{toArabicNumeral(languageGoal.total)}</span>
                  <span className="text-sm text-muted-foreground">تمارين</span>
                </div>
              </div>
              <p className="text-center text-muted-foreground mt-3 font-medium">اللفظي</p>
            </div>
          </div>
        </motion.div>

        {/* Today & This Week Stats */}
        <motion.div
          className="bg-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-3">اليوم</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-muted/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-turquoise">{toArabicNumeral(todayStats.exercisesCompleted)}</p>
              <p className="text-xs text-muted-foreground">تمارين</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-turquoise">
                {todayStats.questionsAnswered > 0
                  ? toArabicNumeral(Math.round((todayStats.correctAnswers / todayStats.questionsAnswered) * 100))
                  : toArabicNumeral(0)}٪
              </p>
              <p className="text-xs text-muted-foreground">النجاح</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-turquoise">{toArabicNumeral(todayStats.timeSpent)}</p>
              <p className="text-xs text-muted-foreground">دقيقة</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">هذا الأسبوع</h2>
          <div className="space-y-3">
            {weekComparison.map((item, index) => {
              const diff = item.thisWeek - item.lastWeek;
              const isImproved = item.lowerIsBetter ? diff < 0 : diff > 0;
              const isEqual = diff === 0;

              return (
                <motion.div
                  key={item.label}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <span className="text-muted-foreground text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{toArabicNumeral(item.thisWeek)}{item.unit}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      isEqual ? "bg-muted/30 text-muted-foreground" :
                      isImproved ? "bg-turquoise/20 text-turquoise" : "bg-turquoise/20 text-turquoise"
                    }`}>
                      {isEqual ? <Minus className="w-3 h-3" /> :
                       isImproved ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      <span>{toArabicNumeral(Math.abs(diff))}{item.unit}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Performance by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Math Performance */}
        <motion.div
          className="bg-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">الأداء في الكمي</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">المجموع</span>
              <span className="text-2xl font-bold text-turquoise">{toArabicNumeral(mathTotalPercentage)}٪</span>
            </div>
          </div>
          <div className="space-y-4">
            {mathPerformance.map((category, index) => (
              <motion.div
                key={category.name}
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-sm ${category.hasData ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                    {category.hasData ? `${toArabicNumeral(category.score)}٪` : "لم يتم التجربة"}
                  </span>
                </div>
                <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${category.hasData ? category.color : "bg-muted/30"}`}
                    initial={{ width: 0 }}
                    animate={{ width: category.hasData ? `${category.score}%` : "0%" }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Language Performance */}
        <motion.div
          className="bg-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">الأداء في اللفظي</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">المجموع</span>
              <span className="text-2xl font-bold text-turquoise">{toArabicNumeral(languageTotalPercentage)}٪</span>
            </div>
          </div>
          <div className="space-y-4">
            {languagePerformance.map((category, index) => (
              <motion.div
                key={category.name}
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-sm ${category.hasData ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                    {category.hasData ? `${toArabicNumeral(category.score)}٪` : "لم يتم التجربة"}
                  </span>
                </div>
                <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${category.hasData ? category.color : "bg-muted/30"}`}
                    initial={{ width: 0 }}
                    animate={{ width: category.hasData ? `${category.score}%` : "0%" }}
                    transition={{ delay: 0.85 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default ProfileView;
