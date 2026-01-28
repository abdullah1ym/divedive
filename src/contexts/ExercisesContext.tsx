import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import bank1TanadhurData from "@/data/bank1_tanadhur_questions.json";
import bank1SentenceCompletionData from "@/data/bank1_sentence_completion_questions.json";
import bank1ContextualErrorData from "@/data/bank1_contextual_error_questions.json";
import bank1OddWordData from "@/data/bank1_odd_word_questions.json";
import bank1ReadingComprehensionData from "@/data/bank1_reading_comprehension_questions.json";
import bank2SentenceCompletionData from "@/data/bank2_sentence_completion_questions.json";
import bank2ContextualErrorData from "@/data/bank2_contextual_error_questions.json";
import bank2OddWordData from "@/data/bank2_odd_word_questions.json";
import bank2ReadingComprehensionData from "@/data/bank2_reading_comprehension_questions.json";

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

// Transform bank1 reading comprehension questions (flatten passages with questions)
const bank1ReadingComprehensionQuestions = (bank1ReadingComprehensionData as any).passages.flatMap((passage: any) =>
  passage.questions.map((q: any) => ({
    id: `bank1-rc-${q.id}`,
    prompt: q.prompt,
    audioPlaceholder: passage.title || "استيعاب المقروء",
    options: q.options.filter((opt: string) => opt !== ""),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || "",
    passageText: passage.text,
    passageTitle: passage.title || "القطعة",
  }))
);

