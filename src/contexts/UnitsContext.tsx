import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LearningUnit, UnitProgress, SmartRecommendation } from "@/types/units";
import { allUnits } from "@/data/units";

interface UnitsContextType {
  // الوحدات
  units: LearningUnit[];
  getUnitBySlug: (slug: string) => LearningUnit | undefined;
  getUnitById: (id: string) => LearningUnit | undefined;
  getUnitsByCategory: (category: 'quantitative' | 'verbal') => LearningUnit[];

  // التقدم
  progress: Record<string, UnitProgress>;
  getUnitProgress: (unitId: string) => UnitProgress | undefined;
  updateProgress: (unitId: string, updates: Partial<UnitProgress>) => void;
  markLessonWatched: (unitId: string) => void;
  recordQuestionAnswer: (unitId: string, setId: string, isCorrect: boolean, questionId: string) => void;
  completeExerciseSet: (unitId: string, setId: string) => void;

  // الاقتراحات الذكية
  getRecommendations: (unitId?: string) => SmartRecommendation[];
  shouldSuggestLessonReview: (unitId: string) => boolean;

  // إحصائيات
  getOverallStats: () => {
    totalUnits: number;
    completedUnits: number;
    overallProgress: number;
    averageAccuracy: number;
  };
}

const PROGRESS_STORAGE_KEY = "divedive-units-progress";

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

// حساب ما إذا كان يجب اقتراح مراجعة الدرس
const calculateNeedsReview = (progress: UnitProgress): boolean => {
  const totalAnswered = progress.exerciseProgress.reduce(
    (sum, ep) => sum + ep.questionsAnswered, 0
  );

  // إذا كانت الدقة أقل من 40% بعد 5 أسئلة
  if (totalAnswered >= 5 && progress.accuracy < 40) {
    return true;
  }

  // إذا كان هناك 3 أخطاء متتالية في نقاط الضعف
  if (progress.strugglePoints.length >= 3) {
    return true;
  }

  return false;
};

