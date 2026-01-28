import { motion } from "framer-motion";
import { Play, Info, Brain, Clock, Library, Pin, Lock } from "lucide-react";
import { useExercises, Exercise } from "@/contexts/ExercisesContext";
import { useState, useEffect } from "react";

// Locked banks (3-8) for non-pro users
const lockedBanks = ["verbal-bank-3", "verbal-bank-4", "verbal-bank-5", "verbal-bank-6", "verbal-bank-7", "verbal-bank-8"];

// Progress tracking for exercises (from CollectionView)
const COLLECTION_PROGRESS_KEY = "divedive-collection-progress";

interface ExerciseProgress {
  [exerciseId: string]: {
    answeredQuestions: number;
    totalQuestions: number;
  };
}

// Get progress from CollectionView format
const getAllProgress = (): ExerciseProgress => {
  try {
    const stored = localStorage.getItem(COLLECTION_PROGRESS_KEY);
    const collectionProgress = stored ? JSON.parse(stored) : {};
    const result: ExerciseProgress = {};

    // Convert collection progress format to exercise progress format
    for (const [key, value] of Object.entries(collectionProgress)) {
      const progress = value as { answers?: Record<string, number | null>; submitted?: boolean };
      if (progress.answers) {
        const answeredQuestions = Object.values(progress.answers).filter(a => a !== null).length;
        // Extract exercise id from the key (remove -collection suffix if present)
        const exerciseId = key.replace(/-collection$/, '');
        result[exerciseId] = {
          answeredQuestions,
          totalQuestions: Object.keys(progress.answers).length || answeredQuestions,
        };
      }
    }
    return result;
  } catch {
    return {};
  }
};