// Transform bank2 sentence completion questions to match Question interface
const bank2SentenceCompletionQuestions = bank2SentenceCompletionData.questions.map((q: any) => ({
  id: `bank2-sc-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "إكمال جملة",
  options: q.options.filter((opt: string) => opt !== ""),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

// Transform bank2 contextual error questions to match Question interface
const bank2ContextualErrorQuestions = bank2ContextualErrorData.questions.map((q: any) => ({
  id: `bank2-ce-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "خطأ سياقي",
  options: q.options.filter((opt: string) => opt !== ""),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

// Transform bank2 odd word questions to match Question interface
const bank2OddWordQuestions = bank2OddWordData.questions.map((q: any) => ({
  id: `bank2-ow-${q.id}`,
  prompt: q.prompt,
  audioPlaceholder: "مفردة شاذة",
  options: q.options.filter((opt: string) => opt !== ""),
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
}));

// Transform bank2 reading comprehension questions (flatten passages with questions)
const bank2ReadingComprehensionQuestions = (bank2ReadingComprehensionData as any).passages.flatMap((passage: any) =>
  passage.questions.map((q: any) => ({
    id: `bank2-rc-${q.id}`,
    prompt: q.prompt,
    audioPlaceholder: passage.title || "استيعاب المقروء",
    options: q.options.filter((opt: string) => opt !== ""),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || "",
    passageText: passage.text,
    passageTitle: passage.title || "القطعة",
  }))
);

export interface Question {
  id: string;
  prompt: string;
  audioPlaceholder: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  passageText?: string;
  passageTitle?: string;
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
    duration: "٦٠ دقيقة",
    questions: bank1ReadingComprehensionQuestions,
  },
  // البنك الثاني - التناظر اللفظي
  {
    id: "verbal-b2-1",
    title: "التناظر اللفظي",
    description: "إيجاد العلاقة بين الكلمات - ١٤٩ سؤال",
    category: "verbal-bank-2",
    difficulty: "beginner",
    type: "verbal",
    duration: "٤٥ دقيقة",
    questions: [
        { id: "q1", prompt: "دعج : عين", audioPlaceholder: "تناظر لفظي", options: ["فظاظة : كلام", "فلج : أسنان", "سماجة : طبع", "برص : جسم"], correctAnswer: 1, explanation: "وصف ل - الدعج صفة للعين (سواد العين) كما أن الفلج صفة للأسنان (تباعدها)" },
        { id: "q2", prompt: "شجاعة : جبن", audioPlaceholder: "تناظر لفظي", options: ["اقدام : احجام", "تقدم : بطء", "استفحال : تأني", ""], correctAnswer: 0, explanation: "تضاد - الشجاعة عكس الجبن كما أن الإقدام عكس الإحجام" },
        { id: "q3", prompt: "نار : شرارة", audioPlaceholder: "تناظر لفظي", options: ["ذوبان : حرارة", "نجاح : إخفاق", "ماء : طين", "فرن : حطب"], correctAnswer: 0, explanation: "ناتج عن - النار تنتج عن الشرارة كما أن الذوبان ينتج عن الحرارة" },
        { id: "q4", prompt: "نور : مصباح", audioPlaceholder: "تناظر لفظي", options: ["شمس : ضياء", "صمت : هدوء", "ليل : ظلام", "صوت : مذياع"], correctAnswer: 3, explanation: "بواسطة - ناتج عن - النور ينتج بواسطة المصباح كما أن الصوت ينتج بواسطة المذياع" },
        { id: "q5", prompt: "قماش : ملابس", audioPlaceholder: "تناظر لفظي", options: ["زجاج : طاولة", "بيت : غرفة", "طائرة : قطار", "فحم : شواء"], correctAnswer: 0, explanation: "نصنع منه - يدخل في صناعة - القماش يُصنع منه الملابس كما أن الزجاج يدخل في صناعة الطاولة" },
        { id: "q6", prompt: "ثعبان : سم", audioPlaceholder: "تناظر لفظي", options: ["عقرب : موت", "وحيد القرن : ضخم", "خروف : صوف", "دودة القز : الحرير"], correctAnswer: 3, explanation: "ينتج - الثعبان ينتج السم كما أن دودة القز تنتج الحرير" },
        { id: "q7", prompt: "طائرة : طيّار", audioPlaceholder: "تناظر لفظي", options: ["فيلم : مخرج", "طريق : مشاة", "كلمة : شاعر", "كتاب : مؤلف"], correctAnswer: 0, explanation: "يقودها - الطيار يقود الطائرة كما أن المخرج يدير الفيلم" },
        { id: "q8", prompt: "غابة : أسد", audioPlaceholder: "تناظر لفظي", options: ["عش : عصفور", "سفينة : قبطان", "نهر : رمل", "طائرة : مسافر"], correctAnswer: 0, explanation: "مكان يعيش فيه - الأسد يعيش في الغابة كما أن العصفور يعيش في العش" },
        { id: "q9", prompt: "غابة : أسد", audioPlaceholder: "تناظر لفظي", options: ["عش : عصفور", "مطار : مسافر", "كون : إنسان", "إطارات : سيارة"], correctAnswer: 1, explanation: "مكان يوجد فيه - الأسد في الغابة كما أن المسافر في المطار" },
        { id: "q10", prompt: "متعرج : ممر", audioPlaceholder: "تناظر لفظي", options: ["معقد : تعبير", "نهر : مجرى", "مستقبل : ماضي", "تشاؤم : انكسار"], correctAnswer: 1, explanation: "وصف ل - المتعرج وصف للممر كما أن المجرى وصف للنهر" },
        { id: "q11", prompt: "خيار : طماطم", audioPlaceholder: "تناظر لفظي", options: ["سهم : سلاح", "سيف : رمح", "عطر : ورد", "كواكب : قمر"], correctAnswer: 1, explanation: "فئة - الخيار والطماطم من فئة الخضروات كما أن السيف والرمح من فئة الأسلحة" },
        { id: "q12", prompt: "لين : صلب", audioPlaceholder: "تناظر لفظي", options: ["لؤم : شهامة", "سهو : نسيان", "سهم : رمح", "عزاء : وفاة"], correctAnswer: 0, explanation: "تضاد - اللين عكس الصلب كما أن اللؤم عكس الشهامة" },
        { id: "q13", prompt: "نعمة : نقمة", audioPlaceholder: "تناظر لفظي", options: ["يقظة : رقاد", "أباد : أزال", "خوف : فزع", "رسالة : خطاب"], correctAnswer: 0, explanation: "تضاد - النعمة عكس النقمة كما أن اليقظة عكس الرقاد" },
        { id: "q14", prompt: "تصدع : انهيار", audioPlaceholder: "تناظر لفظي", options: ["إرهاق : تعب", "تسخين : غليان", "ظمأ : عطش", "ارتفاع : سقوط"], correctAnswer: 1, explanation: "ينتج عنه - التصدع يؤدي للانهيار كما أن التسخين يؤدي للغليان" },
        { id: "q15", prompt: "أرشيف : وثائق", audioPlaceholder: "تناظر لفظي", options: ["صيدلية : أدوية", "مكتبة : رفوف", "خزانة : أموال", "متحف : آثار"], correctAnswer: 0, explanation: "يستخدم لحفظ - الأرشيف يحفظ الوثائق كما أن الصيدلية تحفظ الأدوية" },
        { id: "q16", prompt: "سد : طاقة", audioPlaceholder: "تناظر لفظي", options: ["الجفاف : الصحراء", "رتيب : ملل", "قلم : إجادة", "الرزق : بكور"], correctAnswer: 1, explanation: "ينتج عنه - السد ينتج الطاقة كما أن الرتيب ينتج عنه الملل" },
        { id: "q17", prompt: "إهمال : رسوب", audioPlaceholder: "تناظر لفظي", options: ["رياضة : نشاط", "مذاكرة : نجاح", "تفريط : ندم", "جمية : صحة"], correctAnswer: 1, explanation: "يؤدي إلى - الإهمال يؤدي للرسوب كما أن المذاكرة تؤدي للنجاح" },
        { id: "q18", prompt: "مرسل : أوراق", audioPlaceholder: "تناظر لفظي", options: ["سفينة : بضاعة", "محرّك : سيارة", "أجنحة : طائرة", "وقود : قطار"], correctAnswer: 1, explanation: "ينقل - المرسل ينقل الأوراق كما أن المحرك يحرك السيارة" },
        { id: "q19", prompt: "مراسل : أوراق (رسالة)", audioPlaceholder: "تناظر لفظي", options: ["طائرة : مسافرون", "محرك : سيارة", "وقود : قطار", "جناح : طائرة"], correctAnswer: 1, explanation: "ينقل - المراسل ينقل الأوراق كما أن المحرك ينقل السيارة" },
        { id: "q20", prompt: "تداين : وفاء", audioPlaceholder: "تناظر لفظي", options: ["خلاف : اتفاق", "بيع : سماحة", "قسط : عدل", "تلف : تقتير"], correctAnswer: 1, explanation: "يحتاج إلى - التداين يحتاج للوفاء كما أن البيع يحتاج للسماحة" },
        { id: "q21", prompt: "قيلولة : نهار", audioPlaceholder: "تناظر لفظي", options: ["ماشية : رعى", "ظهر : فراش", "غذاء : نوم", "سحور : فجر"], correctAnswer: 3, explanation: "تكون في - القيلولة تكون في النهار كما أن السحور يكون في الفجر" },
        { id: "q22", prompt: "ضحى : نهار", audioPlaceholder: "تناظر لفظي", options: ["جناح : طير", "سواد : ليل", "دهر : شهر", "سنة : صيف"], correctAnswer: 0, explanation: "جزء من - الضحى جزء من النهار كما أن الجناح جزء من الطير" },
        { id: "q23", prompt: "خسوف : قمر", audioPlaceholder: "تناظر لفظي", options: ["مرض : حيوان", "سطوع : نجم", "كوكب : شمس", "اجتهاد : لعب"], correctAnswer: 0, explanation: "يصيب - الخسوف يصيب القمر كما أن المرض يصيب الحيوان" },
        { id: "q24", prompt: "قمر : خسوف", audioPlaceholder: "تناظر لفظي", options: ["ضياء : سطوع", "شمس : إحراق", "وردة : ذبول", "نجم : شهاب"], correctAnswer: 2, explanation: "يصاب بـ - القمر يصاب بالخسوف كما أن الوردة تصاب بالذبول" },
        { id: "q25", prompt: "علو : دنو", audioPlaceholder: "تناظر لفظي", options: ["تواضع : تكبر", "ارتفاع : صعود", "نزول : هبوط", "صبر : سخط"], correctAnswer: 0, explanation: "تضاد - العلو عكس الدنو كما أن التواضع عكس التكبر" },
        { id: "q26", prompt: "حوت : سمك", audioPlaceholder: "تناظر لفظي", options: ["ماء : قرش", "صيد : بحر", "عنب : شجر", "حيوان : أسد"], correctAnswer: 2, explanation: "فئة - الحوت من فئة السمك كما أن العنب من الشجر" },
        { id: "q27", prompt: "عسل : حلاوة", audioPlaceholder: "تناظر لفظي", options: ["مؤمن : فطن", "مرارة : حنظل", "سواد : كحل", "شفاف : زجاج"], correctAnswer: 0, explanation: "من صفاته - الحلاوة من صفات العسل كما أن الفطنة من صفات المؤمن" },
        { id: "q28", prompt: "نقاء : عسل", audioPlaceholder: "تناظر لفظي", options: ["فطنة : مؤمن", "مرارة : حنظل", "شفاف : زجاج", ""], correctAnswer: 1, explanation: "وصف ل - النقاء وصف للعسل كما أن المرارة وصف للحنظل" },
        { id: "q29", prompt: "موت : بعث", audioPlaceholder: "تناظر لفظي", options: ["ولادة : حمل", "شباب : شيخوخة", "شوال : رمضان", "علاج : مرض"], correctAnswer: 1, explanation: "بعده - الموت يأتي بعده البعث كما أن الشباب يأتي بعده الشيخوخة" },
        { id: "q30", prompt: "وثيقة : تخرج", audioPlaceholder: "تناظر لفظي", options: ["عقد : بيت", "شراء : بيع", "دين : رهن", "شهود : نكاح"], correctAnswer: 0, explanation: "دلالة على - تثبت - الوثيقة تدل على التخرج كما أن العقد يثبت البيت" },
        { id: "q31", prompt: "ولد : دلو", audioPlaceholder: "تناظر لفظي", options: ["بحر : رحب", "غنى : طغيان", "كسوف : خسوف", "ليمون : حمضيات"], correctAnswer: 1, explanation: "عكس الحروف - ولد عكسها دلو كما أن غنى عكسها طغيان" },
        { id: "q32", prompt: "راح : حار", audioPlaceholder: "تناظر لفظي", options: ["لمح : حمل", "سكن : كنس", "بحر : ريح", "ابتعاد : اقتراب"], correctAnswer: 1, explanation: "عكس الحروف - راح عكسها حار كما أن سكن عكسها كنس" },
        { id: "q33", prompt: "باع : عاب", audioPlaceholder: "تناظر لفظي", options: ["لحم : ملح", "مسح : حسم", "دار : در", "حضر : حاضر"], correctAnswer: 1, explanation: "عكس الحروف - باع عكسها عاب كما أن مسح عكسها حسم" },
        { id: "q34", prompt: "يُثبط : يشجّع", audioPlaceholder: "تناظر لفظي", options: ["يأمر : يحث", "يرسم : يلوّن", "يعتني : يهمل", "يستشير : يقرّر"], correctAnswer: 2, explanation: "تضاد - يثبط عكس يشجع كما أن يعتني عكس يهمل" },
        { id: "q35", prompt: "حشد : مشجعين", audioPlaceholder: "تناظر لفظي", options: ["تشجيع : مدربين", "تفريق : متسولين", "تحفيز : موظفين", "جذب : سائقين"], correctAnswer: 2, explanation: "يكون ل - الحشد يكون للمشجعين كما أن التحفيز يكون للموظفين" },
        { id: "q36", prompt: "استنفار : الجيش", audioPlaceholder: "تناظر لفظي", options: ["تشجيع : المدربين", "تحفيز : المعلمين", "حشد : الأفراد", "تفريق : لاعبين"], correctAnswer: 1, explanation: "يكون ل - الاستنفار يكون للجيش كما أن التحفيز يكون للمعلمين" },
        { id: "q37", prompt: "الكعبة : المطاف", audioPlaceholder: "تناظر لفظي", options: ["الورد : الحديقة", "الملتزم : الركن اليماني", "المقام : الحجر الأسود", "البيت : السور"], correctAnswer: 2, explanation: "يحيط بها - المطاف يحيط بالكعبة كما أن المقام قريب من الحجر الأسود" },
        { id: "q38", prompt: "الكعبة : المطاف", audioPlaceholder: "تناظر لفظي", options: ["السور : البيت", "البطن : الحزام", "الحديقة : الورد", "المقام : الحجر الأسود"], correctAnswer: 1, explanation: "يحيط بها - المطاف يحيط بالكعبة كما أن الحزام يحيط بالبطن" },
        { id: "q39", prompt: "استغفار : سيئات", audioPlaceholder: "تناظر لفظي", options: ["زهايمر : معلومات", "ذكريات : نسيان", "ماء : طهارة", "استحمام : منشفة"], correctAnswer: 0, explanation: "يمحو - يزيل - يقضي على - الاستغفار يمحو السيئات كما أن الزهايمر يمحو المعلومات" },
        { id: "q40", prompt: "استغفار : مغفرة", audioPlaceholder: "تناظر لفظي", options: ["تنظيف : تعقيم", "سعال : إلتهاب", "غروب : مساء", "نعاس : نوم"], correctAnswer: 1, explanation: "بعده - الاستغفار يؤدي للمغفرة كما أن السعال يدل على الالتهاب" },
        { id: "q41", prompt: "عطاس : حمد", audioPlaceholder: "تناظر لفظي", options: ["ذنب استغفار", "أكل : شبع", "مهندس : بناية", "فرح : سعيد"], correctAnswer: 1, explanation: "يحتاج إلى - العطاس يُتبع بالحمد كما أن الأكل يؤدي للشبع" },
        { id: "q42", prompt: "طائرة : سيارة", audioPlaceholder: "تناظر لفظي", options: ["دراجة : صاروخ", "شجاعة : جسارة", "الزهرة : الأرض", "القطار : العربة"], correctAnswer: 2, explanation: "فئة - الطائرة والسيارة وسائل نقل كما أن الزهرة والأرض كواكب" },
        { id: "q43", prompt: "مربع : مكعب", audioPlaceholder: "تناظر لفظي", options: ["دائرة : كرة", "مثلث : زاوية", "مستطيل : معين", "مخروط : اسطوانة"], correctAnswer: 0, explanation: "فئة - المربع ثنائي الأبعاد والمكعب ثلاثي كما أن الدائرة والكرة" },
        { id: "q44", prompt: "أرض : دائرة", audioPlaceholder: "تناظر لفظي", options: ["سيارة : مستطيل", "ناقة : مثلث", "فيل : معين", "طابعة : مجسم"], correctAnswer: 0, explanation: "تشبه في الشكل - الأرض تشبه الدائرة كما أن السيارة تشبه المستطيل" },
        { id: "q45", prompt: "مكعب : نرد", audioPlaceholder: "تناظر لفظي", options: ["دائرة : حلقة", "أفعى : حبل", "فل : ياسمين", ""], correctAnswer: 0, explanation: "من أشكاله - النرد شكله مكعب كما أن الحلقة شكلها دائرة" },
        { id: "q46", prompt: "سبات : حُلم (أحلام)", audioPlaceholder: "تناظر لفظي", options: ["سيطرة : قوة", "تاريخ : أحداث", "جغرافيا : مناخ", "نهار : سعي"], correctAnswer: 2, explanation: "يحدث فيه - الحلم يحدث في السبات كما أن المناخ يُدرس في الجغرافيا" },
        { id: "q47", prompt: "سبات : ليل", audioPlaceholder: "تناظر لفظي", options: ["عمل : نهار", "ضحى : نهار", "سحور : فجر", "طواف : إحرام"], correctAnswer: 0, explanation: "يحدث في - السبات يحدث في الليل كما أن العمل يحدث في النهار" },
        { id: "q48", prompt: "الزاد : الراحلة", audioPlaceholder: "تناظر لفظي", options: ["الحج : الجمرات", "مستشفى : مدينة", "إحرام : منى", "أسمنت : حديد"], correctAnswer: 3, explanation: "فئة - الزاد والراحلة من لوازم السفر كما أن الأسمنت والحديد من مواد البناء" },
        { id: "q49", prompt: "سوق : محل", audioPlaceholder: "تناظر لفظي", options: ["قواعد : كرسي", "نادي : لاعب", "مدرسة : مقصف", "باب : خشب"], correctAnswer: 1, explanation: "يوجد به - المحل يوجد في السوق كما أن اللاعب يوجد في النادي" },
        { id: "q50", prompt: "شظف : رخاء", audioPlaceholder: "تناظر لفظي", options: ["إذاعة : تلفاز", "بذل : عطاء", "بذور : جذور", "قسوة : لين"], correctAnswer: 3, explanation: "تضاد - الشظف (الضيق) عكس الرخاء كما أن القسوة عكس اللين" },
        { id: "q51", prompt: "إهمال : إخفاق", audioPlaceholder: "تناظر لفظي", options: ["تقدم : تراجع", "تسويف : تراكم", "تهاون : تكاسل", "تعاون : تكاتف"], correctAnswer: 1, explanation: "يؤدي إلى - الإهمال يؤدي للإخفاق كما أن التسويف يؤدي للتراكم" },
        { id: "q52", prompt: "الكفر : النار", audioPlaceholder: "تناظر لفظي", options: ["إيمان : سعادة", "رمضان : شوال", "إهمال : اخفاق", "نجاح : فرح"], correctAnswer: 2, explanation: "يؤدي إلى - الكفر يؤدي للنار كما أن الإهمال يؤدي للإخفاق" },
        { id: "q53", prompt: "حاجة : تدريب", audioPlaceholder: "تناظر لفظي", options: ["رغبة : إرادة", "قحط : استسقاء", "طبخ : جوع", "استزراع : تصحر"], correctAnswer: 1, explanation: "الحاجة تحتاج إلى تدريب - القحط يحتاج للاستسقاء" },
        { id: "q54", prompt: "الإحسان : الدين", audioPlaceholder: "تناظر لفظي", options: ["العطر : القنينة", "الفردوس : الجنة", "الرمال : الحرارة", "اللؤلؤ : الشبكة"], correctAnswer: 1, explanation: "أعلى مراتب - الإحسان أعلى مراتب الدين كما أن الفردوس أعلى الجنة" },
        { id: "q55", prompt: "الدين : الإحسان", audioPlaceholder: "تناظر لفظي", options: ["الجنة : الفردوس", "نخلة : عسل", "جبل : تسلق", "الصحة : الرياضة"], correctAnswer: 0, explanation: "أعلى مراتبه - الإحسان أعلى مراتب الدين كما أن الفردوس أعلى الجنة" },
        { id: "q56", prompt: "الإحسان : الدين", audioPlaceholder: "تناظر لفظي", options: ["العسل : النحل", "الفردوس : الجنة", "الصحة : الرياضة", "سيف سلاح"], correctAnswer: 1, explanation: "أعلى مراتب - الإحسان أعلى مراتب الدين كما أن الفردوس أعلى الجنة" },
        { id: "q57", prompt: "خيار : طماطم", audioPlaceholder: "تناظر لفظي", options: ["حبر : رصاص", "أواني قلادة", "سهم جعبة", "سيف سلاح"], correctAnswer: 1, explanation: "فئة - الخيار والطماطم من الخضروات كما أن الأواني والقلادة أدوات" },
        { id: "q58", prompt: "الإسلام : الصلاة", audioPlaceholder: "تناظر لفظي", options: ["طلاب : مدرسة", "طب : مستشفى", "أستاذ : جامعة", "اللغة : النحو"], correctAnswer: 2, explanation: "جزء منه - أهم أركانه - الصلاة ركن من الإسلام كما أن الأستاذ جزء من الجامعة" },
        { id: "q59", prompt: "حكيم : عاقل", audioPlaceholder: "تناظر لفظي", options: ["صبور : حليم", "هادئ : مرتاح", "قوي : متين", "نشيط : حريص"], correctAnswer: 0, explanation: "من صفاته - الحكيم من صفاته أنه عاقل كما أن الصبور من صفاته الحلم" },
        { id: "q60", prompt: "ظمأ : ماء", audioPlaceholder: "تناظر لفظي", options: ["عزاء : مواساة", "قيادة : رخصة", "جهل : عِلم", "أكل : شبع"], correctAnswer: 1, explanation: "يحتاج إلى - الظمأ يحتاج للماء كما أن القيادة تحتاج لرخصة" },
        { id: "q61", prompt: "ظمأ : شرب", audioPlaceholder: "تناظر لفظي", options: ["أبيض : أسود", "ليل : نهار", "أكل : شبع", "جوع : طعام"], correctAnswer: 1, explanation: "يزال بـ - الظمأ يزال بالشرب كما أن الليل يعقبه النهار" },
        { id: "q62", prompt: "إنفاق : تقتير", audioPlaceholder: "تناظر لفظي", options: ["محو : إزالة", "نُهى : حمق", "مساواة : عدل", "إلزام : فرصة"], correctAnswer: 1, explanation: "تضاد - الإنفاق عكس التقتير كما أن النُهى عكس الحمق" },
        { id: "q63", prompt: "حصى : صخور", audioPlaceholder: "تناظر لفظي", options: ["نبتة : شجرة", "نهر : وادي", "طين : تراب", "بحر : مالح"], correctAnswer: 0, explanation: "تكون - الصخور أصلها حصى - الطين من التراب" },
        { id: "q64", prompt: "حصى : صخور", audioPlaceholder: "تناظر لفظي", options: ["مونومرات : بوليمرات", "طين : تراب", "نهر : وادي", ""], correctAnswer: 0, explanation: "تكون - الحصى تتكون منه الصخور كما أن المونومرات تتكون منها البوليمرات" },
        { id: "q65", prompt: "جبال : تلال", audioPlaceholder: "تناظر لفظي", options: ["أسد : شبل", "جداول : أنهار", "شجرة : نخلة", "الحشرات : نملة"], correctAnswer: 1, explanation: "فئة - أكبر من - الجبال أكبر من التلال كما أن الأنهار أكبر من الجداول" },
        { id: "q66", prompt: "الجبال : التلال", audioPlaceholder: "تناظر لفظي", options: ["أسود : أشبال", "الشجرة : النخلة", "الجداول : الأنهار", "الحشرات : نملة"], correctAnswer: 1, explanation: "فئة - الجبال والتلال من التضاريس كما أن الشجرة والنخلة من النباتات" },
        { id: "q67", prompt: "سمك : بحر", audioPlaceholder: "تناظر لفظي", options: ["بشر : يابسة", "ضب : صحراء", "بطريق : ثلج", "بيت : إنسان"], correctAnswer: 1, explanation: "يعيش في - السمك يعيش في البحر كما أن الضب يعيش في الصحراء" },
        { id: "q68", prompt: "بحر : سمك", audioPlaceholder: "تناظر لفظي", options: ["غابة : أشجار", "حديقة : زهرة", "صحراء : جمال", "سماء : نجم"], correctAnswer: 0, explanation: "يوجد به - السمك يوجد في البحر كما أن الأشجار توجد في الغابة" },
        { id: "q69", prompt: "أعلى : أسفل", audioPlaceholder: "تناظر لفظي", options: ["أخضر : أحمر", "أظهر : أخفى", "شمال : شرق", "جديد : متسخ"], correctAnswer: 1, explanation: "تضاد - أعلى عكس أسفل كما أن أظهر عكس أخفى" },
        { id: "q70", prompt: "صدر : قلب", audioPlaceholder: "تناظر لفظي", options: ["عروق : دم", "علم : ممارسة", "بكاء : دموع", "سفر : طائرة"], correctAnswer: 0, explanation: "بداخله - القلب داخل الصدر كما أن الدم داخل العروق" },
        { id: "q71", prompt: "قلب : صدر", audioPlaceholder: "تناظر لفظي", options: ["كعبة : حرم", "حقيبة : كتاب", "", ""], correctAnswer: 0, explanation: "بداخل - القلب داخل الصدر كما أن الكعبة داخل الحرم" },
        { id: "q72", prompt: "إنسان : قلب", audioPlaceholder: "تناظر لفظي", options: ["مصنع : عمال", "", "", ""], correctAnswer: 0, explanation: "بداخله - القلب داخل الإنسان كما أن العمال داخل المصنع" },
        { id: "q73", prompt: "ريح : عاصف", audioPlaceholder: "تناظر لفظي", options: ["حرب : ضروس", "بكاء : نشيج", "نيزك : كوكب", "صحراء : ناقة"], correctAnswer: 0, explanation: "صفتها - الريح العاصف كما أن الحرب الضروس" },
        { id: "q74", prompt: "حرب : ضروس", audioPlaceholder: "تناظر لفظي", options: ["جبل : شاهق", "بكاء : نشيج", "فل : ياسمين", "صحراء : ناقة"], correctAnswer: 0, explanation: "صفتها - الحرب ضروس كما أن الجبل شاهق" },
        { id: "q75", prompt: "جبل : شاهق", audioPlaceholder: "تناظر لفظي", options: ["حرب : ضروس", "بكاء : نشيج", "فل : ياسمين", ""], correctAnswer: 0, explanation: "صفته - الجبل شاهق كما أن الحرب ضروس" },
        { id: "q76", prompt: "كدر : صفاء", audioPlaceholder: "تناظر لفظي", options: ["إخلاص : شك", "ضجر : ضيق", "لقاء : فراق", "تجلى : تباين"], correctAnswer: 2, explanation: "تضاد - الكدر عكس الصفاء كما أن اللقاء عكس الفراق" },
        { id: "q77", prompt: "كدر : صفو (صفاء)", audioPlaceholder: "تناظر لفظي", options: ["صحو : غائم", "صافي : نقي", "ماء : طين", "نظيف : طاهر"], correctAnswer: 0, explanation: "تضاد - الكدر عكس الصفو كما أن الصحو عكس الغائم" },
        { id: "q78", prompt: "سراج المؤمنين : الهدى", audioPlaceholder: "تناظر لفظي", options: ["سراج البيت : الدابة المطيعة", "السراج الكاشف : شاحب الوجه", "سراج النهار : الشمس المضيئة", "السراج الوهاج : النجم الصغير"], correctAnswer: 2, explanation: "هو تعبير مجازي، المعنى الحقيقي له - سراج المؤمنين هو الهدى كما أن سراج النهار هو الشمس المضيئة" },
        { id: "q79", prompt: "حراشف : سمك", audioPlaceholder: "تناظر لفظي", options: ["ريش : طير", "أنف : إنسان", "غواصة : ماء", "طائر : منقار"], correctAnswer: 0, explanation: "تغطي - الحراشف تغطي السمك كما أن الريش يغطي الطير" },
        { id: "q80", prompt: "خياشيم : سمك", audioPlaceholder: "تناظر لفظي", options: ["طير : ريش", "أنف : إنسان", "غواصة : ماء", "طائر : منقار"], correctAnswer: 1, explanation: "جزء من - عضو التنفس - الخياشيم عضو تنفس السمك كما أن الأنف عضو تنفس الإنسان" },
        { id: "q81", prompt: "توبة : معفرة", audioPlaceholder: "تناظر لفظي", options: ["كرم : جود", "رحمة : عفو", "ذهب : ميزان", ""], correctAnswer: 1, explanation: "تؤدي إلى - التوبة تؤدي للمغفرة كما أن الرحمة تؤدي للعفو" },
        { id: "q82", prompt: "خور : بسالة", audioPlaceholder: "تناظر لفظي", options: ["غريم : خصم", "كبح : تردد", "زهو : تواضع", "تعويم : تفويض"], correctAnswer: 2, explanation: "تضاد - الخور (الضعف) عكس البسالة كما أن الزهو عكس التواضع" },
        { id: "q83", prompt: "خور : بسالة", audioPlaceholder: "تناظر لفظي", options: ["سلام : حرب", "", "", ""], correctAnswer: 0, explanation: "تضاد - الخور عكس البسالة كما أن السلام عكس الحرب" },
        { id: "q84", prompt: "رياض : فلاة", audioPlaceholder: "تناظر لفظي", options: ["نهب : سرقة", "إظهار : إخفاء", "اجتهاد : نجاح", "بخل : شح"], correctAnswer: 1, explanation: "تضاد - الرياض (الخضرة) عكس الفلاة (الصحراء) كما أن الإظهار عكس الإخفاء" },
        { id: "q85", prompt: "بيت : سور", audioPlaceholder: "تناظر لفظي", options: ["مضمار : حصان", "شجرة : ثمرة", "عنق : عقد", "خيمة : عمود"], correctAnswer: 1, explanation: "يحيط به - السور يحيط بالبيت كما أن الثمرة على الشجرة" },
        { id: "q86", prompt: "أنف : تنفس", audioPlaceholder: "تناظر لفظي", options: ["بصر : عين", "مشي : قدم", "لسان : ذوق", "معدة : طعام"], correctAnswer: 2, explanation: "وظيفته - وظيفة الأنف التنفس كما أن وظيفة اللسان الذوق" },
        { id: "q87", prompt: "مجهر : عدسة", audioPlaceholder: "تناظر لفظي", options: ["ساعة : عقرب", "كتاب : صفحة", "سيف : غمد", "محرك : تروس"], correctAnswer: 1, explanation: "يوجد به - العدسة جزء من المجهر كما أن الصفحة جزء من الكتاب" },
        { id: "q88", prompt: "كتابة : يد", audioPlaceholder: "تناظر لفظي", options: ["رجل : مشي", "عقل : تكفير", "لسان : تذوق", "بصر : عين"], correctAnswer: 1, explanation: "بواسطة - الكتابة بواسطة اليد كما أن التفكير بواسطة العقل" },
        { id: "q89", prompt: "تفكير : استنباط", audioPlaceholder: "تناظر لفظي", options: ["ملاحظة : تحليل", "تحفيظ : تلقين", "استرجاع : تذكر", "اهداف : تحقيق"], correctAnswer: 2, explanation: "ينتج عنه - التفكير ينتج عنه الاستنباط كما أن الاسترجاع ينتج عنه التذكر" },
        { id: "q90", prompt: "ملاحظة : تحليل", audioPlaceholder: "تناظر لفظي", options: ["تحفيظ : تلقين", "بحث : اكتشاف", "أهداف : تحقيق", "نضج : خبرة"], correctAnswer: 1, explanation: "ينتج عنه - الملاحظة تؤدي للتحليل كما أن البحث يؤدي للاكتشاف" },
        { id: "q91", prompt: "حفظ : تلقين", audioPlaceholder: "تناظر لفظي", options: ["بحث : اكتشاف", "نضج : خبرة", "أهداف : تحقيق", "تأخر : انتظار"], correctAnswer: 1, explanation: "ناتج عن - الحفظ ناتج عن التلقين كما أن النضج ينتج عنه الخبرة" },
        { id: "q92", prompt: "مرض : وقاية", audioPlaceholder: "تناظر لفظي", options: ["لوحة : تحذير", "نظام : تشتت", "حفرة : سياج", "أسد ضرغام"], correctAnswer: 2, explanation: "يحتاج إلى - نحتمي منه بواسطة - المرض نحتمي منه بالوقاية كما أن الحفرة نحتمي منها بالسياج" },
        { id: "q93", prompt: "ثريا : قبة", audioPlaceholder: "تناظر لفظي", options: ["حجر : أبيض", "باب : شباك", "كرة : ملعب", "بركان : حمم"], correctAnswer: 1, explanation: "بداخل - الثريا داخل القبة كما أن الباب والشباك في المبنى" },
        { id: "q94", prompt: "مفاعل نووي : إشعاع", audioPlaceholder: "تناظر لفظي", options: ["بطارية : كهرباء", "مصنع : تلوث", "بركان : حمم", "مصباح : ضوء"], correctAnswer: 1, explanation: "ينتج عنه - المفاعل النووي ينتج إشعاع كما أن المصنع ينتج تلوث" },
        { id: "q95", prompt: "طلاق : زوج", audioPlaceholder: "تناظر لفظي", options: ["شفاء : طبيب", "نجاح : معلم", "حكم : قاضي", "غنى : صدقة"], correctAnswer: 2, explanation: "بواسطة - الطلاق يكون من الزوج كما أن الحكم يكون من القاضي" },
        { id: "q96", prompt: "شروق : غروب", audioPlaceholder: "تناظر لفظي", options: ["عهد : وعد", "زمن : وقت", "احجاف : جور", "نهم : قنوع"], correctAnswer: 3, explanation: "تضاد - الشروق عكس الغروب كما أن النهم عكس القنوع" },
        { id: "q97", prompt: "شروق : غروب", audioPlaceholder: "تناظر لفظي", options: ["السراج : الظلام", "الظهر : المغرب", "ساعة : وقت", "ضياء : نور"], correctAnswer: 1, explanation: "فئة - بعده - الشروق يسبق الغروب كما أن الظهر يسبق المغرب" },
        { id: "q98", prompt: "قافية : بيت", audioPlaceholder: "تناظر لفظي", options: ["بداية : نهاية", "خاتمة : قصة", "ذيل : طائرة", "بداية : نهاية"], correctAnswer: 1, explanation: "في نهاية - القافية في نهاية البيت كما أن الخاتمة في نهاية القصة" },
        { id: "q99", prompt: "قافية : بيت", audioPlaceholder: "تناظر لفظي", options: ["قصة : خاتمة", "طفولة : هرم", "ذيل : طائرة", "بداية : نهاية"], correctAnswer: 1, explanation: "في نهاية - القافية في نهاية البيت الشعري كما أن الهرم في نهاية الطفولة" },
        { id: "q100", prompt: "شاعر : قصيدة", audioPlaceholder: "تناظر لفظي", options: ["صحفي : خبر", "رسام : رواية", "كاتب : تحقيق", "رواية : كاتب"], correctAnswer: 0, explanation: "يقوم بكتابة - الشاعر يكتب القصيدة كما أن الصحفي يكتب الخبر" },
        { id: "q101", prompt: "فحم : وقود", audioPlaceholder: "تناظر لفظي", options: ["دواء : علاج", "قمح : غذاء", "غاز : نار", "فاكهة : برتقال"], correctAnswer: 1, explanation: "من أنواع - الفحم من أنواع الوقود كما أن القمح من أنواع الغذاء" },
        { id: "q102", prompt: "ليل : حالك", audioPlaceholder: "تناظر لفظي", options: ["حصان : أبيض", "شعر : أشقر", "شفة : لمياء", "عيون : حولاء"], correctAnswer: 2, explanation: "صفته - الليل الحالك كما أن الشفة اللمياء (سوداء)" },
        { id: "q103", prompt: "بندقية : رصاص", audioPlaceholder: "تناظر لفظي", options: ["مدينة : دولة", "واحة : نخلة", "سيارة : طيارة", "مستشفى : جامعة"], correctAnswer: 1, explanation: "يوجد بها - الرصاص في البندقية كما أن النخلة في الواحة" },
        { id: "q104", prompt: "رصاص : مسدس", audioPlaceholder: "تناظر لفظي", options: ["نخلة : واحة", "", "", ""], correctAnswer: 0, explanation: "يوجد في - الرصاص في المسدس كما أن النخلة في الواحة" },
        { id: "q105", prompt: "الجدي : السنبلة", audioPlaceholder: "تناظر لفظي", options: ["شعبان : رمضان", "الوسم : المطر", "شبل : أسد", "ابتسامة : ضحكة"], correctAnswer: 0, explanation: "فئة - الجدي والسنبلة من الأبراج كما أن شعبان ورمضان من الأشهر" },
        { id: "q106", prompt: "مذياع : صوت", audioPlaceholder: "تناظر لفظي", options: ["سحاب : برق", "صورة : تلفاز", "شبل : أسد", ""], correctAnswer: 1, explanation: "يصدر - المذياع يصدر الصوت كما أن التلفاز يعرض الصورة" },
        { id: "q107", prompt: "برق : سحاب", audioPlaceholder: "تناظر لفظي", options: ["صوت : مذياع", "شمس : شعاع", "طفل : كهل", ""], correctAnswer: 1, explanation: "ناتج عن - البرق من السحاب كما أن الشعاع من الشمس" },
        { id: "q108", prompt: "عمل : نهار", audioPlaceholder: "تناظر لفظي", options: ["صوم : رمضان", "شوال : شعبان", "طفل : كهل", ""], correctAnswer: 0, explanation: "يكون في - العمل يكون في النهار كما أن الصوم يكون في رمضان" },
        { id: "q109", prompt: "توق : حنين", audioPlaceholder: "تناظر لفظي", options: ["غنى : ثروة", "نقيصة : فضيلة", "نهار : معاش", ""], correctAnswer: 1, explanation: "تضاد - التوق ينتج عنه الحنين كما أن النقيصة عكس الفضيلة" },
        { id: "q110", prompt: "الخميس : السبت", audioPlaceholder: "تناظر لفظي", options: ["ستة : ثمانية", "شوال : شعبان", "طفل : كهل", ""], correctAnswer: 1, explanation: "بعده - السبت بعد الخميس كما أن شوال بعد شعبان" },
        { id: "q111", prompt: "ينظر : يحدق", audioPlaceholder: "تناظر لفظي", options: ["يركض : يلهث", "يحذر : ينتبه", "يحبو : يمشي", "يقف : يصعد"], correctAnswer: 1, explanation: "ثم - تدرج - النظر ثم التحديق كما أن التحذير ثم الانتباه" },
        { id: "q112", prompt: "مستشفى : جناح", audioPlaceholder: "تناظر لفظي", options: ["أرض : جبال", "بنك : نقود", "", ""], correctAnswer: 0, explanation: "جزء منها - الجناح جزء من المستشفى كما أن الجبال جزء من الأرض" },
        { id: "q113", prompt: "ذل : عز", audioPlaceholder: "تناظر لفظي", options: ["كآبة : سرور", "", "", ""], correctAnswer: 0, explanation: "تضاد - الذل عكس العز كما أن الكآبة عكس السرور" },
        { id: "q114", prompt: "غضب : حلم", audioPlaceholder: "تناظر لفظي", options: ["قتل : سجن", "جوع : شبع", "لعب : نوم", "دراسة : إجازة"], correctAnswer: 1, explanation: "تضاد - الغضب عكس الحلم كما أن الجوع عكس الشبع" },
        { id: "q115", prompt: "حقيبة : طالب", audioPlaceholder: "تناظر لفظي", options: ["بحر : سفينة", "مسطرة : قلم", "صفحة : كتاب", "بضائع : قطار"], correctAnswer: 1, explanation: "يحملها - الطالب يحمل الحقيبة كما أن القلم بجانب المسطرة" },
        { id: "q116", prompt: "تباين : تجانس", audioPlaceholder: "تناظر لفظي", options: ["اغواء : إرشاد", "إيفاد : إخلاص", "إيهام : إطراء", ""], correctAnswer: 0, explanation: "تضاد - التباين عكس التجانس كما أن الإغواء عكس الإرشاد" },
        { id: "q117", prompt: "ضفدع : نقيق", audioPlaceholder: "تناظر لفظي", options: ["ذئب : عواء", "نسر : ثغاء", "صهيل : حصان", ""], correctAnswer: 0, explanation: "صوته - صوت الضفدع النقيق كما أن صوت الذئب العواء" },
        { id: "q118", prompt: "ضفدع : نقيق", audioPlaceholder: "تناظر لفظي", options: ["نحلة : طنين", "أسد : عويل", "ماء : هدير", "ضفدع : نعيق"], correctAnswer: 0, explanation: "صوته - صوت الضفدع النقيق كما أن صوت النحلة الطنين" },
        { id: "q119", prompt: "ماعز : ثغاء", audioPlaceholder: "تناظر لفظي", options: ["بعير : هدير", "خفاش : نقيق", "أفعى : حفيف", "ضفدع : نعيق"], correctAnswer: 2, explanation: "صوته - صوت الماعز الثغاء كما أن صوت الأفعى الحفيف" },
        { id: "q120", prompt: "نجاح : فرح", audioPlaceholder: "تناظر لفظي", options: ["زراعة : حصاد", "حلم : جرأة", "كرم : غنى", "فقر : بخل"], correctAnswer: 0, explanation: "ينتج عنه - النجاح ينتج عنه الفرح كما أن الزراعة ينتج عنها الحصاد" },
        { id: "q121", prompt: "نجاح : اجتهاد", audioPlaceholder: "تناظر لفظي", options: ["عجين : خبز", "تهور : سرعة", "إهمال : إصابة", "شفاء : دواء"], correctAnswer: 1, explanation: "ناتج عن - يحتاج إلى - النجاح يحتاج للاجتهاد كما أن التهور ينتج عن السرعة" },
        { id: "q122", prompt: "نجاح : بهجة", audioPlaceholder: "تناظر لفظي", options: ["تنظيم : انجاز", "", "", ""], correctAnswer: 0, explanation: "ينتج عنه - النجاح ينتج عنه البهجة كما أن التنظيم ينتج عنه الإنجاز" },
        { id: "q123", prompt: "نجاح : اجتهاد", audioPlaceholder: "تناظر لفظي", options: ["سيارة : بنزين", "استهتار : حادث", "إهمال : رسوب", "مريض : مستشفى"], correctAnswer: 0, explanation: "يحتاج إلى - النجاح يحتاج للاجتهاد كما أن السيارة تحتاج للبنزين" },
        { id: "q124", prompt: "اجتهاد : نجاح", audioPlaceholder: "تناظر لفظي", options: ["عجين : خبز", "كذب : إفك", "رياضة : قوة", "موقف : سيارة"], correctAnswer: 1, explanation: "ينتج عنه - الاجتهاد ينتج عنه النجاح كما أن الكذب نوع من الإفك" },
        { id: "q125", prompt: "طائرة : مدرج", audioPlaceholder: "تناظر لفظي", options: ["سفن : مرسى", "دواء : صيدلية", "موقف : سيارة", ""], correctAnswer: 1, explanation: "على - الطائرة على المدرج كما أن الدواء في الصيدلية" },
        { id: "q126", prompt: "وريد : دم", audioPlaceholder: "تناظر لفظي", options: ["رأس : مُخ", "سلك : كهرباء", "", ""], correctAnswer: 1, explanation: "يوجد بداخله - الدم في الوريد كما أن الكهرباء في السلك" },
        { id: "q127", prompt: "وريد : دم", audioPlaceholder: "تناظر لفظي", options: ["رأس : مُخ", "سلك : كهرباء", "", ""], correctAnswer: 1, explanation: "يجري فيه - الدم يجري في الوريد كما أن الكهرباء تجري في السلك" },
        { id: "q128", prompt: "وريد : دم", audioPlaceholder: "تناظر لفظي", options: ["بحر : سمك", "", "", ""], correctAnswer: 0, explanation: "يوجد به - الدم في الوريد كما أن السمك في البحر" },
        { id: "q129", prompt: "قائد : جنود", audioPlaceholder: "تناظر لفظي", options: ["ممثلون : مخرج", "مدير : موظفون", "", ""], correctAnswer: 1, explanation: "يرأس - يقود - القائد يقود الجنود كما أن المدير يقود الموظفين" },
        { id: "q130", prompt: "شارع : مدينة", audioPlaceholder: "تناظر لفظي", options: ["شجرة : غابة", "سيارات : معرض", "مسجد : مئذنة", ""], correctAnswer: 0, explanation: "يوجد في - الشارع في المدينة كما أن الشجرة في الغابة" },
        { id: "q131", prompt: "نهر : غابة", audioPlaceholder: "تناظر لفظي", options: ["كهرباء : سلك", "ازدحام : ملعب", "سيارات : معرض", "مسجد : مئذنة"], correctAnswer: 0, explanation: "يجري فيه - النهر يجري في الغابة كما أن الكهرباء تجري في السلك" },
        { id: "q132", prompt: "نزاع : تراضي", audioPlaceholder: "تناظر لفظي", options: ["نشاط : خمول", "كسل : نجاح", "ظل : شجرة", ""], correctAnswer: 0, explanation: "تضاد - النزاع عكس التراضي كما أن النشاط عكس الخمول" },
        { id: "q133", prompt: "حائك : خياطة", audioPlaceholder: "تناظر لفظي", options: ["قاضي : محكمة", "صائغ : ذهب", "تربية : معلم", "فنان : رسم"], correctAnswer: 1, explanation: "وظيفته - الحائك وظيفته الخياطة كما أن الصائغ يعمل بالذهب" },
        { id: "q134", prompt: "قطع : سكين", audioPlaceholder: "تناظر لفظي", options: ["تقليم : قص", "لؤلؤ : شبكة", "آلة : إيقاع", "نقد : أديب"], correctAnswer: 2, explanation: "وظيفة - بواسطة - القطع بالسكين كما أن الإيقاع بالآلة" },
        { id: "q135", prompt: "سكين : قطع", audioPlaceholder: "تناظر لفظي", options: ["سيف : بتر", "كهرباء : إضاءة", "", ""], correctAnswer: 1, explanation: "يستخدم لـ - السكين للقطع كما أن الكهرباء للإضاءة" },
        { id: "q136", prompt: "سكين : قطع", audioPlaceholder: "تناظر لفظي", options: ["بتر : سيف", "كهرباء : إضاءة", "", ""], correctAnswer: 1, explanation: "يستخدم لـ - السكين للقطع كما أن الكهرباء للإضاءة" },
        { id: "q137", prompt: "سكينة : قطع", audioPlaceholder: "تناظر لفظي", options: ["قلم : كتابة", "", "", ""], correctAnswer: 0, explanation: "تستخدم لـ - السكينة للقطع كما أن القلم للكتابة" },
        { id: "q138", prompt: "سكين : قطع", audioPlaceholder: "تناظر لفظي", options: ["تقليم : قص", "سوط : جلد", "سكين : شحذ", ""], correctAnswer: 1, explanation: "تستخدم لـ - السكين للقطع كما أن السوط للجلد" },
        { id: "q139", prompt: "نظارات : عين", audioPlaceholder: "تناظر لفظي", options: ["مسن : سكين", "نافذة : قمر", "طالب : معلم", "فصل : كتاب"], correctAnswer: 1, explanation: "تحسّن عمل - النظارات تحسن عمل العين كما أن النافذة تُظهر القمر" },
        { id: "q140", prompt: "البر : صلة الرحم", audioPlaceholder: "تناظر لفظي", options: ["قتال : مبارزة", "إصلاح : إحسان", "اجتهاد : علم", "بخل : شح"], correctAnswer: 1, explanation: "من أنواعه - صلة الرحم من أنواع البر كما أن الإصلاح من الإحسان" },
        { id: "q141", prompt: "بر : صلة الرحم", audioPlaceholder: "تناظر لفظي", options: ["الاجتهاد : العلم", "القتال : المبارزة", "سحاب : نجوم", "بخل : شح"], correctAnswer: 1, explanation: "من أنواعه - صلة الرحم من البر كما أن القتال نوع من المبارزة" },
        { id: "q142", prompt: "سنام : جمل", audioPlaceholder: "تناظر لفظي", options: ["شعر : رأس", "ساق : ركبة", "لحية : وجه", "صلاة : عبادة"], correctAnswer: 0, explanation: "أعلى - السنام أعلى الجمل كما أن الشعر أعلى الرأس" },
        { id: "q143", prompt: "خيل : سرج", audioPlaceholder: "تناظر لفظي", options: ["حمار : بردعة", "جمل : سنام", "", ""], correctAnswer: 0, explanation: "نضع على ظهره - السرج على الخيل كما أن البردعة على الحمار" },
        { id: "q144", prompt: "عبادة : سعادة", audioPlaceholder: "تناظر لفظي", options: ["مطار : تذكرة", "المال : سرور", "طائرة : سفر", "رياضة : صحة"], correctAnswer: 1, explanation: "ينتج عنها - العبادة تنتج السعادة كما أن المال ينتج السرور" },
        { id: "q145", prompt: "مال : رفاهية", audioPlaceholder: "تناظر لفظي", options: ["سيف : شجاعة", "بئر : مياه", "عبادة : سعادة", "طاحونة : حبوب"], correctAnswer: 2, explanation: "ينتج عنه - المال ينتج الرفاهية كما أن العبادة تنتج السعادة" },
        { id: "q146", prompt: "رياضة : صحة", audioPlaceholder: "تناظر لفظي", options: ["عبادة : جنة", "ثواب : صيام", "", ""], correctAnswer: 0, explanation: "ينتج عنها - الرياضة تنتج الصحة كما أن العبادة تؤدي للجنة" },
        { id: "q147", prompt: "قهوة : بن", audioPlaceholder: "تناظر لفظي", options: ["علم : معلومات", "خبز : مخبز", "عمل : كسل", "طلاب : صف"], correctAnswer: 1, explanation: "أصلها - القهوة أصلها البن كما أن الخبز من المخبز" },
        { id: "q148", prompt: "شاحنة : نقل", audioPlaceholder: "تناظر لفظي", options: ["شبكة : صيد", "سيارة : سائق", "", ""], correctAnswer: 0, explanation: "تستخدم لـ - الشاحنة للنقل كما أن الشبكة للصيد" },
        { id: "q149", prompt: "نبتة : سقي", audioPlaceholder: "تناظر لفظي", options: ["شباب : صحبة", "روح : تقوى", "فضاء : تحليق", "سعادة : نفس"], correctAnswer: 1, explanation: "تحتاج إلى - النبتة تحتاج للسقي كما أن الروح تحتاج للتقوى" }
      ],
  },
  // البنك الثاني - إكمال الجمل (101 سؤال)
  {
    id: "verbal-b2-2",
    title: "إكمال الجمل",
    description: "اختيار الكلمة المناسبة لإكمال الجملة - ١٠١ سؤال",
    category: "verbal-bank-2",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٣٠ دقيقة",
    questions: bank2SentenceCompletionQuestions,
  },
  // البنك الثاني - الخطأ السياقي (100 سؤال)
  {
    id: "verbal-b2-3",
    title: "الخطأ السياقي",
    description: "تحديد الكلمة الخاطئة في السياق - ١٠٠ سؤال",
    category: "verbal-bank-2",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٣٠ دقيقة",
    questions: bank2ContextualErrorQuestions,
  },
  // البنك الثاني - المفردة الشاذة (100 سؤال من الملف المحلول)
  {
    id: "verbal-b2-4",
    title: "المفردة الشاذة",
    description: "تحديد الكلمة التي لا تنتمي للمجموعة - ١٠٠ سؤال",
    category: "verbal-bank-2",
    difficulty: "beginner",
    type: "verbal",
    duration: "٤٥ دقيقة",
    questions: bank2OddWordQuestions,
  },
  // البنك الثاني - استيعاب المقروء (93 قطعة)
  {
    id: "verbal-b2-5",
    title: "استيعاب المقروء",
    description: "قراءة النصوص والإجابة على الأسئلة - ٩٣ قطعة",
    category: "verbal-bank-2",
    difficulty: "intermediate",
    type: "verbal",
    duration: "٦٠ دقيقة",
    questions: bank2ReadingComprehensionQuestions,
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
