import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Activity entry for recent activity display
export interface ActivityEntry {
  id: string;
  title: string;
  collectionId: string;
  bankId?: string;
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  timestamp: string; // ISO date string
  category: "math" | "language";
}

// Category performance tracking
export interface CategoryPerformance {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
}

// Daily stats
export interface DailyStats {
  date: string; // YYYY-MM-DD
  exercisesCompleted: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  mathExercises: number;
  languageExercises: number;
}

// Weekly comparison data
export interface WeeklyComparison {
  thisWeek: {
    exercises: number;
    successRate: number;
    timeSpent: number;
  };
  lastWeek: {
    exercises: number;
    successRate: number;
    timeSpent: number;
  };
}

interface ActivityTrackingContextType {
  recentActivities: ActivityEntry[];
  mathPerformance: CategoryPerformance[];
  languagePerformance: CategoryPerformance[];
  todayStats: DailyStats;
  weeklyComparison: WeeklyComparison;
  activityHeatmap: { date: string; level: number }[];
  recordActivity: (activity: Omit<ActivityEntry, "id" | "timestamp">) => void;
  recordCategoryAnswer: (category: string, isCorrect: boolean, type: "math" | "language") => void;
  recordQuestionAnswer: (isCorrect: boolean, category: "math" | "language") => void;
}

const ACTIVITY_STORAGE_KEY = "divedive-activity-history";
const CATEGORY_STATS_KEY = "divedive-category-stats";
const DAILY_STATS_KEY = "divedive-daily-stats";

// Default math categories
const defaultMathCategories: CategoryPerformance[] = [
  { name: "الكسور", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "المتتاليات", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "الهندسة", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "الجبر", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "النسبة والتناسب", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "الإحصاء", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "المقارنات", totalQuestions: 0, correctAnswers: 0, score: 0 },
];

// Default language categories
const defaultLanguageCategories: CategoryPerformance[] = [
  { name: "التناظر اللفظي", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "إكمال الجمل", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "الخطأ السياقي", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "المفردة الشاذة", totalQuestions: 0, correctAnswers: 0, score: 0 },
  { name: "استيعاب المقروء", totalQuestions: 0, correctAnswers: 0, score: 0 },
];

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const getDefaultDailyStats = (): DailyStats => ({
  date: getTodayDateString(),
  exercisesCompleted: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  timeSpent: 0,
  mathExercises: 0,
  languageExercises: 0,
});

const ActivityTrackingContext = createContext<ActivityTrackingContextType | undefined>(undefined);

