import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { showLevelUpNotification, showBadgeUnlockNotification } from "@/components/Notifications";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface DailyGoal {
  exercisesTarget: number;
  exercisesCompleted: number;
  xpTarget: number;
  xpEarned: number;
  mathTarget: number;
  mathCompleted: number;
  languageTarget: number;
  languageCompleted: number;
}

export interface UserStats {
  xp: number;
  level: number;
  xpToNextLevel: number;
  totalXpForNextLevel: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  exercisesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyGoal: DailyGoal;
  username: string;
  title: string;
}

interface UserProfileContextType {
  stats: UserStats;
  badges: Badge[];
  addXp: (amount: number) => void;
  recordAnswer: (isCorrect: boolean, timeSpent: number) => void;
  completeExercise: (category?: "math" | "language") => void;
  resetStats: () => void;
  setDailyGoalTargets: (mathTarget: number, languageTarget: number) => void;
}

const calculateLevel = (xp: number): { level: number; xpToNext: number; totalForNext: number } => {
  let level = 1;
  let totalXp = 0;
  let xpForLevel = 100;

  while (totalXp + xpForLevel <= xp) {
    totalXp += xpForLevel;
    level++;
    xpForLevel = level * 100;
  }

  return {
    level,
    xpToNext: xpForLevel - (xp - totalXp),
    totalForNext: xpForLevel,
  };
};

const defaultBadges: Badge[] = [
  { id: "first-exercise", name: "البداية", description: "أكمل أول تمرين", icon: "Rocket", isUnlocked: false },
  { id: "streak-3", name: "متحمس", description: "حافظ على streak لـ 3 أيام", icon: "Flame", isUnlocked: false },
  { id: "streak-7", name: "مثابر", description: "حافظ على streak لـ 7 أيام", icon: "Fire", isUnlocked: false },
  { id: "accuracy-80", name: "دقيق", description: "حقق دقة 80% أو أكثر", icon: "Target", isUnlocked: false },
  { id: "exercises-10", name: "نشيط", description: "أكمل 10 تمارين", icon: "Award", isUnlocked: false },
  { id: "level-5", name: "متقدم", description: "وصل للمستوى 5", icon: "Star", isUnlocked: false },
  { id: "questions-100", name: "مجتهد", description: "أجب على 100 سؤال", icon: "Brain", isUnlocked: false },
];

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  xpToNextLevel: 100,
  totalXpForNextLevel: 100,
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  accuracy: 0,
  totalTimeSpent: 0,
  exercisesCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  dailyGoal: {
    exercisesTarget: 5,
    exercisesCompleted: 0,
    xpTarget: 100,
    xpEarned: 0,
    mathTarget: 3,
    mathCompleted: 0,
    languageTarget: 2,
    languageCompleted: 0,
  },
  username: "متدرب",
  title: "مبتدئ",
};

