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
}

export interface Flashcard {
  id: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  options: string[];
  exerciseTitle: string;
  category: "quantitative" | "verbal";
  addedAt: string;
  reviewCount: number;
  lastReviewed?: string;
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

export interface QuestionData {
  prompt: string;
  options: string[];
  correctAnswer: number;
  exerciseTitle: string;
  exerciseType: "quantitative" | "verbal" | "algebra" | "analogy" | "mixed";
}

interface UserProfileContextType {
  stats: UserStats;
  badges: Badge[];
  flashcards: Flashcard[];
  addXp: (amount: number) => void;
  recordAnswer: (isCorrect: boolean, timeSpent: number, questionData?: QuestionData, selectedAnswer?: number) => void;
  completeExercise: () => void;
  resetStats: () => void;
  removeFlashcard: (id: string) => void;
  markFlashcardReviewed: (id: string) => void;
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
    exercisesTarget: 3,
    exercisesCompleted: 0,
    xpTarget: 100,
    xpEarned: 0,
  },
  username: "متدرب",
  title: "مبتدئ",
};

const STORAGE_KEY = "divedive-user-profile";
const BADGES_KEY = "divedive-badges";
const FLASHCARDS_KEY = "divedive-flashcards";

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

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const stored = localStorage.getItem(FLASHCARDS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  }, [flashcards]);

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

  const recordAnswer = (isCorrect: boolean, timeSpent: number, questionData?: QuestionData, selectedAnswer?: number) => {
    // Add to flashcards if answer is wrong
    if (!isCorrect && questionData && selectedAnswer !== undefined) {
      // Determine category based on exercise type
      const isVerbal = questionData.exerciseType === "verbal" || questionData.exerciseType === "analogy";
      const category: "quantitative" | "verbal" = isVerbal ? "verbal" : "quantitative";

      const flashcard: Flashcard = {
        id: `fc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: questionData.prompt,
        correctAnswer: questionData.options[questionData.correctAnswer],
        userAnswer: questionData.options[selectedAnswer],
        options: questionData.options,
        exerciseTitle: questionData.exerciseTitle,
        category,
        addedAt: new Date().toISOString(),
        reviewCount: 0,
      };
      setFlashcards(prev => [...prev, flashcard]);
    }

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

  const completeExercise = () => {
    setStats(prev => {
      const newStats = {
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + 1,
        dailyGoal: {
          ...prev.dailyGoal,
          exercisesCompleted: prev.dailyGoal.exercisesCompleted + 1,
        },
        ...updateStreak(prev),
      };
      checkAndUnlockBadges(newStats);
      return newStats;
    });
    addXp(25);
  };

  const resetStats = () => {
    setStats(defaultStats);
    setBadges(defaultBadges);
    setFlashcards([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BADGES_KEY);
    localStorage.removeItem(FLASHCARDS_KEY);
  };

  const removeFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(fc => fc.id !== id));
  };

  const markFlashcardReviewed = (id: string) => {
    setFlashcards(prev => prev.map(fc =>
      fc.id === id
        ? { ...fc, reviewCount: fc.reviewCount + 1, lastReviewed: new Date().toISOString() }
        : fc
    ));
  };

  return (
    <UserProfileContext.Provider value={{
      stats,
      badges,
      flashcards,
      addXp,
      recordAnswer,
      completeExercise,
      resetStats,
      removeFlashcard,
      markFlashcardReviewed,
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