// توليد الاقتراحات الذكية
const generateRecommendations = (
  unitId: string,
  progress: UnitProgress,
  unit: LearningUnit
): SmartRecommendation[] => {
  const recommendations: SmartRecommendation[] = [];

  // اقتراح مراجعة الدرس
  if (progress.needsLessonReview && unit.foundationalLesson && !progress.lessonWatched) {
    recommendations.push({
      type: 'review_lesson',
      unitId,
      message: "ننصحك بمشاهدة الدرس التأسيسي",
      reason: `دقتك الحالية ${progress.accuracy}% - الدرس سيساعدك على فهم الأساسيات`,
      priority: 1
    });
  }

  // اقتراح إعادة التمارين السهلة
  const easySet = unit.exerciseSets.find(s => s.difficulty === 'easy');
  const easyProgress = progress.exerciseProgress.find(ep => ep.setId === easySet?.id);

  if (easyProgress && easyProgress.questionsAnswered > 0) {
    const easyAccuracy = (easyProgress.correctAnswers / easyProgress.questionsAnswered) * 100;
    if (easyAccuracy < 70) {
      recommendations.push({
        type: 'retry_easy',
        unitId,
        message: "جرب إعادة التمارين التأسيسية",
        reason: "تحتاج تعزيز الأساسيات قبل الانتقال للمستوى التالي",
        priority: 2
      });
    }
  }

  // اقتراح الانتقال للمستوى الأصعب
  if (progress.accuracy >= 85) {
    recommendations.push({
      type: 'try_harder',
      unitId,
      message: "أداؤك ممتاز! جرب أسئلة التجميعات",
      reason: `دقتك ${progress.accuracy}% - أنت جاهز للتحدي`,
      priority: 3
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
};

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<Record<string, UnitProgress>>(() => {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getUnitBySlug = (slug: string) => allUnits.find(u => u.slug === slug);
  const getUnitById = (id: string) => allUnits.find(u => u.id === id);

  const getUnitsByCategory = (category: 'quantitative' | 'verbal') =>
    allUnits.filter(u => u.category === category).sort((a, b) => a.order - b.order);

  const getUnitProgress = (unitId: string) => progress[unitId];

  const initializeProgress = (unitId: string): UnitProgress => ({
    unitId,
    lessonWatched: false,
    exerciseProgress: [],
    overallProgress: 0,
    accuracy: 0,
    status: 'available',
    strugglePoints: [],
    needsLessonReview: false
  });

  const updateProgress = (unitId: string, updates: Partial<UnitProgress>) => {
    setProgress(prev => {
      const current = prev[unitId] || initializeProgress(unitId);
      const updated = { ...current, ...updates };
      updated.needsLessonReview = calculateNeedsReview(updated);
      return { ...prev, [unitId]: updated };
    });
  };

  const markLessonWatched = (unitId: string) => {
    updateProgress(unitId, {
      lessonWatched: true,
      lessonCompletedAt: new Date().toISOString(),
      needsLessonReview: false
    });
  };

  const recordQuestionAnswer = (
    unitId: string,
    setId: string,
    isCorrect: boolean,
    questionId: string
  ) => {
    setProgress(prev => {
      const current = prev[unitId] || initializeProgress(unitId);
      let exerciseProgress = [...current.exerciseProgress];

      const setIndex = exerciseProgress.findIndex(ep => ep.setId === setId);

      if (setIndex === -1) {
        exerciseProgress.push({
          setId,
          questionsAnswered: 1,
          correctAnswers: isCorrect ? 1 : 0,
          wrongAnswers: isCorrect ? 0 : 1
        });
      } else {
        exerciseProgress[setIndex] = {
          ...exerciseProgress[setIndex],
          questionsAnswered: exerciseProgress[setIndex].questionsAnswered + 1,
          correctAnswers: exerciseProgress[setIndex].correctAnswers + (isCorrect ? 1 : 0),
          wrongAnswers: exerciseProgress[setIndex].wrongAnswers + (isCorrect ? 0 : 1)
        };
      }

      // حساب الدقة الإجمالية
      const totalCorrect = exerciseProgress.reduce((sum, ep) => sum + ep.correctAnswers, 0);
      const totalAnswered = exerciseProgress.reduce((sum, ep) => sum + ep.questionsAnswered, 0);
      const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      // تتبع نقاط الضعف
      let strugglePoints = current.strugglePoints;
      if (!isCorrect) {
        strugglePoints = [...strugglePoints, questionId].slice(-10); // احتفظ بآخر 10
      } else {
        // إزالة السؤال من نقاط الضعف إذا أجاب صحيح
        strugglePoints = strugglePoints.filter(id => id !== questionId);
      }

      // حساب التقدم الكلي
      const unit = getUnitById(unitId);
      const totalQuestions = unit?.totalQuestions || 1;
      const overallProgress = Math.min(Math.round((totalAnswered / totalQuestions) * 100), 100);

      // تحديد الحالة
      let status = current.status;
      if (overallProgress > 0 && overallProgress < 100) {
        status = 'in_progress';
      } else if (overallProgress >= 100 && accuracy >= 80) {
        status = 'mastered';
      } else if (overallProgress >= 100) {
        status = 'completed';
      }

      const updated: UnitProgress = {
        ...current,
        exerciseProgress,
        accuracy,
        overallProgress,
        status,
        strugglePoints,
        lastAttemptAt: new Date().toISOString(),
        needsLessonReview: false
      };

      updated.needsLessonReview = calculateNeedsReview(updated);

      return { ...prev, [unitId]: updated };
    });
  };

  const completeExerciseSet = (unitId: string, setId: string) => {
    setProgress(prev => {
      const current = prev[unitId];
      if (!current) return prev;

      const exerciseProgress = current.exerciseProgress.map(ep =>
        ep.setId === setId
          ? { ...ep, completedAt: new Date().toISOString() }
          : ep
      );

      return {
        ...prev,
        [unitId]: { ...current, exerciseProgress }
      };
    });
  };

  const getRecommendations = (unitId?: string): SmartRecommendation[] => {
    if (unitId) {
      const unit = getUnitById(unitId);
      const unitProgress = progress[unitId];
      if (unit && unitProgress) {
        return generateRecommendations(unitId, unitProgress, unit);
      }
      return [];
    }

    // اقتراحات عامة
    return allUnits
      .filter(u => progress[u.id])
      .flatMap(u => generateRecommendations(u.id, progress[u.id], u))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);
  };

  const shouldSuggestLessonReview = (unitId: string): boolean => {
    return progress[unitId]?.needsLessonReview || false;
  };

  const getOverallStats = () => {
    const progressValues = Object.values(progress);
    const completedUnits = progressValues.filter(
      p => p.status === 'completed' || p.status === 'mastered'
    ).length;

    const totalProgress = progressValues.reduce((sum, p) => sum + p.overallProgress, 0);
    const totalAccuracy = progressValues.reduce((sum, p) => sum + p.accuracy, 0);

    return {
      totalUnits: allUnits.length,
      completedUnits,
      overallProgress: progressValues.length > 0
        ? Math.round(totalProgress / progressValues.length)
        : 0,
      averageAccuracy: progressValues.length > 0
        ? Math.round(totalAccuracy / progressValues.length)
        : 0
    };
  };

  return (
    <UnitsContext.Provider value={{
      units: allUnits,
      getUnitBySlug,
      getUnitById,
      getUnitsByCategory,
      progress,
      getUnitProgress,
      updateProgress,
      markLessonWatched,
      recordQuestionAnswer,
      completeExerciseSet,
      getRecommendations,
      shouldSuggestLessonReview,
      getOverallStats
    }}>
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = () => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
};
