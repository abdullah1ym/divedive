import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Clock, Target, Award, ArrowUp, ArrowDown, Minus, Settings2, X, Check } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

// Helper to convert number to Arabic numerals
const toArabicNumeral = (num: number): string => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().split("").map(d => arabicNumerals[parseInt(d)] || d).join("");
};

const ProgressView = () => {
  const { stats: userStats, badges, setDailyGoalTargets } = useUserProfile();
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editMathTarget, setEditMathTarget] = useState(userStats.dailyGoal?.mathTarget ?? 3);
  const [editLanguageTarget, setEditLanguageTarget] = useState(userStats.dailyGoal?.languageTarget ?? 2);

  // Sync edit values when goals change
  useEffect(() => {
    setEditMathTarget(userStats.dailyGoal?.mathTarget ?? 3);
    setEditLanguageTarget(userStats.dailyGoal?.languageTarget ?? 2);
  }, [userStats.dailyGoal?.mathTarget, userStats.dailyGoal?.languageTarget]);

  const handleSaveGoals = () => {
    setDailyGoalTargets(editMathTarget, editLanguageTarget);
    setIsEditingGoals(false);
  };

  const unlockedAchievements = badges.filter(b => b.isUnlocked).length;

  // Daily goal data from context (with fallbacks for old data)
  const { dailyGoal } = userStats;
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

  // Performance by category - Math (الكمي)
  const mathPerformance = [
    { name: "الكسور", score: 85, color: "bg-turquoise" },
    { name: "المتتاليات", score: 90, color: "bg-turquoise" },
    { name: "الهندسة", score: 65, color: "bg-turquoise" },
    { name: "الجبر", score: 78, color: "bg-turquoise" },
    { name: "النسبة والتناسب", score: 82, color: "bg-turquoise" },
    { name: "الإحصاء", score: 70, color: "bg-turquoise" },
    { name: "الاحتمالات", score: 88, color: "bg-turquoise" },
  ];

  // Performance by category - Language (اللفظي)
  const languagePerformance = [
    { name: "التناظر اللفظي", score: 72, color: "bg-turquoise" },
    { name: "إكمال الجمل", score: 80, color: "bg-turquoise" },
    { name: "الخطأ السياقي", score: 68, color: "bg-turquoise" },
    { name: "المفردة الشاذة", score: 75, color: "bg-turquoise" },
    { name: "استيعاب المقروء", score: 82, color: "bg-turquoise" },
  ];


  // Week comparison data
  const weekComparison = [
    { label: "التمارين", thisWeek: 12, lastWeek: 8, unit: "" },
    { label: "نسبة النجاح", thisWeek: 85, lastWeek: 78, unit: "٪" },
    { label: "الوقت", thisWeek: 45, lastWeek: 50, unit: " د", lowerIsBetter: true },
  ];

  const statsDisplay = [
    { label: "التمارين المكتملة", value: toArabicNumeral(userStats.exercisesCompleted), icon: Target, color: "text-turquoise" },
    { label: "الوقت الكلي", value: `${toArabicNumeral(userStats.totalTimeSpent)} د`, icon: Clock, color: "text-turquoise" },
    { label: "نسبة النجاح", value: `${toArabicNumeral(userStats.accuracy)}٪`, icon: TrendingUp, color: "text-turquoise" },
    { label: "الإنجازات", value: toArabicNumeral(unlockedAchievements), icon: Award, color: "text-turquoise" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">التقدم</h1>
        <p className="text-muted-foreground">تابع تقدمك في التدريب السمعي</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Daily Goal & Week Comparison Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Goal Rings - Math & Language */}
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
            {/* Math Goal - Right */}
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

            {/* Language Goal - Left */}
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
          {/* Today's Stats */}
          <h2 className="text-xl font-bold mb-3">اليوم</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-muted/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-turquoise">{toArabicNumeral(3)}</p>
              <p className="text-xs text-muted-foreground">تمارين</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-turquoise">{toArabicNumeral(88)}٪</p>
              <p className="text-xs text-muted-foreground">النجاح</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-turquoise">{toArabicNumeral(15)}</p>
              <p className="text-xs text-muted-foreground">دقيقة</p>
            </div>
          </div>

          {/* This Week vs Last Week */}
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

      {/* Performance by Category - Two Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Math Performance */}
        <motion.div
          className="bg-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4">الأداء في الكمي</h2>
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
                  <span className="text-muted-foreground">{toArabicNumeral(category.score)}٪</span>
                </div>
                <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${category.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.score}%` }}
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
          <h2 className="text-xl font-bold mb-4">الأداء في اللفظي</h2>
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
                  <span className="text-muted-foreground">{toArabicNumeral(category.score)}٪</span>
                </div>
                <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${category.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.score}%` }}
                    transition={{ delay: 0.85 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}

          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-bold mb-4">النشاط الأخير</h2>
        <div className="space-y-3">
          {[
            { title: "تمرين الكسور", score: "٩٠٪", time: "منذ ساعة" },
            { title: "المتتاليات العددية", score: "٧٥٪", time: "منذ ٣ ساعات" },
            { title: "التناظر اللفظي", score: "١٠٠٪", time: "أمس" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
              <span className="text-turquoise font-bold">{activity.score}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressView;