const STORAGE_KEY = "divedive-user-profile";
const BADGES_KEY = "divedive-badges";

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultStats;
      }
    }
    return defaultStats;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const stored = localStorage.getItem(BADGES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultBadges;
      }
    }
    return defaultBadges;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  }, [badges]);

  const getTitleForLevel = (level: number): string => {
    if (level >= 15) return "خبير";
    if (level >= 10) return "محترف";
    if (level >= 5) return "متقدم";
    if (level >= 3) return "مجتهد";
    return "مبتدئ";
  };

  const checkAndUnlockBadges = (newStats: UserStats) => {
    setBadges(prev => prev.map(badge => {
      if (badge.isUnlocked) return badge;

      let shouldUnlock = false;

      switch (badge.id) {
        case "first-exercise":
          shouldUnlock = newStats.exercisesCompleted >= 1;
          break;
        case "streak-3":
          shouldUnlock = newStats.currentStreak >= 3;
          break;
        case "streak-7":
          shouldUnlock = newStats.currentStreak >= 7;
          break;
        case "accuracy-80":
          shouldUnlock = newStats.accuracy >= 80 && newStats.totalQuestionsAnswered >= 10;
          break;
        case "exercises-10":
          shouldUnlock = newStats.exercisesCompleted >= 10;
          break;
        case "level-5":
          shouldUnlock = newStats.level >= 5;
          break;
        case "questions-100":
          shouldUnlock = newStats.totalQuestionsAnswered >= 100;
          break;
      }

      if (shouldUnlock) {
        setTimeout(() => showBadgeUnlockNotification(badge.name, badge.description), 500);
        return { ...badge, isUnlocked: true, unlockedAt: new Date() };
      }
      return badge;
    }));
  };

  const checkLevelUp = (oldLevel: number, newLevel: number) => {
    if (newLevel > oldLevel) {
      setTimeout(() => showLevelUpNotification(newLevel), 300);
    }
  };

  const updateStreak = (currentStats: UserStats): Partial<UserStats> => {
    const today = new Date().toDateString();
    const lastActive = currentStats.lastActiveDate ? new Date(currentStats.lastActiveDate).toDateString() : "";
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActive === today) {
      return {};
    }

    if (lastActive === yesterday) {
      const newStreak = currentStats.currentStreak + 1;
      return {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, currentStats.longestStreak),
        lastActiveDate: new Date().toISOString(),
      };
    }

    return {
      currentStreak: 1,
      lastActiveDate: new Date().toISOString(),
    };
  };

  const addXp = (amount: number) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      const { level, xpToNext, totalForNext } = calculateLevel(newXp);
      const newStats = {
        ...prev,
        xp: newXp,
        level,
        xpToNextLevel: xpToNext,
        totalXpForNextLevel: totalForNext,
        title: getTitleForLevel(level),
        dailyGoal: {
          ...prev.dailyGoal,
          xpEarned: prev.dailyGoal.xpEarned + amount,
        },
        ...updateStreak(prev),
      };
      checkLevelUp(prev.level, level);
      checkAndUnlockBadges(newStats);
      return newStats;
    });
  };

  const recordAnswer = (isCorrect: boolean, timeSpent: number) => {
    setStats(prev => {
      const newCorrect = prev.correctAnswers + (isCorrect ? 1 : 0);
      const newTotal = prev.totalQuestionsAnswered + 1;
      const newAccuracy = Math.round((newCorrect / newTotal) * 100);
      const xpGained = isCorrect ? 10 : 2;

      const newXp = prev.xp + xpGained;
      const { level, xpToNext, totalForNext } = calculateLevel(newXp);

      const newStats = {
        ...prev,
        xp: newXp,
        level,
        xpToNextLevel: xpToNext,
        totalXpForNextLevel: totalForNext,
        title: getTitleForLevel(level),
        totalQuestionsAnswered: newTotal,
        correctAnswers: newCorrect,
        accuracy: newAccuracy,
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
        dailyGoal: {
          ...prev.dailyGoal,
          xpEarned: prev.dailyGoal.xpEarned + xpGained,
        },
        ...updateStreak(prev),
      };
      checkLevelUp(prev.level, level);
      checkAndUnlockBadges(newStats);
      return newStats;
    });
  };

  const completeExercise = (category?: "math" | "language") => {
    setStats(prev => {
      const newStats = {
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + 1,
        dailyGoal: {
          ...prev.dailyGoal,
          exercisesCompleted: prev.dailyGoal.exercisesCompleted + 1,
          mathCompleted: category === "math" ? prev.dailyGoal.mathCompleted + 1 : prev.dailyGoal.mathCompleted,
          languageCompleted: category === "language" ? prev.dailyGoal.languageCompleted + 1 : prev.dailyGoal.languageCompleted,
        },
        ...updateStreak(prev),
      };
      checkAndUnlockBadges(newStats);
      return newStats;
    });
    addXp(25);
  };

  const setDailyGoalTargets = (mathTarget: number, languageTarget: number) => {
    setStats(prev => ({
      ...prev,
      dailyGoal: {
        ...prev.dailyGoal,
        mathTarget,
        languageTarget,
        exercisesTarget: mathTarget + languageTarget,
      },
    }));
  };

  const resetStats = () => {
    setStats(defaultStats);
    setBadges(defaultBadges);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BADGES_KEY);
  };

  return (
    <UserProfileContext.Provider value={{
      stats,
      badges,
      addXp,
      recordAnswer,
      completeExercise,
      resetStats,
      setDailyGoalTargets,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
