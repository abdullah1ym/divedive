import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// تعريف تقدم المهارة
interface SkillProgressData {
  correctAnswers: number;
  answeredQuestionIds: string[];
}

interface SkillProgressState {
  math: Record<string, SkillProgressData>;
  verbal: Record<string, SkillProgressData>;
}

interface SkillProgressContextType {
  // تسجيل إجابة صحيحة
  recordCorrectAnswer: (skillTag: string, questionId: string, category: "math" | "verbal") => void;
  // الحصول على نسبة التقدم
  getSkillProgress: (skillTag: string, totalQuestions: number, category: "math" | "verbal") => number;
  // الحصول على عدد الإجابات الصحيحة
  getCorrectCount: (skillTag: string, category: "math" | "verbal") => number;
  // هل المهارة مكتملة؟
  isSkillMastered: (skillTag: string, totalQuestions: number, category: "math" | "verbal") => boolean;
  // هل السؤال محلول مسبقاً؟
  isQuestionAnswered: (skillTag: string, questionId: string, category: "math" | "verbal") => boolean;
  // إعادة تعيين التقدم
  resetProgress: () => void;
}

const STORAGE_KEY = "divedive-skill-progress";

const defaultState: SkillProgressState = {
  math: {},
  verbal: {},
};

const SkillProgressContext = createContext<SkillProgressContextType | undefined>(undefined);

export const SkillProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<SkillProgressState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  // حفظ التقدم في localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // تسجيل إجابة صحيحة
  const recordCorrectAnswer = (skillTag: string, questionId: string, category: "math" | "verbal") => {
    setProgress(prev => {
      const categoryProgress = prev[category];
      const skillData = categoryProgress[skillTag] || { correctAnswers: 0, answeredQuestionIds: [] };

      // تحقق من أن السؤال لم يُجب عليه من قبل
      if (skillData.answeredQuestionIds.includes(questionId)) {
        return prev;
      }

      return {
        ...prev,
        [category]: {
          ...categoryProgress,
          [skillTag]: {
            correctAnswers: skillData.correctAnswers + 1,
            answeredQuestionIds: [...skillData.answeredQuestionIds, questionId],
          },
        },
      };
    });
  };

  // الحصول على نسبة التقدم (0-100)
  const getSkillProgress = (skillTag: string, totalQuestions: number, category: "math" | "verbal"): number => {
    const skillData = progress[category][skillTag];
    if (!skillData || totalQuestions === 0) return 0;
    return Math.min(100, Math.round((skillData.correctAnswers / totalQuestions) * 100));
  };

  // الحصول على عدد الإجابات الصحيحة
  const getCorrectCount = (skillTag: string, category: "math" | "verbal"): number => {
    const skillData = progress[category][skillTag];
    return skillData?.correctAnswers || 0;
  };

  // هل المهارة مكتملة؟
  const isSkillMastered = (skillTag: string, totalQuestions: number, category: "math" | "verbal"): boolean => {
    return getSkillProgress(skillTag, totalQuestions, category) >= 100;
  };

  // هل السؤال محلول مسبقاً؟
  const isQuestionAnswered = (skillTag: string, questionId: string, category: "math" | "verbal"): boolean => {
    const skillData = progress[category][skillTag];
    return skillData?.answeredQuestionIds.includes(questionId) || false;
  };

  // إعادة تعيين التقدم
  const resetProgress = () => {
    setProgress(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SkillProgressContext.Provider value={{
      recordCorrectAnswer,
      getSkillProgress,
      getCorrectCount,
      isSkillMastered,
      isQuestionAnswered,
      resetProgress,
    }}>
      {children}
    </SkillProgressContext.Provider>
  );
};

export const useSkillProgress = () => {
  const context = useContext(SkillProgressContext);
  if (!context) {
    throw new Error("useSkillProgress must be used within a SkillProgressProvider");
  }
  return context;
};