export const ActivityTrackingProvider = ({ children }: { children: ReactNode }) => {
  // Recent activities
  const [recentActivities, setRecentActivities] = useState<ActivityEntry[]>(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Category performance
  const [mathPerformance, setMathPerformance] = useState<CategoryPerformance[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORY_STATS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.math || defaultMathCategories;
      }
      return defaultMathCategories;
    } catch {
      return defaultMathCategories;
    }
  });

  const [languagePerformance, setLanguagePerformance] = useState<CategoryPerformance[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORY_STATS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.language || defaultLanguageCategories;
      }
      return defaultLanguageCategories;
    } catch {
      return defaultLanguageCategories;
    }
  });

  // Daily stats history (last 14 days)
  const [dailyStatsHistory, setDailyStatsHistory] = useState<DailyStats[]>(() => {
    try {
      const stored = localStorage.getItem(DAILY_STATS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(recentActivities.slice(0, 50)));
  }, [recentActivities]);

  useEffect(() => {
    localStorage.setItem(CATEGORY_STATS_KEY, JSON.stringify({
      math: mathPerformance,
      language: languagePerformance,
    }));
  }, [mathPerformance, languagePerformance]);

  useEffect(() => {
    localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(dailyStatsHistory.slice(0, 30)));
  }, [dailyStatsHistory]);

  // Get today's stats
  const todayStats: DailyStats = (() => {
    const today = getTodayDateString();
    const todayData = dailyStatsHistory.find(d => d.date === today);
    return todayData || getDefaultDailyStats();
  })();

  // Calculate weekly comparison
  const weeklyComparison: WeeklyComparison = (() => {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);

    const thisWeekStats = dailyStatsHistory.filter(d => {
      const date = new Date(d.date);
      return date >= thisWeekStart && date <= today;
    });

    const lastWeekStats = dailyStatsHistory.filter(d => {
      const date = new Date(d.date);
      return date >= lastWeekStart && date <= lastWeekEnd;
    });

    const calcStats = (stats: DailyStats[]) => {
      const exercises = stats.reduce((sum, d) => sum + d.exercisesCompleted, 0);
      const questions = stats.reduce((sum, d) => sum + d.questionsAnswered, 0);
      const correct = stats.reduce((sum, d) => sum + d.correctAnswers, 0);
      const time = stats.reduce((sum, d) => sum + d.timeSpent, 0);
      return {
        exercises,
        successRate: questions > 0 ? Math.round((correct / questions) * 100) : 0,
        timeSpent: Math.round(time),
      };
    };

    return {
      thisWeek: calcStats(thisWeekStats),
      lastWeek: calcStats(lastWeekStats),
    };
  })();

  // Generate activity heatmap (last 126 days = 18 weeks)
  const activityHeatmap = (() => {
    const result: { date: string; level: number }[] = [];
    const today = new Date();

    for (let i = 125; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayStats = dailyStatsHistory.find(d => d.date === dateStr);
      let level = 0;
      if (dayStats) {
        if (dayStats.exercisesCompleted >= 5) level = 3;
        else if (dayStats.exercisesCompleted >= 3) level = 2;
        else if (dayStats.exercisesCompleted >= 1) level = 1;
      }

      result.push({ date: dateStr, level });
    }

    return result;
  })();

  // Record a new activity
  const recordActivity = (activity: Omit<ActivityEntry, "id" | "timestamp">) => {
    const newActivity: ActivityEntry = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setRecentActivities(prev => [newActivity, ...prev]);

    // Update daily stats
    const today = getTodayDateString();
    setDailyStatsHistory(prev => {
      const existing = prev.find(d => d.date === today);
      if (existing) {
        return prev.map(d => d.date === today ? {
          ...d,
          exercisesCompleted: d.exercisesCompleted + 1,
          questionsAnswered: d.questionsAnswered + activity.totalQuestions,
          correctAnswers: d.correctAnswers + activity.correctAnswers,
          timeSpent: d.timeSpent + Math.round(activity.timeSpent / 60),
          mathExercises: activity.category === "math" ? d.mathExercises + 1 : d.mathExercises,
          languageExercises: activity.category === "language" ? d.languageExercises + 1 : d.languageExercises,
        } : d);
      } else {
        return [{
          date: today,
          exercisesCompleted: 1,
          questionsAnswered: activity.totalQuestions,
          correctAnswers: activity.correctAnswers,
          timeSpent: Math.round(activity.timeSpent / 60),
          mathExercises: activity.category === "math" ? 1 : 0,
          languageExercises: activity.category === "language" ? 1 : 0,
        }, ...prev];
      }
    });
  };

  // Record a category answer (for performance tracking)
  const recordCategoryAnswer = (category: string, isCorrect: boolean, type: "math" | "language") => {
    if (type === "math") {
      setMathPerformance(prev => prev.map(cat => {
        if (cat.name === category || category.includes(cat.name) || cat.name.includes(category)) {
          const newTotal = cat.totalQuestions + 1;
          const newCorrect = cat.correctAnswers + (isCorrect ? 1 : 0);
          return {
            ...cat,
            totalQuestions: newTotal,
            correctAnswers: newCorrect,
            score: Math.round((newCorrect / newTotal) * 100),
          };
        }
        return cat;
      }));
    } else {
      setLanguagePerformance(prev => prev.map(cat => {
        if (cat.name === category || category.includes(cat.name) || cat.name.includes(category)) {
          const newTotal = cat.totalQuestions + 1;
          const newCorrect = cat.correctAnswers + (isCorrect ? 1 : 0);
          return {
            ...cat,
            totalQuestions: newTotal,
            correctAnswers: newCorrect,
            score: Math.round((newCorrect / newTotal) * 100),
          };
        }
        return cat;
      }));
    }
  };

  // Record a single question answer (updates daily stats immediately)
  const recordQuestionAnswer = (isCorrect: boolean, category: "math" | "language") => {
    const today = getTodayDateString();
    setDailyStatsHistory(prev => {
      const existing = prev.find(d => d.date === today);
      if (existing) {
        return prev.map(d => d.date === today ? {
          ...d,
          questionsAnswered: d.questionsAnswered + 1,
          correctAnswers: d.correctAnswers + (isCorrect ? 1 : 0),
        } : d);
      } else {
        return [{
          date: today,
          exercisesCompleted: 0,
          questionsAnswered: 1,
          correctAnswers: isCorrect ? 1 : 0,
          timeSpent: 0,
          mathExercises: 0,
          languageExercises: 0,
        }, ...prev];
      }
    });
  };

  return (
    <ActivityTrackingContext.Provider value={{
      recentActivities,
      mathPerformance,
      languagePerformance,
      todayStats,
      weeklyComparison,
      activityHeatmap,
      recordActivity,
      recordCategoryAnswer,
      recordQuestionAnswer,
    }}>
      {children}
    </ActivityTrackingContext.Provider>
  );
};

export const useActivityTracking = () => {
  const context = useContext(ActivityTrackingContext);
  if (!context) {
    throw new Error("useActivityTracking must be used within an ActivityTrackingProvider");
  }
  return context;
};
