import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import bank1TanadhurData from "@/data/bank1_tanadhur_questions.json";
import bank1SentenceCompletionData from "@/data/bank1_sentence_completion_questions.json";
import bank1ContextualErrorData from "@/data/bank1_contextual_error_questions.json";
import bank1OddWordData from "@/data/bank1_odd_word_questions.json";

// Transform bank1 tanadhur questions to match Question interface
const bank1TanadhurQuestions = bank1TanadhurData.questions.map((q: any) => ({
  id: `bank1-tanadhur-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "تناظر لفظي",
  options: q.options.filter((opt: string) => opt !== ""),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

// Transform bank1 sentence completion questions to match Question interface
const bank1SentenceCompletionQuestions = bank1SentenceCompletionData.questions.map((q: any) => ({
  id: `bank1-sc-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "إكمال جملة",
  options: q.options.filter((opt: string) => opt !== "" && opt !== "......"),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

// Transform bank1 contextual error questions to match Question interface
const bank1ContextualErrorQuestions = bank1ContextualErrorData.questions.map((q: any) => ({
  id: `bank1-ce-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "خطأ سياقي",
  options: q.options.filter((opt: string) => opt !== ""),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

// Transform bank1 odd word questions to match Question interface
const bank1OddWordQuestions = bank1OddWordData.questions.map((q: any) => ({
  id: `bank1-ow-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "مفردة شاذة",
  options: q.options.filter((opt: string) => opt !== ""),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

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
  // البنك الأول - التناظر اللفظي (138 سؤال من الملف المحلول)
  {
    id: "verbal-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات - ١٣٨ سؤال",
    category: "verbal",
    difficulty: "beginner",
    type: "verbal",
    duration: "٤٥ دقيقة",
    questions: bank1TanadhurQuestions,
  },
  // البنك الأول - إكمال الجمل (101 سؤال من الملف المحلول)
  {
    id: "verbal-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة - ١٠١ سؤال",
    category: "verbal",
    difficulty: "beginner",
    type: "verbal",
    duration: "٤٥ دقيقة",
    questions: bank1SentenceCompletionQuestions,
  },
  // البنك الأول - الخطأ السياقي (101 سؤال من الملف المحلول)
  {
    id: "verbal-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق - ١٠١ سؤال",
    category: "verbal",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٤٥ دقيقة",
    questions: bank1ContextualErrorQuestions,
  },
  // البنك الأول - المفردة الشاذة (100 سؤال من الملف المحلول)
  {
    id: "verbal-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة - ١٠٠ سؤال",
    category: "verbal",
    difficulty: "beginner",
    type: "verbal",
    duration: "٤٥ دقيقة",
    questions: bank1OddWordQuestions,
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
  // البنك الثاني - التناظر اللفظي
  {
    id: "verbal-b2-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-2",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "كاتب : رواية :: رسام : ؟", audioPlaceholder: "تناظر لفظي", options: ["ألوان", "لوحة", "فرشاة", "معرض"], correctAnswer: 1 },
      { id: "q2", prompt: "نحلة : عسل :: بقرة : ؟", audioPlaceholder: "تناظر لفظي", options: ["مزرعة", "حليب", "عشب", "لحم"], correctAnswer: 1 },
      { id: "q3", prompt: "طائرة : مطار :: قطار : ؟", audioPlaceholder: "تناظر لفظي", options: ["سكة", "محطة", "عجلات", "سفر"], correctAnswer: 1 },
    ],
  },
  // البنك الثاني - إكمال الجمل
  {
    id: "verbal-b2-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-2",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "الوقت كالسيف إن لم تقطعه _____", audioPlaceholder: "إكمال جملة", options: ["ضاع", "قطعك", "مضى", "انتهى"], correctAnswer: 1 },
      { id: "q2", prompt: "القراءة غذاء _____", audioPlaceholder: "إكمال جملة", options: ["الجسم", "العقل", "الروح", "القلب"], correctAnswer: 1 },
      { id: "q3", prompt: "الصديق وقت _____", audioPlaceholder: "إكمال جملة", options: ["الفرح", "الضيق", "اللعب", "العمل"], correctAnswer: 1 },
    ],
  },
  // البنك الثاني - الخطأ السياقي
  {
    id: "verbal-b2-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-2",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: الطيور تسبح في السماء بحرية", audioPlaceholder: "خطأ سياقي", options: ["الطيور", "تسبح", "السماء", "بحرية"], correctAnswer: 1 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: المهندس يصمم الأدوية في المختبر", audioPlaceholder: "خطأ سياقي", options: ["المهندس", "يصمم", "الأدوية", "المختبر"], correctAnswer: 0 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: الفلاح يحصد القمح في المحيط", audioPlaceholder: "خطأ سياقي", options: ["الفلاح", "يحصد", "القمح", "المحيط"], correctAnswer: 3 },
    ],
  },
  // البنك الثاني - المفردة الشاذة
  {
    id: "verbal-b2-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-2",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["كرسي", "طاولة", "سرير", "تلفاز"], correctAnswer: 3 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["أسد", "نمر", "حصان", "فهد"], correctAnswer: 2 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["الرياض", "جدة", "مصر", "الدمام"], correctAnswer: 2 },
    ],
  },
  // البنك الثاني - استيعاب المقروء
  {
    id: "verbal-b2-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-2",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "ما العنوان المناسب للنص؟", audioPlaceholder: "نص قرائي", options: ["أهمية التعليم", "مشاكل البيئة", "تاريخ العرب", "الصحة العامة"], correctAnswer: 0 },
      { id: "q2", prompt: "موقف الكاتب من الموضوع:", audioPlaceholder: "نص قرائي", options: ["محايد", "مؤيد", "معارض", "ساخر"], correctAnswer: 1 },
      { id: "q3", prompt: "كلمة 'ذلك' في السطر الثالث تعود على:", audioPlaceholder: "نص قرائي", options: ["التعليم", "المجتمع", "الطالب", "المعلم"], correctAnswer: 0 },
    ],
  },
  // البنك الثالث - التناظر اللفظي
  {
    id: "verbal-b3-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-3",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "عين : رؤية :: أذن : ؟", audioPlaceholder: "تناظر لفظي", options: ["صوت", "سمع", "كلام", "موسيقى"], correctAnswer: 1 },
      { id: "q2", prompt: "ورقة : شجرة :: ريشة : ؟", audioPlaceholder: "تناظر لفظي", options: ["قلم", "طائر", "هواء", "عش"], correctAnswer: 1 },
      { id: "q3", prompt: "ملك : قصر :: راعي : ؟", audioPlaceholder: "تناظر لفظي", options: ["غنم", "مرعى", "كلب", "عصا"], correctAnswer: 1 },
    ],
  },
  // البنك الثالث - إكمال الجمل
  {
    id: "verbal-b3-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-3",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "رب أخ لم _____ أمك", audioPlaceholder: "إكمال جملة", options: ["تعرفه", "تلده", "تراه", "تحبه"], correctAnswer: 1 },
      { id: "q2", prompt: "في التأني _____ وفي العجلة الندامة", audioPlaceholder: "إكمال جملة", options: ["الحكمة", "السلامة", "الراحة", "الفائدة"], correctAnswer: 1 },
      { id: "q3", prompt: "العقل السليم في الجسم _____", audioPlaceholder: "إكمال جملة", options: ["القوي", "السليم", "الكبير", "النشيط"], correctAnswer: 1 },
    ],
  },
  // البنك الثالث - الخطأ السياقي
  {
    id: "verbal-b3-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-3",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: الممرضة تطبخ الدواء للمريض", audioPlaceholder: "خطأ سياقي", options: ["الممرضة", "تطبخ", "الدواء", "للمريض"], correctAnswer: 1 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: السباح يجري في الماء بسرعة", audioPlaceholder: "خطأ سياقي", options: ["السباح", "يجري", "الماء", "بسرعة"], correctAnswer: 1 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: الشمس تشرق من الغرب كل صباح", audioPlaceholder: "خطأ سياقي", options: ["الشمس", "تشرق", "الغرب", "صباح"], correctAnswer: 2 },
    ],
  },
  // البنك الثالث - المفردة الشاذة
  {
    id: "verbal-b3-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-3",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["سعيد", "فرحان", "مسرور", "غاضب"], correctAnswer: 3 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["يد", "قدم", "رأس", "حذاء"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["ذهب", "فضة", "حديد", "خشب"], correctAnswer: 3 },
    ],
  },
  // البنك الثالث - استيعاب المقروء
  {
    id: "verbal-b3-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-3",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "الغرض من النص هو:", audioPlaceholder: "نص قرائي", options: ["الوصف", "الإقناع", "السرد", "التفسير"], correctAnswer: 1 },
      { id: "q2", prompt: "نوع النص هو:", audioPlaceholder: "نص قرائي", options: ["قصة", "مقال", "شعر", "رسالة"], correctAnswer: 1 },
      { id: "q3", prompt: "الفكرة الفرعية في الفقرة الثانية:", audioPlaceholder: "نص قرائي", options: ["أسباب المشكلة", "حلول المشكلة", "نتائج المشكلة", "تعريف المشكلة"], correctAnswer: 0 },
    ],
  },
  // البنك الرابع - التناظر اللفظي
  {
    id: "verbal-b4-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-4",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "نار : حرارة :: ثلج : ؟", audioPlaceholder: "تناظر لفظي", options: ["ماء", "برودة", "شتاء", "أبيض"], correctAnswer: 1 },
      { id: "q2", prompt: "سيف : محارب :: مشرط : ؟", audioPlaceholder: "تناظر لفظي", options: ["مستشفى", "جراح", "عملية", "مريض"], correctAnswer: 1 },
      { id: "q3", prompt: "صحراء : جمل :: بحر : ؟", audioPlaceholder: "تناظر لفظي", options: ["ماء", "سفينة", "سمك", "موج"], correctAnswer: 1 },
    ],
  },
  // البنك الرابع - إكمال الجمل
  {
    id: "verbal-b4-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-4",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "إذا كثرت _____ قل الإتقان", audioPlaceholder: "إكمال جملة", options: ["الأعمال", "المهام", "الصنائع", "الواجبات"], correctAnswer: 2 },
      { id: "q2", prompt: "لا تؤجل عمل اليوم إلى _____", audioPlaceholder: "إكمال جملة", options: ["الليل", "غداً", "الغد", "لاحقاً"], correctAnswer: 2 },
      { id: "q3", prompt: "خير الكلام ما قل و_____", audioPlaceholder: "إكمال جملة", options: ["أفاد", "دل", "نفع", "وضح"], correctAnswer: 1 },
    ],
  },
  // البنك الرابع - الخطأ السياقي
  {
    id: "verbal-b4-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-4",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: القمر يضيء السماء في النهار", audioPlaceholder: "خطأ سياقي", options: ["القمر", "يضيء", "السماء", "النهار"], correctAnswer: 3 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: الطالب يقرأ الكتاب بأذنيه", audioPlaceholder: "خطأ سياقي", options: ["الطالب", "يقرأ", "الكتاب", "بأذنيه"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: الطباخ يخيط الطعام في المطبخ", audioPlaceholder: "خطأ سياقي", options: ["الطباخ", "يخيط", "الطعام", "المطبخ"], correctAnswer: 1 },
    ],
  },
  // البنك الرابع - المفردة الشاذة
  {
    id: "verbal-b4-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-4",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["قطة", "كلب", "أسد", "حمامة"], correctAnswer: 3 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["طبيب", "مهندس", "معلم", "مريض"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["ثانية", "دقيقة", "ساعة", "متر"], correctAnswer: 3 },
    ],
  },
  // البنك الرابع - استيعاب المقروء
  {
    id: "verbal-b4-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-4",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "معنى كلمة 'يتسم' في النص:", audioPlaceholder: "نص قرائي", options: ["يتصف", "يتغير", "يتحرك", "يتكلم"], correctAnswer: 0 },
      { id: "q2", prompt: "العلاقة بين الفقرتين الأولى والثانية:", audioPlaceholder: "نص قرائي", options: ["سبب ونتيجة", "تضاد", "إجمال وتفصيل", "مقارنة"], correctAnswer: 2 },
      { id: "q3", prompt: "يمكن استنتاج من النص أن:", audioPlaceholder: "نص قرائي", options: ["العلم مهم", "الجهل خطر", "القراءة ممتعة", "الكتابة صعبة"], correctAnswer: 0 },
    ],
  },
  // البنك الخامس - التناظر اللفظي
  {
    id: "verbal-b5-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-5",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "مفتاح : قفل :: كلمة سر : ؟", audioPlaceholder: "تناظر لفظي", options: ["هاتف", "حساب", "رقم", "بريد"], correctAnswer: 1 },
      { id: "q2", prompt: "جناح : طائر :: زعنفة : ؟", audioPlaceholder: "تناظر لفظي", options: ["بحر", "سمكة", "ماء", "سباحة"], correctAnswer: 1 },
      { id: "q3", prompt: "غلاف : كتاب :: قشرة : ؟", audioPlaceholder: "تناظر لفظي", options: ["شجرة", "فاكهة", "طعام", "لون"], correctAnswer: 1 },
    ],
  },
  // البنك الخامس - إكمال الجمل
  {
    id: "verbal-b5-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-5",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "الجار قبل _____", audioPlaceholder: "إكمال جملة", options: ["البيت", "الدار", "المنزل", "السكن"], correctAnswer: 1 },
      { id: "q2", prompt: "من سار على الدرب _____", audioPlaceholder: "إكمال جملة", options: ["تعب", "وصل", "سقط", "رجع"], correctAnswer: 1 },
      { id: "q3", prompt: "اليد الواحدة لا _____", audioPlaceholder: "إكمال جملة", options: ["تعمل", "تصفق", "تكتب", "تمسك"], correctAnswer: 1 },
    ],
  },
  // البنك الخامس - الخطأ السياقي
  {
    id: "verbal-b5-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-5",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: الحداد يصنع الخبز في الفرن", audioPlaceholder: "خطأ سياقي", options: ["الحداد", "يصنع", "الخبز", "الفرن"], correctAnswer: 0 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: الأسماك تعيش على اليابسة", audioPlaceholder: "خطأ سياقي", options: ["الأسماك", "تعيش", "على", "اليابسة"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: الجمل سفينة الجبال", audioPlaceholder: "خطأ سياقي", options: ["الجمل", "سفينة", "الجبال", "---"], correctAnswer: 2 },
    ],
  },
  // البنك الخامس - المفردة الشاذة
  {
    id: "verbal-b5-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-5",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["قهوة", "شاي", "عصير", "خبز"], correctAnswer: 3 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["السبت", "الأحد", "يناير", "الاثنين"], correctAnswer: 2 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["مثلث", "مربع", "دائرة", "أحمر"], correctAnswer: 3 },
    ],
  },
  // البنك الخامس - استيعاب المقروء
  {
    id: "verbal-b5-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-5",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "الضمير 'هم' يعود على:", audioPlaceholder: "نص قرائي", options: ["العلماء", "الطلاب", "الناس", "الكتاب"], correctAnswer: 0 },
      { id: "q2", prompt: "أسلوب الكاتب في النص:", audioPlaceholder: "نص قرائي", options: ["وصفي", "سردي", "حجاجي", "تفسيري"], correctAnswer: 2 },
      { id: "q3", prompt: "الفكرة التي لم يذكرها النص:", audioPlaceholder: "نص قرائي", options: ["أهمية العلم", "قيمة العمل", "فضل الصدق", "ضرر الكسل"], correctAnswer: 2 },
    ],
  },
  // البنك السادس - التناظر اللفظي
  {
    id: "verbal-b6-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-6",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "ماء : عطش :: طعام : ؟", audioPlaceholder: "تناظر لفظي", options: ["أكل", "جوع", "شرب", "مطبخ"], correctAnswer: 1 },
      { id: "q2", prompt: "شاعر : قصيدة :: موسيقي : ؟", audioPlaceholder: "تناظر لفظي", options: ["آلة", "لحن", "حفلة", "مسرح"], correctAnswer: 1 },
      { id: "q3", prompt: "ربيع : زهور :: خريف : ؟", audioPlaceholder: "تناظر لفظي", options: ["برد", "أوراق", "مطر", "رياح"], correctAnswer: 1 },
    ],
  },
  // البنك السادس - إكمال الجمل
  {
    id: "verbal-b6-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-6",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "الحاجة أم _____", audioPlaceholder: "إكمال جملة", options: ["العمل", "الاختراع", "النجاح", "الإبداع"], correctAnswer: 1 },
      { id: "q2", prompt: "درهم وقاية خير من قنطار _____", audioPlaceholder: "إكمال جملة", options: ["دواء", "علاج", "مرض", "صحة"], correctAnswer: 1 },
      { id: "q3", prompt: "ليس الفتى من يقول كان أبي ولكن الفتى من يقول ها أنا _____", audioPlaceholder: "إكمال جملة", options: ["هنا", "ذا", "موجود", "قادم"], correctAnswer: 1 },
    ],
  },
  // البنك السادس - الخطأ السياقي
  {
    id: "verbal-b6-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-6",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: النجار يبني الأثاث من الخشب", audioPlaceholder: "خطأ سياقي", options: ["النجار", "يبني", "الأثاث", "الخشب"], correctAnswer: 1 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: الثلج يسقط في فصل الصيف", audioPlaceholder: "خطأ سياقي", options: ["الثلج", "يسقط", "فصل", "الصيف"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: البحار يقود السيارة في المحيط", audioPlaceholder: "خطأ سياقي", options: ["البحار", "يقود", "السيارة", "المحيط"], correctAnswer: 2 },
    ],
  },
  // البنك السادس - المفردة الشاذة
  {
    id: "verbal-b6-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-6",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["عين", "أنف", "فم", "يد"], correctAnswer: 3 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["سعودية", "مصر", "باريس", "الأردن"], correctAnswer: 2 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["جمع", "طرح", "ضرب", "كتابة"], correctAnswer: 3 },
    ],
  },
  // البنك السادس - استيعاب المقروء
  {
    id: "verbal-b6-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-6",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "مضاد كلمة 'النفع' في النص:", audioPlaceholder: "نص قرائي", options: ["الفائدة", "الضرر", "الخير", "المصلحة"], correctAnswer: 1 },
      { id: "q2", prompt: "نستنتج من الفقرة الأخيرة:", audioPlaceholder: "نص قرائي", options: ["تفاؤل الكاتب", "تشاؤم الكاتب", "حياد الكاتب", "غضب الكاتب"], correctAnswer: 0 },
      { id: "q3", prompt: "الجملة التي تلخص النص:", audioPlaceholder: "نص قرائي", options: ["العلم نور", "الصبر مفتاح", "العمل عبادة", "الوقت ذهب"], correctAnswer: 0 },
    ],
  },
  // البنك السابع - التناظر اللفظي
  {
    id: "verbal-b7-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-7",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "قاضي : محكمة :: إمام : ؟", audioPlaceholder: "تناظر لفظي", options: ["صلاة", "مسجد", "قرآن", "خطبة"], correctAnswer: 1 },
      { id: "q2", prompt: "قراءة : عين :: استماع : ؟", audioPlaceholder: "تناظر لفظي", options: ["صوت", "أذن", "موسيقى", "كلام"], correctAnswer: 1 },
      { id: "q3", prompt: "فأس : حطب :: منشار : ؟", audioPlaceholder: "تناظر لفظي", options: ["نجار", "خشب", "شجرة", "أداة"], correctAnswer: 1 },
    ],
  },
  // البنك السابع - إكمال الجمل
  {
    id: "verbal-b7-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-7",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "الطيور على أشكالها _____", audioPlaceholder: "إكمال جملة", options: ["تطير", "تقع", "تجتمع", "تعيش"], correctAnswer: 1 },
      { id: "q2", prompt: "رحلة الألف ميل تبدأ بـ _____", audioPlaceholder: "إكمال جملة", options: ["خطوة", "عزيمة", "إرادة", "أمل"], correctAnswer: 0 },
      { id: "q3", prompt: "لكل داء دواء إلا _____", audioPlaceholder: "إكمال جملة", options: ["المرض", "الموت", "الهرم", "الألم"], correctAnswer: 2 },
    ],
  },
  // البنك السابع - الخطأ السياقي
  {
    id: "verbal-b7-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-7",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: المزارع يحلب الدجاج كل صباح", audioPlaceholder: "خطأ سياقي", options: ["المزارع", "يحلب", "الدجاج", "صباح"], correctAnswer: 2 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: الكتاب يُقرأ بالأقدام", audioPlaceholder: "خطأ سياقي", options: ["الكتاب", "يُقرأ", "بالأقدام", "---"], correctAnswer: 2 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: النار باردة جداً في الشتاء", audioPlaceholder: "خطأ سياقي", options: ["النار", "باردة", "جداً", "الشتاء"], correctAnswer: 1 },
    ],
  },
  // البنك السابع - المفردة الشاذة
  {
    id: "verbal-b7-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-7",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["واحد", "اثنان", "كبير", "ثلاثة"], correctAnswer: 2 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["سيارة", "طائرة", "قطار", "تلفون"], correctAnswer: 3 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["أب", "أم", "أخ", "صديق"], correctAnswer: 3 },
    ],
  },
  // البنك السابع - استيعاب المقروء
  {
    id: "verbal-b7-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-7",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "عنوان مناسب للنص:", audioPlaceholder: "نص قرائي", options: ["البيئة والإنسان", "الصحة والغذاء", "التعليم والعمل", "الرياضة والشباب"], correctAnswer: 0 },
      { id: "q2", prompt: "الهدف من ذكر الأرقام في النص:", audioPlaceholder: "نص قرائي", options: ["التأكيد", "التشويق", "التوضيح", "المقارنة"], correctAnswer: 0 },
      { id: "q3", prompt: "رأي الكاتب في المشكلة:", audioPlaceholder: "نص قرائي", options: ["سهلة الحل", "صعبة الحل", "مستحيلة", "غير مهمة"], correctAnswer: 1 },
    ],
  },
  // البنك الثامن - التناظر اللفظي
  {
    id: "verbal-b8-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات",
    category: "verbal-bank-8",
    difficulty: "beginner",
    type: "verbal",
    duration: "٦ دقائق",
    questions: [
      { id: "q1", prompt: "ليل : نهار :: شتاء : ؟", audioPlaceholder: "تناظر لفظي", options: ["برد", "صيف", "ربيع", "خريف"], correctAnswer: 1 },
      { id: "q2", prompt: "كلمة : جملة :: جملة : ؟", audioPlaceholder: "تناظر لفظي", options: ["كتاب", "فقرة", "نص", "حرف"], correctAnswer: 1 },
      { id: "q3", prompt: "بذرة : شجرة :: بيضة : ؟", audioPlaceholder: "تناظر لفظي", options: ["عش", "طائر", "دجاجة", "فرخ"], correctAnswer: 1 },
    ],
  },
  // البنك الثامن - إكمال الجمل
  {
    id: "verbal-b8-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة",
    category: "verbal-bank-8",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "من راقب الناس مات _____", audioPlaceholder: "إكمال جملة", options: ["حزيناً", "همّاً", "غمّاً", "وحيداً"], correctAnswer: 2 },
      { id: "q2", prompt: "الغني من استغنى بما _____ لا بما جمع", audioPlaceholder: "إكمال جملة", options: ["أخذ", "وجد", "ملك", "قنع"], correctAnswer: 1 },
      { id: "q3", prompt: "إنما الأمم الأخلاق ما _____ فإن هم ذهبت أخلاقهم ذهبوا", audioPlaceholder: "إكمال جملة", options: ["دامت", "بقيت", "استمرت", "وجدت"], correctAnswer: 1 },
    ],
  },
  // البنك الثامن - الخطأ السياقي
  {
    id: "verbal-b8-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق",
    category: "verbal-bank-8",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٧ دقائق",
    questions: [
      { id: "q1", prompt: "حدد الكلمة الخاطئة: الرسام يؤلف اللوحات الجميلة", audioPlaceholder: "خطأ سياقي", options: ["الرسام", "يؤلف", "اللوحات", "الجميلة"], correctAnswer: 1 },
      { id: "q2", prompt: "حدد الكلمة الخاطئة: السمك يطير في الماء بسرعة", audioPlaceholder: "خطأ سياقي", options: ["السمك", "يطير", "الماء", "بسرعة"], correctAnswer: 1 },
      { id: "q3", prompt: "حدد الكلمة الخاطئة: الطبيب يعلم الطلاب في الفصل", audioPlaceholder: "خطأ سياقي", options: ["الطبيب", "يعلم", "الطلاب", "الفصل"], correctAnswer: 0 },
    ],
  },
  // البنك الثامن - المفردة الشاذة
  {
    id: "verbal-b8-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة",
    category: "verbal-bank-8",
    difficulty: "beginner",
    type: "verbal",
    duration: "٥ دقائق",
    questions: [
      { id: "q1", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["فراولة", "تفاح", "بطاطس", "عنب"], correctAnswer: 2 },
      { id: "q2", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["نهر", "بحر", "جبل", "محيط"], correctAnswer: 2 },
      { id: "q3", prompt: "حدد المفردة الشاذة:", audioPlaceholder: "مفردة شاذة", options: ["قراءة", "كتابة", "سباحة", "حساب"], correctAnswer: 2 },
    ],
  },
  // البنك الثامن - استيعاب المقروء
  {
    id: "verbal-b8-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة",
    category: "verbal-bank-8",
    difficulty: "intermediate",
    type: "verbal",
    duration: "١٠ دقائق",
    questions: [
      { id: "q1", prompt: "الفكرة الرئيسية للفقرة الأولى:", audioPlaceholder: "نص قرائي", options: ["تعريف المشكلة", "حل المشكلة", "نتائج المشكلة", "أسباب المشكلة"], correctAnswer: 0 },
      { id: "q2", prompt: "كلمة 'ذلك' في السطر الخامس تشير إلى:", audioPlaceholder: "نص قرائي", options: ["الحل", "السبب", "المشكلة", "النتيجة"], correctAnswer: 2 },
      { id: "q3", prompt: "موقف الكاتب من القضية:", audioPlaceholder: "نص قرائي", options: ["إيجابي", "سلبي", "محايد", "متردد"], correctAnswer: 0 },
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
    // Each verbal bank has its own exercises
    if (category.startsWith("verbal-bank-")) {
      return exercises.filter(e => e.category === category);
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
