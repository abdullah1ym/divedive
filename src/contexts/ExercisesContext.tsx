import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Question {
  id: string;
  prompt: string;
  audioPlaceholder: string;
  options: string[];
  correctAnswer: number;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "quantitative" | "verbal" | "algebra" | "analogy" | "mixed";
  duration: string;
  questions: Question[];
}

interface ExercisesContextType {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, "id">) => void;
  updateExercise: (id: string, exercise: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExercisesByCategory: (category: string) => Exercise[];
  getExerciseById: (id: string) => Exercise | undefined;
  resetToDefaults: () => void;
}

const defaultExercises: Exercise[] = [
  {
    id: "quant-1",
    title: "العمليات الحسابية الأساسية",
    description: "تدريب على الجمع والطرح والضرب والقسمة",
    category: "quantitative",
    difficulty: "beginner",
    type: "quantitative",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "ما ناتج: ٢٥ × ٤ ؟", audioPlaceholder: "مسألة حسابية", options: ["٨٠", "١٠٠", "٩٠", "١٢٠"], correctAnswer: 1 },
      { id: "q2", prompt: "ما ناتج: ١٤٤ ÷ ١٢ ؟", audioPlaceholder: "مسألة حسابية", options: ["١٠", "١٢", "١٤", "١٦"], correctAnswer: 1 },
      { id: "q3", prompt: "ما ناتج: ٣٧ + ٤٨ ؟", audioPlaceholder: "مسألة حسابية", options: ["٧٥", "٨٥", "٩٥", "٦٥"], correctAnswer: 1 },
    ],
  },
  {
    id: "quant-2",
    title: "النسب والتناسب",
    description: "حل مسائل النسب المئوية والتناسب",
    category: "quantitative",
    difficulty: "intermediate",
    type: "quantitative",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "ما هي ٢٠٪ من ١٥٠ ؟", audioPlaceholder: "مسألة نسب", options: ["٢٥", "٣٠", "٣٥", "٤٠"], correctAnswer: 1 },
      { id: "q2", prompt: "إذا كان ٣:٥ = س:٢٠، فما قيمة س؟", audioPlaceholder: "مسألة تناسب", options: ["١٠", "١٢", "١٥", "١٨"], correctAnswer: 1 },
    ],
  },
  {
    id: "algebra-1",
    title: "المعادلات الخطية",
    description: "حل المعادلات من الدرجة الأولى",
    category: "algebra",
    difficulty: "beginner",
    type: "algebra",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "حل المعادلة: س + ٧ = ١٥", audioPlaceholder: "معادلة خطية", options: ["٦", "٧", "٨", "٩"], correctAnswer: 2 },
      { id: "q2", prompt: "حل المعادلة: ٢س = ١٨", audioPlaceholder: "معادلة خطية", options: ["٧", "٨", "٩", "١٠"], correctAnswer: 2 },
      { id: "q3", prompt: "حل المعادلة: ٣س - ٥ = ١٠", audioPlaceholder: "معادلة خطية", options: ["٣", "٤", "٥", "٦"], correctAnswer: 2 },
    ],
  },
  {
    id: "algebra-2",
    title: "المتتابعات العددية",
    description: "إيجاد النمط في المتتابعات",
    category: "algebra",
    difficulty: "intermediate",
    type: "algebra",
    duration: "٨ دقائق",
    questions: [
      { id: "q1", prompt: "ما العدد التالي: ٢، ٥، ٨، ١١، ...؟", audioPlaceholder: "متتابعة عددية", options: ["١٢", "١٣", "١٤", "١٥"], correctAnswer: 2 },
      { id: "q2", prompt: "ما العدد التالي: ٣، ٦، ١٢، ٢٤، ...؟", audioPlaceholder: "متتابعة عددية", options: ["٣٦", "٤٨", "٥٠", "٥٢"], correctAnswer: 1 },
    ],
  },
  {
    id: "verbal-1",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "الفكرة الرئيسية للنص هي:", audioPlaceholder: "نص قرائي", options: ["أهمية القراءة", "فوائد الرياضة", "أضرار التلوث", "قيمة الوقت"], correctAnswer: 0 },
      { id: "q2", prompt: "يمكن وصف أسلوب الكاتب بأنه:", audioPlaceholder: "نص قرائي", options: ["علمي", "أدبي", "صحفي", "قصصي"], correctAnswer: 0 },
    ],
  },
  {
    id: "analogy-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "analogy",
    difficulty: "beginner",
    type: "analogy",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "طبيب : مستشفى :: معلم : ؟", audioPlaceholder: "تناظر لفظي", options: ["كتاب", "مدرسة", "طالب", "قلم"], correctAnswer: 1 },
      { id: "q2", prompt: "قلم : كتابة :: سكين : ؟", audioPlaceholder: "تناظر لفظي", options: ["طعام", "قطع", "مطبخ", "حاد"], correctAnswer: 1 },
      { id: "q3", prompt: "شمس : نهار :: قمر : ؟", audioPlaceholder: "تناظر لفظي", options: ["نجوم", "سماء", "ليل", "ضوء"], correctAnswer: 2 },
    ],
  },
  {
    id: "mixed-1",
    title: "اختبار تجريبي شامل",
    description: "أسئلة متنوعة من الكمي واللفظي",
    category: "mixed",
    difficulty: "advanced",
    type: "mixed",
    duration: "١٥ دقيقة",
    questions: [
      { id: "q1", prompt: "ما ناتج: ٧² - ٣² ؟", audioPlaceholder: "سؤال كمي", options: ["٣٠", "٤٠", "٥٠", "٦٠"], correctAnswer: 1 },
      { id: "q2", prompt: "ضد كلمة 'الكرم':", audioPlaceholder: "سؤال لفظي", options: ["الجود", "البخل", "العطاء", "السخاء"], correctAnswer: 1 },
      { id: "q3", prompt: "أوجد قيمة س: ٢س + ٣ = ١١", audioPlaceholder: "سؤال جبري", options: ["٣", "٤", "٥", "٦"], correctAnswer: 1 },
    ],
  },
];

const STORAGE_KEY = "divedive-exercises";

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultExercises;
      }
    }
    return defaultExercises;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
  }, [exercises]);

  const addExercise = (exercise: Omit<Exercise, "id">) => {
    const categoryPrefix = exercise.category.substring(0, 3);
    const categoryExercises = exercises.filter(e => e.category === exercise.category);
    const newId = `${categoryPrefix}-${categoryExercises.length + 1}`;
    setExercises(prev => [...prev, { ...exercise, id: newId }]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(exercise =>
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  };

  const getExercisesByCategory = (category: string) => {
    if (category === "all-math") {
      return exercises.filter(e => e.category === "quantitative" || e.category === "algebra");
    }
    if (category === "all-verbal") {
      return exercises.filter(e => e.category === "verbal" || e.category === "analogy");
    }
    return exercises.filter(e => e.category === category);
  };

  const getExerciseById = (id: string) => {
    return exercises.find(e => e.id === id);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setExercises(defaultExercises);
  };

  return (
    <ExercisesContext.Provider value={{
      exercises,
      addExercise,
      updateExercise,
      deleteExercise,
      getExercisesByCategory,
      getExerciseById,
      resetToDefaults,
    }}>
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error("useExercises must be used within an ExercisesProvider");
  }
  return context;
};