// نوع السؤال
export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  skillTag?: string;
  howToSolve?: string; // شرح طريقة الحل - يظهر عند قلب البطاقة
  passageText?: string; // نص القطعة لأسئلة استيعاب المقروء
  passageTitle?: string; // عنوان القطعة
  variants?: Array<{
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

// نوع البنك (إصدار)
export interface Bank {
  id: string;
  name: string;
  questions: Question[];
}

// نوع التجميعة
export interface Collection {
  id: string;
  name: string;
  description: string;
  category: "quantitative" | "verbal";
  questions: Question[];
  banks?: Bank[]; // للتجميعات التي تحتوي على بنوك متعددة
  hasFlipFeature?: boolean; // ميزة قلب البطاقة لعرض طريقة الحل
}

// التجميعات المثبتة
export const pinnedCollections: Record<string, Collection[]> = {
  quantitative: [
    {
      id: "quant-collection-1446",
      name: "تجميعات 1446",
      description: "أحدث تجميعات الكمي",
      category: "quantitative",
      questions: [
        {
          id: "q1",
          prompt: "إذا كان س + 5 = 12، فما قيمة س؟",
          options: ["5", "7", "8", "12"],
          correctAnswer: 1,
          explanation: "س + 5 = 12 ← س = 12 - 5 = 7",
          skillTag: "algebra",
          variants: [
            {
              id: "q1-v1",
              prompt: "إذا كان س + 8 = 15، فما قيمة س؟",
              options: ["5", "7", "8", "23"],
              correctAnswer: 1,
              explanation: "س + 8 = 15 ← س = 15 - 8 = 7",
            },
            {
              id: "q1-v2",
              prompt: "إذا كان س + 3 = 11، فما قيمة س؟",
              options: ["6", "8", "14", "3"],
              correctAnswer: 1,
              explanation: "س + 3 = 11 ← س = 11 - 3 = 8",
            },
          ],
        },
        {
          id: "q2",
          prompt: "ما ناتج 15 × 4؟",
          options: ["45", "50", "60", "65"],
          correctAnswer: 2,
          explanation: "15 × 4 = 60",
          skillTag: "arithmetic",
          variants: [
            {
              id: "q2-v1",
              prompt: "ما ناتج 12 × 5؟",
              options: ["50", "55", "60", "65"],
              correctAnswer: 2,
              explanation: "12 × 5 = 60",
            },
            {
              id: "q2-v2",
              prompt: "ما ناتج 18 × 3؟",
              options: ["48", "51", "54", "56"],
              correctAnswer: 2,
              explanation: "18 × 3 = 54",
            },
          ],
        },
        {
          id: "q3",
          prompt: "إذا كان محيط مربع 20 سم، فما طول ضلعه؟",
          options: ["4 سم", "5 سم", "10 سم", "20 سم"],
          correctAnswer: 1,
          explanation: "محيط المربع = 4 × الضلع ← 20 = 4 × الضلع ← الضلع = 5 سم",
          skillTag: "geometry",
          variants: [
            {
              id: "q3-v1",
              prompt: "إذا كان محيط مربع 28 سم، فما طول ضلعه؟",
              options: ["5 سم", "7 سم", "14 سم", "28 سم"],
              correctAnswer: 1,
              explanation: "محيط المربع = 4 × الضلع ← 28 = 4 × الضلع ← الضلع = 7 سم",
            },
            {
              id: "q3-v2",
              prompt: "إذا كان محيط مربع 36 سم، فما طول ضلعه؟",
              options: ["6 سم", "9 سم", "18 سم", "36 سم"],
              correctAnswer: 1,
              explanation: "محيط المربع = 4 × الضلع ← 36 = 4 × الضلع ← الضلع = 9 سم",
            },
          ],
        },
        {
          id: "q4",
          prompt: "ما هو 25% من 200؟",
          options: ["25", "50", "75", "100"],
          correctAnswer: 1,
          explanation: "25% من 200 = (25/100) × 200 = 50",
          skillTag: "ratios",
          variants: [
            {
              id: "q4-v1",
              prompt: "ما هو 20% من 150؟",
              options: ["15", "30", "45", "75"],
              correctAnswer: 1,
              explanation: "20% من 150 = (20/100) × 150 = 30",
            },
            {
              id: "q4-v2",
              prompt: "ما هو 50% من 80؟",
              options: ["20", "40", "60", "80"],
              correctAnswer: 1,
              explanation: "50% من 80 = (50/100) × 80 = 40",
            },
          ],
        },
        {
          id: "q5",
          prompt: "إذا كان عمر أحمد ضعف عمر سالم، وعمر سالم 15 سنة، فكم عمر أحمد؟",
          options: ["20 سنة", "25 سنة", "30 سنة", "35 سنة"],
          correctAnswer: 2,
          explanation: "عمر أحمد = 2 × عمر سالم = 2 × 15 = 30 سنة",
          skillTag: "ratios",
          variants: [
            {
              id: "q5-v1",
              prompt: "إذا كان عمر خالد ضعف عمر محمد، وعمر محمد 12 سنة، فكم عمر خالد؟",
              options: ["18 سنة", "20 سنة", "24 سنة", "28 سنة"],
              correctAnswer: 2,
              explanation: "عمر خالد = 2 × عمر محمد = 2 × 12 = 24 سنة",
            },
            {
              id: "q5-v2",
              prompt: "إذا كان عمر سارة ضعف عمر نورة، وعمر نورة 10 سنوات، فكم عمر سارة؟",
              options: ["15 سنة", "18 سنة", "20 سنة", "25 سنة"],
              correctAnswer: 2,
              explanation: "عمر سارة = 2 × عمر نورة = 2 × 10 = 20 سنة",
            },
          ],
        },
        {
          id: "q6",
          prompt: "ما ناتج جذر 144؟",
          options: ["10", "11", "12", "14"],
          correctAnswer: 2,
          explanation: "√144 = 12 لأن 12 × 12 = 144",
          skillTag: "arithmetic",
        },
        {
          id: "q7",
          prompt: "إذا كان ثمن 5 كتب 75 ريال، فكم ثمن 8 كتب؟",
          options: ["100 ريال", "110 ريال", "120 ريال", "130 ريال"],
          correctAnswer: 2,
          explanation: "ثمن الكتاب الواحد = 75 ÷ 5 = 15 ريال ← ثمن 8 كتب = 8 × 15 = 120 ريال",
          skillTag: "ratios",
        },
        {
          id: "q8",
          prompt: "ما هو العدد التالي في المتتابعة: 2، 6، 18، 54، ...؟",
          options: ["108", "162", "216", "72"],
          correctAnswer: 1,
          explanation: "المتتابعة هندسية بأساس 3 ← العدد التالي = 54 × 3 = 162",
          skillTag: "algebra",
        },
        {
          id: "q9",
          prompt: "مستطيل طوله 8 سم وعرضه 5 سم، ما مساحته؟",
          options: ["13 سم²", "26 سم²", "40 سم²", "80 سم²"],
          correctAnswer: 2,
          explanation: "مساحة المستطيل = الطول × العرض = 8 × 5 = 40 سم²",
          skillTag: "geometry",
        },
        {
          id: "q10",
          prompt: "إذا كان س² = 49، فما قيمة س؟",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2,
          explanation: "س² = 49 ← س = √49 = 7",
          skillTag: "algebra",
        },
      ],
    },
    {
      id: "quant-collection-mufakkir",
      name: "تجميعات المفكر",
      description: "تجميعات المفكر للقسم الكمي",
      category: "quantitative",
      hasFlipFeature: true,
      questions: [],
      banks: [
        {
          id: "bank-1",
          name: "الإصدار ١",
          questions: [
            {
              id: "b1-q1",
              prompt: "(ص ، ٥) ، (٥ ، ٩) ، (٣ ، س) حيث (٥ ، ٩) نقطة منتصف بينهم، قارن بين: القيمة الأولى: ص، القيمة الثانية: س",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
              howToSolve: "نقطة المنتصف = ((س١+س٢)/٢ ، (ص١+ص٢)/٢)\n\nلإيجاد ص: (ص + ٣)/٢ = ٥ → ص = ٧\nلإيجاد س: (٥ + س)/٢ = ٩ → س = ١٣\n\nالمقارنة: ٧ < ١٣ ← القيمة الثانية أكبر",
            },
            {
              id: "b1-q2",
              prompt: "مربع ومستطيل قطراهما متساويان (٥ سم)، قارن بين: القيمة الأولى: مساحة المربع، القيمة الثانية: مساحة المستطيل",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 0,
              howToSolve: "مساحة المربع = (القطر)²/٢ = ٢٥/٢ = ١٢.٥ سم²\n\nمساحة المستطيل = (الطول × العرض)\nبما أن القطر ثابت والأبعاد مختلفة، فإن أكبر مساحة تكون للمربع\n\nقاعدة: من بين جميع المستطيلات ذات القطر المتساوي، المربع له أكبر مساحة",
            },
            {
              id: "b1-q3",
              prompt: "٢ / (√٣ - ١) = ؟",
              options: ["√٣ + ١", "√٣ - ١", "√٣ - ٢", "√٣ + ٢"],
              correctAnswer: 0,
              howToSolve: "نضرب البسط والمقام في المرافق (√٣ + ١):\n\n٢/(√٣ - ١) × (√٣ + ١)/(√٣ + ١)\n= ٢(√٣ + ١) / (٣ - ١)\n= ٢(√٣ + ١) / ٢\n= √٣ + ١",
            },
            {
              id: "b1-q4",
              prompt: "لدى سلمى أخت أكبر منها بـ ٨ سنوات وأخت أصغر منها بـ سنتين وحاصل ضرب أعمار أخواتها = ٥٦، فكم عمر سلمى؟",
              options: ["٨", "٩", "٦", "٤"],
              correctAnswer: 2,
              howToSolve: "نفرض عمر سلمى = س\nعمر الأخت الكبرى = س + ٨\nعمر الأخت الصغرى = س - ٢\n\n(س + ٨)(س - ٢) = ٥٦\nس² + ٦س - ١٦ = ٥٦\nس² + ٦س - ٧٢ = ٠\n(س + ١٢)(س - ٦) = ٠\nس = ٦ (نأخذ القيمة الموجبة)",
            },
            {
              id: "b1-q5",
              prompt: "إذا كان ٥^٢٠ / ٥^س = ٥^ص، أوجد متوسط س ، ص",
              options: ["١٠", "١٥", "٢٠", "٢٥"],
              correctAnswer: 0,
              howToSolve: "قاعدة الأسس: أ^م / أ^ن = أ^(م-ن)\n\n٥^٢٠ / ٥^س = ٥^(٢٠-س) = ٥^ص\n∴ ص = ٢٠ - س\n∴ س + ص = ٢٠\n\nالمتوسط = (س + ص)/٢ = ٢٠/٢ = ١٠",
            },
            {
              id: "b1-q6",
              prompt: "كم عدد المئات في العدد ٩٩٨٦٠ ؟",
              options: ["٩٩٨٠٠", "٩٩٨", "٩٩٩٠٠", "٩٩٩"],
              correctAnswer: 1,
              howToSolve: "عدد المئات = العدد ÷ ١٠٠ (مع تجاهل الكسور)\n\n٩٩٨٦٠ ÷ ١٠٠ = ٩٩٨.٦\n\nعدد المئات الكاملة = ٩٩٨",
            },
            {
              id: "b1-q7",
              prompt: "قارن بين: القيمة الأولى: √(١٠٠ + ٩)، القيمة الثانية: ٣ + ١٠",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
              howToSolve: "القيمة الأولى = √(١٠٠ + ٩) = √١٠٩ ≈ ١٠.٤٤\n\nالقيمة الثانية = ٣ + ١٠ = ١٣\n\n١٠.٤٤ < ١٣\n← القيمة الثانية أكبر\n\nملاحظة: √(أ+ب) ≠ √أ + √ب",
            },
            {
              id: "b1-q8",
              prompt: "أوجد الحد التالي: ٢ ، ٤ ، ٨ ، ١٤ ، ٢٢ ...",
              options: ["٣٠", "٣٢", "٣٤", "٣٦"],
              correctAnswer: 1,
              howToSolve: "نحسب الفروق بين الأعداد المتتالية:\n٤-٢=٢، ٨-٤=٤، ١٤-٨=٦، ٢٢-١٤=٨\n\nالفروق: ٢، ٤، ٦، ٨ (تزيد بمقدار ٢)\nالفرق التالي = ١٠\n\nالحد التالي = ٢٢ + ١٠ = ٣٢",
            },
            {
              id: "b1-q9",
              prompt: "أي المدن في زيادة مطردة؟ (رسم بياني يوضح مكة، المدينة، الطائف، عسير من ١٤٣٠ إلى ١٤٣٤)",
              options: ["مكة", "المدينة", "الطائف", "عسير"],
              correctAnswer: 3,
            },
            {
              id: "b1-q10",
              prompt: "ثلاثة أعداد متتالية أحدهم ١١ وحاصل ضربهم ٩٩٠، فما مجموع هذه الأعداد؟",
              options: ["٢٧", "٣٠", "٣٢", "٣٦"],
              correctAnswer: 1,
              howToSolve: "نجرب الاحتمالات مع ١١:\n• ٩، ١٠، ١١ ← ٩×١٠×١١ = ٩٩٠ ✓\n• ١٠، ١١، ١٢ ← ١٠×١١×١٢ = ١٣٢٠ ✗\n• ١١، ١٢، ١٣ ← أكبر من ٩٩٠ ✗\n\nالأعداد: ٩، ١٠، ١١\nالمجموع = ٩ + ١٠ + ١١ = ٣٠",
            },
            {
              id: "b1-q11",
              prompt: "إذا كان ٣ < س < ٥ ، ص > س، قارن بين: القيمة الأولى: ٠٫٧٥، القيمة الثانية: ص/س",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
            },
            {
              id: "b1-q12",
              prompt: "إذا كان ن عدد طبيعي، أوجد متوسط: ن ، ن + ٢ ، ن + ١٠",
              options: ["٣ن + ٤", "٣ن + ١٢", "ن + ٥", "ن + ٤"],
              correctAnswer: 3,
              howToSolve: "المتوسط = مجموع الأعداد ÷ عددها\n\nالمجموع = ن + (ن+٢) + (ن+١٠)\n= ٣ن + ١٢\n\nالمتوسط = (٣ن + ١٢) ÷ ٣\n= ن + ٤",
            },
            {
              id: "b1-q13",
              prompt: "إذا كان √س + ٤ = ١٠، أوجد قيمة س",
              options: ["٢", "٤", "٦", "٨"],
              correctAnswer: 2,
              howToSolve: "√س + ٤ = ١٠\n√س = ١٠ - ٤\n√س = ٦\n\nبتربيع الطرفين:\nس = ٣٦\n\nملاحظة: إذا كانت المعادلة √(س+٤)=١٠\nفإن س+٤=١٠٠ ← س=٩٦",
            },
            {
              id: "b1-q14",
              prompt: "ما أعلى يوم من حيث كمية الأمطار؟ (رسم بياني يوضح كمية الأمطار خلال أيام الأسبوع)",
              options: ["السبت", "الأحد", "الإثنين", "الثلاثاء"],
              correctAnswer: 1,
            },
            {
              id: "b1-q15",
              prompt: "أوجد الحد التالي: ٣ ، ٥ ، ٩ ، ......",
              options: ["١٦", "١٧", "١٨", "١٩"],
              correctAnswer: 1,
            },
            {
              id: "b1-q16",
              prompt: "٨ □ ٤ = ٢، ما العملية المناسبة؟",
              options: ["×", "÷", "+", "-"],
              correctAnswer: 1,
            },
            {
              id: "b1-q17",
              prompt: "عجلة طول نصف قطرها ٥٠ سم تدور ٦ دورات، ما المسافة التي قطعتها بالمتر؟",
              options: ["٩٤٫٢", "٩٫٤٢", "٩٤٢", "١٨٫٨٤"],
              correctAnswer: 3,
              howToSolve: "المسافة في الدورة الواحدة = محيط الدائرة\nالمحيط = ٢ × ط × نق = ٢ × ٣.١٤ × ٥٠ = ٣١٤ سم\n\nالمسافة الكلية = ٦ × ٣١٤ = ١٨٨٤ سم\n= ١٨.٨٤ متر",
            },
            {
              id: "b1-q18",
              prompt: "إذا كانت المسافة من س إلى ص = ١٢ والمسافات بينهما متساوية (س، ل، ع، ص)، قارن بين: القيمة الأولى: ٣، القيمة الثانية: س ل",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
            },
            {
              id: "b1-q19",
              prompt: "ما عدد المئات في العدد: ٧٩٦٣٥ ؟",
              options: ["٧٩٦", "٩٦", "٦٣", "٦"],
              correctAnswer: 0,
            },
            {
              id: "b1-q20",
              prompt: "ما عدد الأعداد الصحيحة من ١ إلى ٤٠ التي تحتوي خاناتها على ٢ أو ٣ أو كليهما؟",
              options: ["٢٠", "٢٢", "٢٤", "٢٦"],
              correctAnswer: 2,
            },
            {
              id: "b1-q21",
              prompt: "قارن بين: القيمة الأولى: ٩٩^(١/٢) + ٩٩^(١/٢)، القيمة الثانية: ٩٩",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
            },
            {
              id: "b1-q22",
              prompt: "الشكل المجاور مربع فيه قطران متقاطعان، إحدى الزوايا = ٧٠°، أوجد قيمة س",
              options: ["٧٠", "٦٥", "١١٥", "١٢٠"],
              correctAnswer: 2,
            },
            {
              id: "b1-q23",
              prompt: "في الشكل المجاور مستطيل أحد بعديه فردي (٤ص + ٨ و ٢٠س - ١٦ و س² و ص)، أوجد محيطه",
              options: ["٥٦", "٨٨", "١٠٦", "١١٦"],
              correctAnswer: 2,
            },
            {
              id: "b1-q24",
              prompt: "إذا كان ٢^٢٠١٣ = ٢^٢٠١٢ × س، أوجد قيمة س",
              options: ["٢⁰", "٢¹", "٢²", "٢⁴"],
              correctAnswer: 1,
              howToSolve: "٢^٢٠١٣ = ٢^٢٠١٢ × س\n\nنقسم الطرفين على ٢^٢٠١٢:\nس = ٢^٢٠١٣ / ٢^٢٠١٢\nس = ٢^(٢٠١٣-٢٠١٢)\nس = ٢^١ = ٢",
            },
            {
              id: "b1-q25",
              prompt: "ما مجموع القيم: ٣٠٠٠ + ٢٠٠٠٠ + ٥٠٠٠٠٠ + ٦٠٠٠٠٠٠ + ٧ + ٤٠ + ٦٠٠",
              options: ["٣٦٤٧٦", "٦٥٢٣٦٤٧", "٧٤٣٦", "١٨٧٨٨٥"],
              correctAnswer: 1,
            },
            {
              id: "b1-q26",
              prompt: "س⁵ / ٣٦ = ٤ / (٩ × ½)، أوجد قيمة س",
              options: ["٢", "٤", "٦", "٨"],
              correctAnswer: 0,
            },
            {
              id: "b1-q27",
              prompt: "في الشكل المجاور مستطيل (أ ب ج د)، قارن بين: القيمة الأولى: ب ج، القيمة الثانية: أ د",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 3,
            },
            {
              id: "b1-q28",
              prompt: "في الشكل المقابل شكل خماسي بزاويتين ٤٠° و ٤٠° وزاويتين س و ٢س، ما قيمة س؟",
              options: ["٥٠", "٩٠", "٣٠", "٦٠"],
              correctAnswer: 0,
            },
            {
              id: "b1-q29",
              prompt: "قارن بين: القيمة الأولى: ص (حيث ص = ٤ × ٤ + ١٠)، القيمة الثانية: س (حيث س = ١٠ - ٣ × ٥)",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 0,
            },
            {
              id: "b1-q30",
              prompt: "ما قيمة: (س + ص)² - ٢س ص + (س - ص)² + ٢س ص",
              options: ["س² - ص²", "س² + ص²", "٢(س² + ص²)", "٢(س + ص)²"],
              correctAnswer: 2,
              howToSolve: "(س+ص)² = س² + ٢سص + ص²\n(س-ص)² = س² - ٢سص + ص²\n\nالمجموع:\n(س² + ٢سص + ص²) - ٢سص + (س² - ٢سص + ص²) + ٢سص\n= س² + ص² + س² + ص²\n= ٢س² + ٢ص²\n= ٢(س² + ص²)",
            },
            {
              id: "b1-q31",
              prompt: "قارن بين: القيمة الأولى: أكبر عدد أولي من ٥٠ إلى ٦٤، القيمة الثانية: ٦٣",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
            },
            {
              id: "b1-q32",
              prompt: "خمسة أعداد أكبرها صفر فإن جميع الأعداد الباقية:",
              options: ["موجبة", "سالبة", "أولية", "فردية"],
              correctAnswer: 1,
            },
            {
              id: "b1-q33",
              prompt: "ما الطالب الأعلى معدل دراسي؟ (رسم بياني يوضح معدلات الطلاب)",
              options: ["نواف", "عبدالعزيز", "راكان", "نايف"],
              correctAnswer: 3,
            },
            {
              id: "b1-q34",
              prompt: "طريق طوله ٨ كلم، كم طوله بالأمتار تقريباً؟",
              options: ["٨٨٨٠", "٧٨٥٠", "٩٠٠", "٧٢٠٠"],
              correctAnswer: 1,
            },
            {
              id: "b1-q35",
              prompt: "أي الأعداد التالية يمكن كتابته على صورة ٣ن حيث أن ن عدد صحيح؟",
              options: ["٣٢", "٤٣", "٥٧", "٦٢"],
              correctAnswer: 2,
            },
            {
              id: "b1-q36",
              prompt: "في الشكل المجاور: مستطيل محيطه = ٢٠، ومساحته = ٢٤ وجميع الدوائر متطابقة (٦ دوائر)، أوجد طول قطر الدائرة",
              options: ["١٠", "٢", "١٢", "٤"],
              correctAnswer: 1,
            },
            {
              id: "b1-q37",
              prompt: "أوجد الحد التالي: ٣ ، ٥ ، ٩ ، ١٧ ، ٣٣ ، .........",
              options: ["٦٠", "٦٢", "٦٣", "٦٥"],
              correctAnswer: 3,
              howToSolve: "نحسب الفروق:\n٥-٣=٢، ٩-٥=٤، ١٧-٩=٨، ٣٣-١٧=١٦\n\nالفروق: ٢، ٤، ٨، ١٦ (تتضاعف)\nالفرق التالي = ٣٢\n\nالحد التالي = ٣٣ + ٣٢ = ٦٥",
            },
            {
              id: "b1-q38",
              prompt: "كم عدد المستطيلات في الشكل (مستطيل مقسم إلى ٥ أعمدة)",
              options: ["٦", "١٠", "١٥", "٢٠"],
              correctAnswer: 2,
              howToSolve: "عدد المستطيلات في صف واحد من ن عمود:\n= ن + (ن-١) + (ن-٢) + ... + ١\n= ن(ن+١)/٢\n\nعند ن = ٥:\n= ٥×٦/٢ = ١٥ مستطيل",
            },
            {
              id: "b1-q39",
              prompt: "ما نوع المثلث الذي أضلاعه ٢ سم و ٣ سم و ٤ سم؟",
              options: ["حاد الزوايا", "قائم الزاوية", "منفرج الزاوية", "متطابق الزوايا"],
              correctAnswer: 2,
              howToSolve: "نقارن مربع أكبر ضلع بمجموع مربعي الضلعين الآخرين:\n\n(٤)² مقارنة بـ (٢)² + (٣)²\n١٦ مقارنة بـ ٤ + ٩ = ١٣\n\n١٦ > ١٣ ← منفرج الزاوية\n\nقاعدة: إذا ج² > أ² + ب² ← منفرج",
            },
            {
              id: "b1-q40",
              prompt: "إذا كان √(س + ٣٢) = ٩، أوجد قيمة س",
              options: ["٤٨", "٤٩", "٥٠", "٥١"],
              correctAnswer: 1,
              howToSolve: "√(س + ٣٢) = ٩\n\nبتربيع الطرفين:\nس + ٣٢ = ٨١\nس = ٨١ - ٣٢\nس = ٤٩",
            },
            {
              id: "b1-q41",
              prompt: "إذا كان هناك صندوق يحمل ٩ بيضات ومع خالد ١٢٠ بيضة فكم صندوق يحتاج لحملها كلها؟",
              options: ["٢١", "١٤", "١٩", "١١"],
              correctAnswer: 1,
              howToSolve: "عدد الصناديق = إجمالي البيض ÷ سعة الصندوق\n\n١٢٠ ÷ ٩ = ١٣.٣٣\n\nنقرب لأعلى لأننا نحتاج صندوق إضافي للبيض المتبقي\n= ١٤ صندوق",
            },
            {
              id: "b1-q42",
              prompt: "(٣٣ + س) + ٥٦ = (٣٣ + ٥٦) + ٨٩، أوجد قيمة س",
              options: ["٨٩", "١٠٧", "٧٦", "٦٧"],
              correctAnswer: 0,
            },
            {
              id: "b1-q43",
              prompt: "إذا كان هناك شخص يعمل من الأحد إلى الخميس ٨ ساعات في كل يوم وفي يوم الجمعة يأخذ إجازة ويعمل السبت ٤ ساعات، فكم عدد ساعات عمله في الأسبوع؟",
              options: ["٤٠", "٤٢", "٤٤", "٤٨"],
              correctAnswer: 2,
              howToSolve: "من الأحد للخميس = ٥ أيام × ٨ ساعات = ٤٠ ساعة\nالجمعة = ٠ (إجازة)\nالسبت = ٤ ساعات\n\nالإجمالي = ٤٠ + ٠ + ٤ = ٤٤ ساعة",
            },
            {
              id: "b1-q44",
              prompt: "إذا كان √٢٠ × √٥ = ٢ × ٥، أوجد قيمة √٢٠ + √٥",
              options: ["٢√٥", "٤√٥", "٣√٥", "٥√٥"],
              correctAnswer: 2,
              howToSolve: "√٢٠ = √(٤×٥) = ٢√٥\n√٥ = √٥\n\n√٢٠ + √٥ = ٢√٥ + √٥\n= ٣√٥",
            },
            {
              id: "b1-q45",
              prompt: "قارن بين: القيمة الأولى: (٠٫٣ / ٠٫٠٣) + (٠٫٠٣ / ٠٫٣)، القيمة الثانية: ١٠٫٢",
              options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
              correctAnswer: 1,
            },
            {
              id: "b1-q46",
              prompt: "٢/س + ٥/س + ٥/س = ١٢/٥، فكم قيمة س؟",
              options: ["١٢", "٦", "١٠", "٥"],
              correctAnswer: 3,
              howToSolve: "٢/س + ٥/س + ٥/س = ١٢/٥\n(٢ + ٥ + ٥)/س = ١٢/٥\n١٢/س = ١٢/٥\n\nبالمقارنة: س = ٥",
            },
            {
              id: "b1-q47",
              prompt: "إذا كان طول ضلع المربع = ١٠ سم، احسب مساحة الشكل المظلل (٤ أوراق متقاطعة)",
              options: ["٧٥(ط - ٢)", "٥٠(ط - ٢)", "٧٥(ط - ١)", "١٠(ط - ١)"],
              correctAnswer: 1,
            },
            {
              id: "b1-q48",
              prompt: "مثلث زواياه ٥٠° و ٤٠° و س، كم قيمة س؟",
              options: ["٥٠", "٤٠", "١٨٠", "٩٠"],
              correctAnswer: 3,
              howToSolve: "مجموع زوايا المثلث = ١٨٠°\n\n٥٠ + ٤٠ + س = ١٨٠\n٩٠ + س = ١٨٠\nس = ٩٠°",
            },
          ],
        },
      ],
    },
  ],
  verbal: [
    {
      id: "verbal-collection-1446",
      name: "تجميعات 1446",
      description: "أحدث تجميعات اللفظي",
      category: "verbal",
      questions: [
        {
          id: "v1",
          prompt: "اختر الكلمة المناسبة: الكتاب _____ المعرفة",
          options: ["باب", "مفتاح", "نافذة", "جدار"],
          correctAnswer: 1,
          explanation: "الكتاب مفتاح المعرفة - تعبير مجازي يدل على أن الكتاب يفتح أبواب العلم",
          skillTag: "completion",
        },
        {
          id: "v2",
          prompt: "ما مرادف كلمة 'سريع'؟",
          options: ["بطيء", "عاجل", "ثقيل", "خفيف"],
          correctAnswer: 1,
          explanation: "عاجل = سريع، كلاهما يدل على السرعة في الفعل أو الحركة",
          skillTag: "vocabulary",
        },
        {
          id: "v3",
          prompt: "ما ضد كلمة 'النجاح'؟",
          options: ["التفوق", "الفشل", "الصعود", "التقدم"],
          correctAnswer: 1,
          explanation: "الفشل هو عكس النجاح - عدم تحقيق الهدف المطلوب",
          skillTag: "vocabulary",
        },
        {
          id: "v4",
          prompt: "أكمل: الصبر _____ الفرج",
          options: ["قبل", "مفتاح", "بعد", "طريق"],
          correctAnswer: 1,
          explanation: "الصبر مفتاح الفرج - حكمة عربية تعني أن الصبر يؤدي إلى الفرج",
          skillTag: "completion",
        },
        {
          id: "v5",
          prompt: "ما معنى كلمة 'الجود'؟",
          options: ["البخل", "الكرم", "الفقر", "الغنى"],
          correctAnswer: 1,
          explanation: "الجود = الكرم = السخاء في العطاء",
          skillTag: "vocabulary",
        },
        {
          id: "v6",
          prompt: "اختر التناظر الصحيح: قلم : كتابة :: سكين : ؟",
          options: ["طبخ", "قطع", "أكل", "مطبخ"],
          correctAnswer: 1,
          explanation: "القلم أداة للكتابة، والسكين أداة للقطع - علاقة أداة ووظيفتها",
          skillTag: "analogy",
        },
        {
          id: "v7",
          prompt: "ما جمع كلمة 'كتاب'؟",
          options: ["كتابات", "كتب", "مكتبات", "كاتبون"],
          correctAnswer: 1,
          explanation: "كتب هو جمع تكسير لكلمة كتاب",
          skillTag: "grammar",
        },
        {
          id: "v8",
          prompt: "ما ضد كلمة 'الظلام'؟",
          options: ["الليل", "النور", "الغروب", "السواد"],
          correctAnswer: 1,
          explanation: "النور هو عكس الظلام - الضياء مقابل العتمة",
          skillTag: "vocabulary",
        },
        {
          id: "v9",
          prompt: "أكمل المثل: من جد _____",
          options: ["نجح", "وجد", "فاز", "تعلم"],
          correctAnswer: 1,
          explanation: "من جد وجد - مثل عربي يعني من اجتهد حصل على مراده",
          skillTag: "completion",
        },
        {
          id: "v10",
          prompt: "اختر الكلمة الشاذة: تفاح، برتقال، جزر، موز",
          options: ["تفاح", "برتقال", "جزر", "موز"],
          correctAnswer: 2,
          explanation: "جزر هو الشاذ لأنه من الخضروات، بينما الباقي فواكه",
          skillTag: "vocabulary",
        },
      ],
    },
    {
      id: "verbal-collection-mufakkir",
      name: "تجميعات المفكر",
      description: "تجميعات المفكر للقسم اللفظي",
      category: "verbal",
      questions: [
        {
          id: "mufakkir-v1",
          prompt: "سيتم إضافة الأسئلة قريباً",
          options: ["--", "--", "--", "--"],
          correctAnswer: 0,
          explanation: "هذا سؤال مؤقت",
        },
      ],
    },
  ],
};

interface LessonGridProps {
  category: string;
  onExerciseClick: (exercise: Exercise) => void;
  onCollectionClick?: (collection: Collection) => void;
}

const categoryNames: Record<string, string> = {
  "all-math": "الكمي - الكل",
  "quantitative": "الكمي - حساب",
  "algebra": "الكمي - جبر",
  "all-verbal": "اللفظي - الكل",
  "verbal": "البنك الأول",
  "analogy": "اللفظي - تناظر",
  "verbal-bank-2": "البنك الثاني",
  "verbal-bank-3": "البنك الثالث",
  "verbal-bank-4": "البنك الرابع",
  "verbal-bank-5": "البنك الخامس",
  "verbal-bank-6": "البنك السادس",
  "verbal-bank-7": "البنك السابع",
  "verbal-bank-8": "البنك الثامن",
  "mixed": "اختبار محاكي",
};

const difficultyLabels: Record<string, string> = {
  "beginner": "مبتدئ",
  "intermediate": "متوسط",
  "advanced": "متقدم",
};

const difficultyColors: Record<string, string> = {
  "beginner": "bg-turquoise text-turquoise-foreground",
  "intermediate": "bg-yellow text-yellow-foreground",
  "advanced": "bg-coral text-coral-foreground",
};

const LessonGrid = ({ category, onExerciseClick, onCollectionClick }: LessonGridProps) => {
  const { getExercisesByCategory } = useExercises();
  const [progress, setProgress] = useState<ExerciseProgress>({});

  // Load progress from localStorage
  useEffect(() => {
    setProgress(getAllProgress());

    // Listen for storage changes
    const handleStorage = () => setProgress(getAllProgress());
    window.addEventListener("storage", handleStorage);

    // Also poll for changes (for same-tab updates)
    const interval = setInterval(() => setProgress(getAllProgress()), 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Don't show anything on initial load (default "quantitative" state)
  const isInitialState = category === "quantitative";
  const exercises = isInitialState ? [] : getExercisesByCategory(category);

  const isVerbalCategory = category === "verbal" || category === "analogy" || category.startsWith("verbal-bank-");
  const isMathCategory = category === "all-math" || category === "quantitative" || category === "algebra";
  const showProgress = isVerbalCategory || isMathCategory;

  // Get pinned collections based on category
  const getCollectionsForCategory = () => {
    if (category === "all-math" || category === "algebra") {
      return pinnedCollections.quantitative;
    }
    return [];
  };

  const collections = isInitialState ? [] : getCollectionsForCategory();

  // Check if this is a locked bank
  const isLockedBank = lockedBanks.includes(category);

  if (isLockedBank) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center shadow-lg max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow/20 flex items-center justify-center">
            <Lock className="w-10 h-10 text-yellow" />
          </div>
          <h3 className="text-2xl font-bold mb-3">محتوى مقفل</h3>
          <p className="text-muted-foreground mb-6">
            هذا البنك متاح فقط لمشتركي النسخة الاحترافية (Pro)
          </p>
          <motion.button
            className="px-6 py-3 bg-yellow text-yellow-foreground rounded-xl font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            الترقية لـ Pro
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pinned Collections */}
      {collections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-lg">التجميعات</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                onClick={() => onCollectionClick?.(collection)}
                className="bg-gradient-to-l from-primary/10 to-turquoise/10 border-2 border-primary/30 rounded-3xl p-6 cursor-pointer group hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Library className="w-6 h-6 text-primary" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    مثبت
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{collection.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{collection.questions.length} سؤال</span>
                </div>
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                    <Play className="w-4 h-4 fill-current" />
                    <span>ابدأ التجميعة</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Header - hidden on initial state */}
      {!isInitialState && (
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{categoryNames[category] || category}</h2>
            <p className="text-sm text-muted-foreground">{exercises.length} تمارين متاحة</p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-card rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Info className="w-4 h-4" />
              معلومات الوحدة
            </motion.button>

            {exercises.length > 0 && (
              <motion.button
                onClick={() => onExerciseClick(exercises[0])}
                className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4 fill-current" />
                ابدأ التمارين
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            onClick={() => onExerciseClick(exercise)}
            className="bg-card rounded-2xl p-6 cursor-pointer group hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[exercise.difficulty]}`}>
                {difficultyLabels[exercise.difficulty]}
              </span>
            </div>

            {/* Content */}
            <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {exercise.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{exercise.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{exercise.questions.length} أسئلة</span>
              </div>
            </div>

            {/* Progress Bar - for all exercises */}
            {showProgress && (() => {
              const totalQuestions = exercise.questions.length;
              const answeredQuestions = progress[exercise.id]?.answeredQuestions || 0;
              const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
              return (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>التقدم</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-turquoise rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Play Overlay */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <Play className="w-4 h-4 fill-current" />
                <span>{showProgress && progress[exercise.id]?.answeredQuestions > 0 ? "تابع التمرين" : "ابدأ التمرين"}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {exercises.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            {isInitialState ? (
              <>
                <p>اختر قسماً للبدء</p>
                <p className="text-sm">الكمي أو اللفظي أو اختبار محاكي</p>
              </>
            ) : (
              <>
                <p>لا توجد تمارين في هذا القسم حالياً</p>
                <p className="text-sm">سيتم إضافة تمارين جديدة قريباً</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonGrid;
