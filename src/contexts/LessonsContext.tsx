import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  completed: boolean;
}

interface LessonsContextType {
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, "id">) => void;
  updateLesson: (id: number, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: number) => void;
  resetToDefaults: () => void;
}

const defaultLessons: Lesson[] = [
  {
    id: 1,
    title: "مقدمة في اختبار القدرات",
    description: "تعرف على اختبار القدرات العامة وأقسامه وكيفية الاستعداد له",
    duration: "١٠ دقائق",
    progress: 100,
    completed: true,
  },
  {
    id: 2,
    title: "أساسيات القسم الكمي",
    description: "تعلم المفاهيم الأساسية في الرياضيات والعمليات الحسابية",
    duration: "١٥ دقيقة",
    progress: 60,
    completed: false,
  },
  {
    id: 3,
    title: "استراتيجيات الجبر",
    description: "تعلم حل المعادلات والمتتابعات العددية بطرق سريعة",
    duration: "٢٠ دقيقة",
    progress: 0,
    completed: false,
  },
  {
    id: 4,
    title: "فهم القسم اللفظي",
    description: "استراتيجيات استيعاب المقروء والتناظر اللفظي",
    duration: "٢٥ دقيقة",
    progress: 0,
    completed: false,
  },
  {
    id: 5,
    title: "نصائح يوم الاختبار",
    description: "كيف تدير وقتك وتتعامل مع ضغط الاختبار بفعالية",
    duration: "١٥ دقيقة",
    progress: 0,
    completed: false,
  },
];

const STORAGE_KEY = "divedive-lessons";

const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

export const LessonsProvider = ({ children }: { children: ReactNode }) => {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultLessons;
      }
    }
    return defaultLessons;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  }, [lessons]);

  const addLesson = (lesson: Omit<Lesson, "id">) => {
    const newId = Math.max(...lessons.map(l => l.id), 0) + 1;
    setLessons(prev => [...prev, { ...lesson, id: newId }]);
  };

  const updateLesson = (id: number, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(lesson =>
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  const deleteLesson = (id: number) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLessons(defaultLessons);
  };

  return (
    <LessonsContext.Provider value={{
      lessons,
      addLesson,
      updateLesson,
      deleteLesson,
      resetToDefaults,
    }}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error("useLessons must be used within a LessonsProvider");
  }
  return context;
};
