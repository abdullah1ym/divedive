import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Question {
  id: string;
  prompt: string;
  audioPlaceholder: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  variants?: Array<{
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
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
    duration: "١٥ دقيقة",
    questions: [
      {
        id: "q1",
        prompt: "ما هي ٢٠٪ من ١٥٠ ؟",
        audioPlaceholder: "مسألة نسب",
        options: ["٢٥", "٣٠", "٣٥", "٤٠"],
        correctAnswer: 1,
        explanation: "٢٠٪ من ١٥٠ = (٢٠/١٠٠) × ١٥٠ = ٠٫٢ × ١٥٠ = ٣٠",
        variants: [
          { id: "q1-v1", prompt: "ما هي ٢٥٪ من ٢٠٠ ؟", options: ["٤٠", "٥٠", "٦٠", "٧٥"], correctAnswer: 1, explanation: "٢٥٪ من ٢٠٠ = (٢٥/١٠٠) × ٢٠٠ = ٥٠" },
          { id: "q1-v2", prompt: "ما هي ١٥٪ من ٢٠٠ ؟", options: ["٢٥", "٣٠", "٣٥", "٤٠"], correctAnswer: 1, explanation: "١٥٪ من ٢٠٠ = (١٥/١٠٠) × ٢٠٠ = ٣٠" },
        ],
      },
      {
        id: "q2",
        prompt: "إذا كان ٣:٥ = س:٢٠، فما قيمة س؟",
        audioPlaceholder: "مسألة تناسب",
        options: ["١٠", "١٢", "١٥", "١٨"],
        correctAnswer: 1,
        explanation: "بالضرب التبادلي: ٣ × ٢٠ = ٥ × س ← ٦٠ = ٥س ← س = ١٢",
        variants: [
          { id: "q2-v1", prompt: "إذا كان ٢:٧ = س:٢١، فما قيمة س؟", options: ["٤", "٦", "٨", "١٠"], correctAnswer: 1, explanation: "بالضرب التبادلي: ٢ × ٢١ = ٧ × س ← ٤٢ = ٧س ← س = ٦" },
          { id: "q2-v2", prompt: "إذا كان ٤:٩ = س:٢٧، فما قيمة س؟", options: ["٩", "١٢", "١٥", "١٨"], correctAnswer: 1, explanation: "بالضرب التبادلي: ٤ × ٢٧ = ٩ × س ← ١٠٨ = ٩س ← س = ١٢" },
        ],
      },
      {
        id: "q3",
        prompt: "نسبة الأولاد إلى البنات ٤:٣، إذا كان عدد الأولاد ١٦، فما عدد البنات؟",
        audioPlaceholder: "مسألة تناسب",
        options: ["٩", "١٢", "١٥", "١٨"],
        correctAnswer: 1,
        explanation: "٤:٣ = ١٦:س ← بالضرب التبادلي: ٤س = ٤٨ ← س = ١٢",
        variants: [
          { id: "q3-v1", prompt: "نسبة الأولاد إلى البنات ٣:٢، إذا كان عدد الأولاد ١٥، فما عدد البنات؟", options: ["٨", "١٠", "١٢", "١٤"], correctAnswer: 1, explanation: "٣:٢ = ١٥:س ← بالضرب التبادلي: ٣س = ٣٠ ← س = ١٠" },
          { id: "q3-v2", prompt: "نسبة الأولاد إلى البنات ٥:٣، إذا كان عدد الأولاد ٢٠، فما عدد البنات؟", options: ["١٠", "١٢", "١٤", "١٦"], correctAnswer: 1, explanation: "٥:٣ = ٢٠:س ← بالضرب التبادلي: ٥س = ٦٠ ← س = ١٢" },
        ],
      },
      {
        id: "q4",
        prompt: "بسّط النسبة ١٨:٢٤",
        audioPlaceholder: "مسألة نسب",
        options: ["٢:٣", "٣:٤", "٤:٥", "٥:٦"],
        correctAnswer: 1,
        explanation: "القاسم المشترك الأكبر = ٦ ← ١٨÷٦ : ٢٤÷٦ = ٣:٤",
        variants: [
          { id: "q4-v1", prompt: "بسّط النسبة ٢٠:٣٥", options: ["٢:٥", "٣:٧", "٤:٧", "٥:٩"], correctAnswer: 2, explanation: "القاسم المشترك الأكبر = ٥ ← ٢٠÷٥ : ٣٥÷٥ = ٤:٧" },
          { id: "q4-v2", prompt: "بسّط النسبة ٢٤:٣٦", options: ["١:٢", "٢:٣", "٣:٤", "٤:٥"], correctAnswer: 1, explanation: "القاسم المشترك الأكبر = ١٢ ← ٢٤÷١٢ : ٣٦÷١٢ = ٢:٣" },
        ],
      },
      {
        id: "q5",
        prompt: "قُسم مبلغ ٢٠٠ ريال بين شخصين بنسبة ٣:٢، كم يحصل الأول؟",
        audioPlaceholder: "مسألة تناسب",
        options: ["٨٠", "١٠٠", "١٢٠", "١٤٠"],
        correctAnswer: 2,
        explanation: "مجموع الأجزاء = ٣+٢ = ٥ ← نصيب الأول = (٣/٥) × ٢٠٠ = ١٢٠ ريال",
        variants: [
          { id: "q5-v1", prompt: "قُسم مبلغ ١٥٠ ريال بين شخصين بنسبة ٢:٣، كم يحصل الثاني؟", options: ["٦٠", "٧٥", "٩٠", "١٠٥"], correctAnswer: 2, explanation: "مجموع الأجزاء = ٢+٣ = ٥ ← نصيب الثاني = (٣/٥) × ١٥٠ = ٩٠ ريال" },
          { id: "q5-v2", prompt: "قُسم مبلغ ٣٠٠ ريال بين شخصين بنسبة ٤:١، كم يحصل الأول؟", options: ["١٨٠", "٢٠٠", "٢٤٠", "٢٦٠"], correctAnswer: 2, explanation: "مجموع الأجزاء = ٤+١ = ٥ ← نصيب الأول = (٤/٥) × ٣٠٠ = ٢٤٠ ريال" },
        ],
      },
      {
        id: "q6",
        prompt: "ما هي ١٥٪ من ٢٠٠ ؟",
        audioPlaceholder: "مسألة نسب",
        options: ["٢٥", "٣٠", "٣٥", "٤٠"],
        correctAnswer: 1,
        explanation: "١٥٪ من ٢٠٠ = (١٥/١٠٠) × ٢٠٠ = ٣٠",
      },
      {
        id: "q7",
        prompt: "إذا كان أ:ب = ٢:٥ وَ ب = ٢٥، فما قيمة أ؟",
        audioPlaceholder: "مسألة تناسب",
        options: ["٨", "١٠", "١٢", "١٥"],
        correctAnswer: 1,
        explanation: "أ/ب = ٢/٥ ← أ/٢٥ = ٢/٥ ← أ = (٢×٢٥)/٥ = ١٠",
      },
      {
        id: "q8",
        prompt: "زاد سعر منتج من ٨٠ ريال إلى ١٠٠ ريال، ما نسبة الزيادة المئوية؟",
        audioPlaceholder: "مسألة نسب",
        options: ["٢٠٪", "٢٥٪", "٣٠٪", "٤٠٪"],
        correctAnswer: 1,
        explanation: "الزيادة = ١٠٠ - ٨٠ = ٢٠ ← نسبة الزيادة = (٢٠/٨٠) × ١٠٠ = ٢٥٪",
        variants: [
          { id: "q8-v1", prompt: "زاد سعر منتج من ٥٠ ريال إلى ٦٠ ريال، ما نسبة الزيادة المئوية؟", options: ["١٠٪", "١٥٪", "٢٠٪", "٢٥٪"], correctAnswer: 2, explanation: "الزيادة = ٦٠ - ٥٠ = ١٠ ← نسبة الزيادة = (١٠/٥٠) × ١٠٠ = ٢٠٪" },
          { id: "q8-v2", prompt: "زاد سعر منتج من ٢٠٠ ريال إلى ٢٥٠ ريال، ما نسبة الزيادة المئوية؟", options: ["٢٠٪", "٢٥٪", "٣٠٪", "٥٠٪"], correctAnswer: 1, explanation: "الزيادة = ٢٥٠ - ٢٠٠ = ٥٠ ← نسبة الزيادة = (٥٠/٢٠٠) × ١٠٠ = ٢٥٪" },
        ],
      },
      {
        id: "q9",
        prompt: "نسبة أعمار ثلاثة أشخاص ٢:٣:٥، مجموع أعمارهم ٥٠ سنة، ما عمر الأكبر؟",
        audioPlaceholder: "مسألة تناسب",
        options: ["١٥", "٢٠", "٢٥", "٣٠"],
        correctAnswer: 2,
        explanation: "مجموع الأجزاء = ٢+٣+٥ = ١٠ ← قيمة الجزء = ٥٠÷١٠ = ٥ ← عمر الأكبر = ٥×٥ = ٢٥",
        variants: [
          { id: "q9-v1", prompt: "نسبة أعمار ثلاثة أشخاص ١:٢:٣، مجموع أعمارهم ٦٠ سنة، ما عمر الأكبر؟", options: ["٢٠", "٢٥", "٣٠", "٣٥"], correctAnswer: 2, explanation: "مجموع الأجزاء = ١+٢+٣ = ٦ ← قيمة الجزء = ٦٠÷٦ = ١٠ ← عمر الأكبر = ٣×١٠ = ٣٠" },
        ],
      },
      {
        id: "q10",
        prompt: "إذا كان ٤٠٪ من س = ٢٠، فما قيمة س؟",
        audioPlaceholder: "مسألة نسب",
        options: ["٤٠", "٥٠", "٦٠", "٨٠"],
        correctAnswer: 1,
        explanation: "(٤٠/١٠٠) × س = ٢٠ ← ٠٫٤ × س = ٢٠ ← س = ٢٠ ÷ ٠٫٤ = ٥٠",
        variants: [
          { id: "q10-v1", prompt: "إذا كان ٢٥٪ من س = ١٥، فما قيمة س؟", options: ["٤٥", "٥٠", "٦٠", "٧٥"], correctAnswer: 2, explanation: "(٢٥/١٠٠) × س = ١٥ ← ٠٫٢٥ × س = ١٥ ← س = ١٥ ÷ ٠٫٢٥ = ٦٠" },
        ],
      },
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
  // البنك الأول - التناظر اللفظي
  {
    id: "verbal-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "طبيب : مستشفى :: معلم : ؟", audioPlaceholder: "تناظر لفظي", options: ["كتاب", "مدرسة", "طالب", "قلم"], correctAnswer: 1 },
      { id: "q2", prompt: "قلم : كتابة :: سكين : ؟", audioPlaceholder: "تناظر لفظي", options: ["طعام", "قطع", "مطبخ", "حاد"], correctAnswer: 1 },
      { id: "q3", prompt: "شمس : نهار :: قمر : ؟", audioPlaceholder: "تناظر لفظي", options: ["نجوم", "سماء", "ليل", "ضوء"], correctAnswer: 2 },
    ],
  },
  // البنك الأول - إكمال الجمل
  {
    id: "verbal-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "الصبر _____ الفرج", audioPlaceholder: "إكمال جملة", options: ["قبل", "مفتاح", "بعد", "طريق"], correctAnswer: 1 },
      { id: "q2", prompt: "العلم _____ والجهل ظلام", audioPlaceholder: "إكمال جملة", options: ["ظلمة", "نور", "صعب", "سهل"], correctAnswer: 1 },
      { id: "q3", prompt: "من جدّ _____", audioPlaceholder: "إكمال جملة", options: ["نجح", "وجد", "فاز", "تعلم"], correctAnswer: 1 },
    ],
  },
  // البنك الأول - الخطأ السياقي
  {
    id: "verbal-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: ذهبت إلى المكتبة لأشتري الخضروات", audioPlaceholder: "خطأ سياقي", options: ["ذهبت", "المكتبة", "لأشتري", "الخضروات"], correctAnswer: 1 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: الطبيب يعالج المرضى في المدرسة", audioPlaceholder: "خطأ سياقي", options: ["الطبيب", "يعالج", "المرضى", "المدرسة"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: السيارة تطير في الشارع بسرعة", audioPlaceholder: "خطأ سياقي", options: ["السيارة", "تطير", "الشارع", "بسرعة"], correctAnswer: 1 },
    ],
  },
  // البنك الأول - المفردة الشاذة
  {
    id: "verbal-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["تفاح", "برتقال", "جزر", "موز"], correctAnswer: 2 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["قلم", "كتاب", "سيارة", "دفتر"], correctAnswer: 2 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["أحمر", "أخضر", "سريع", "أزرق"], correctAnswer: 2 },
    ],
  },
  // البنك الأول - استيعاب المقروء
  {
    id: "verbal-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "الفكرة الرئيسية للنص هي:", audioPlaceholder: "نص قرائي", options: ["أهمية القراءة", "فوائد الرياضة", "أضرار التلوث", "قيمة الوقت"], correctAnswer: 0 },
      { id: "q2", prompt: "يمكن وصف أسلوب الكاتب بأنه:", audioPlaceholder: "نص قرائي", options: ["علمي", "أدبي", "صحفي", "قصصي"], correctAnswer: 0 },
      { id: "q3", prompt: "الهدف من النص هو:", audioPlaceholder: "نص قرائي", options: ["الإقناع", "الترفيه", "التوعية", "السرد"], correctAnswer: 2 },
    ],
  },
  // البنك الثاني (analogy) - placeholder
  {
    id: "analogy-1",
    title: "تمارين البنك الثاني",
    description: "تمارين لفظية متنوعة",
    category: "analogy",
    difficulty: "beginner",
    type: "analogy",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "سيتم إضافة الأسئلة قريباً", audioPlaceholder: "سؤال", options: ["--", "--", "--", "--"], correctAnswer: 0 },
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

const STORAGE_KEY = "divedive-custom-exercises";

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  // Custom exercises added by user (stored in localStorage)
  const [customExercises, setCustomExercises] = useState<Exercise[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // ignore parse errors
      }
    }
    return [];
  });

  // Always merge default exercises with custom ones - defaults are permanent
  const exercises = [...defaultExercises, ...customExercises];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customExercises));
  }, [customExercises]);

  const isDefaultExercise = (id: string) => {
    return defaultExercises.some(e => e.id === id);
  };

  const addExercise = (exercise: Omit<Exercise, "id">) => {
    const categoryPrefix = exercise.category.substring(0, 3);
    const allCategoryExercises = exercises.filter(e => e.category === exercise.category);
    const newId = `custom-${categoryPrefix}-${Date.now()}`;
    setCustomExercises(prev => [...prev, { ...exercise, id: newId }]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    // Don't allow editing default exercises
    if (isDefaultExercise(id)) return;
    setCustomExercises(prev => prev.map(exercise =>
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  };

  const deleteExercise = (id: string) => {
    // Don't allow deleting default exercises
    if (isDefaultExercise(id)) return;
    setCustomExercises(prev => prev.filter(exercise => exercise.id !== id));
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
    setCustomExercises([]);
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
