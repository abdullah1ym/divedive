import { motion } from "framer-motion";
import { Play, Info, Brain, Clock, Library, Pin } from "lucide-react";
import { useExercises, Exercise } from "@/contexts/ExercisesContext";

// نوع السؤال
export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  skillTag?: string;
  howToSolve?: string; // شرح طريقة الحل - يظهر عند قلب البطاقة
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
      description: "تجميعات المفكر للقسم الكمي - ٥٠ إصدار",
      category: "quantitative",
      questions: [],
      banks: [
        {
          id: "bank-50",
          name: "الإصدار ٥٠",
          questions: [
        {
          id: "mufakkir-q1",
          prompt: "إذا كان ٣<sup>س</sup> = ١٨، قارن بين: القيمة الأولى: ٣<sup>س-١</sup>، القيمة الثانية: ٦",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q2",
          prompt: "ما العدد الذي تضربه في ١٠ = ٤٢",
          options: ["٤,٢٠", "٤,٥", "٤", "٤,٤"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q3",
          prompt: "عدد معين إذا ضرب في ٣، ثم أضفنا إليه ٥، فإن النتيجة تساوي خمس مرات العدد الأصلي. ما هو هذا العدد؟",
          options: ["٦", "٢,٥", "٤", "١٠"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q4",
          prompt: "عدد خُمسُه يساوي ٢٥٪ من ١٢٠",
          options: ["١٠٠", "٣٠", "١٥٠", "١٢٠"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q5",
          prompt: "علبتين لهما نفس الارتفاع، الأولى قاعدتها مثلث متطابق الأضلاع ضلعه = ٣، والثانية قاعدتها مستطيلة أبعادها ٦،٤ فقارن بين: القيمة الأولى: حجم العلبة الأولى، القيمة الثانية: حجم العلبة الثانية",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q6",
          prompt: "إذا أجاب طالب على ٣٠ سؤال في الاختبار وهي تمثل ٦٠٪، كم عدد الأسئلة الغير مجابة؟",
          options: ["١٠٠", "٣٠", "٢٠", "١٢٠"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q7",
          prompt: "ثلاثة أعداد صحيحة مجموعهم = ١٢ وضربهم = ٤٨",
          options: ["٢،٦،٤", "٢،٥،٥", "٤،٠،٨", "١،٨،٣"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q8",
          prompt: "قارن بين: القيمة الأولى: قيمة الآحاد في ٦⁵، القيمة الثانية: قيمة الآحاد في ٥⁶",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q9",
          prompt: "أوجد قيمة س (مربع فيه قطر يصنع زاوية ٣٠ درجة)",
          options: ["٧٠", "٦٠", "٤٥", "٣٠"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q10",
          prompt: "الأرقام ٣،٤،٩ تكون عدد عشري أصغر من ٩ وأكبر من ٤ فما أكبر قيمة تحقق الشروط؟",
          options: ["٩,٣٤", "٩,٤٣", "٤,٣٩", "٤,٩٣"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q11",
          prompt: "(-١)¹ + (-١)² + (-١)³ + (-١)⁴ + (-١)⁵ + (-١)⁶ + ... + (-١)²² + (-١)²³",
          options: ["١", "-١", "٢", "٣"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q12",
          prompt: "أوجد قياس الزاوية و ع هـ (دائرة فيها زاويتين ٦٠ و ٧٠)",
          options: ["٧٠", "٦٠", "٤٥", "١٢٠"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q13",
          prompt: "تكلفة دخول الأطفال ١٦ ريالاً، وتكلفة دخول الكبار ٢٢ ريالاً وحصل البائع على مبلغ إجمالي يقارب ١٢٠ ريالاً. ما عدد الأطفال والكبار الذين دخلوا؟",
          options: ["٩ أطفال، ٤ كبار", "٣ أطفال، ٥ كبار", "٦ أطفال، ٢ كبار", "٢ أطفال، ٤ كبار"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q14",
          prompt: "شخص أخذ الجرعة الأولى من اللقاح يوم السبت، فمتى سيكون موعد الجرعة الثانية من اللقاح إذا كانت المدة بين الجرعتين ٢١ يوماً؟",
          options: ["السبت", "الأحد", "الاثنين", "الثلاثاء"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q15",
          prompt: "عدد لا يقبل القسمة على ٧ ويقبل على ١١",
          options: ["٣٤٣", "٢٠٩", "٦٣٢", "٥٠٩"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q16",
          prompt: "صنبور مياه ارتفاعه ١٠ ومحيط قاعدته ٤٠ احسب مساحته الجانبية",
          options: ["٦٠٠", "٤٥٥", "٥٦٧", "٤٠٠"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q17",
          prompt: "إذا كانت س = -١، أي القيم التالية تحقق ناتج سالب؟",
          options: ["س - ٢", "س/-٢", "س²", "٢س²"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q18",
          prompt: "يسير قطار بسرعة ١ كيلومتر كل دقيقة و ٢٠ ثانية، فكم يقطع من الكيلومترات في ساعة واحدة؟",
          options: ["١٣", "١٥", "٤٥", "٥٠"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q19",
          prompt: "س = ٣ص فكم قيمة ص (شكل زوايا على خط مستقيم مع زاوية ٦٠)",
          options: ["٣٠", "٩٠", "٦٠", "١٠٠"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q20",
          prompt: "قارن بين الأعداد من ١ إلى ٥٠: القيمة الأولى: مجموع الأعداد الفردية، القيمة الثانية: مجموع الأعداد الأولية",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q21",
          prompt: "أوجد قيمة س في الشكل المجاور (مستطيلين متداخلين بزاويتين ٧٥ و ١٠٥)",
          options: ["٧٥", "٩٠", "١٠٥", "١١٠"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q22",
          prompt: "عدد إذا أضفنا له ٤ أمثاله ثم جمعنا ٦ فأصبح يساوي ٦ أمثاله ما هو العدد؟",
          options: ["٤", "٥", "٣", "٧"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q23",
          prompt: "محمد معه مبلغ وأعطى صديقه خالد ثلثين المبلغ وخالد اشترى بربع المبلغ كتاب وبنصف المبلغ أجهزة كهربائية وبقي معه ٣٠٠ ريال اشترى فيها مواد غذائية. كم المبلغ الذي كان مع محمد بالريالات؟",
          options: ["٢٠٠٠", "٥٠٠", "٤٥٠٠", "١٨٠٠"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q24",
          prompt: "سيارة تسير بسرعة ٣٠ كلم/س، فكم تسير في ساعتين و٤ دقائق؟",
          options: ["٣٠", "٤٤", "٦٢", "٥٥"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q25",
          prompt: "الشكل المجاور تم تقسيمه إلى ٧ أجزاء متساوية، فكم نسبة مساحة المظلل إلى الشكل؟",
          options: ["١/٦", "١/٧", "١/٨", "١/١٠"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q26",
          prompt: "إذا كانت أم = ٤√٢ سم، أم نصف قطر المربع، أوجد مساحة المربع بالسم²",
          options: ["١٦", "٤٨", "٦٤", "١٢٨"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q27",
          prompt: "ما قيمة المقدار: (١ ٤/٥)²",
          options: ["٨١/٢٥", "٤/١٩", "١٢/٥", "٦"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q28",
          prompt: "قارن بين: القيمة الأولى: (٦+٧)/(٧+٦)، القيمة الثانية: (٧+٧)/(٨+٧)",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q29",
          prompt: "قارن بين (متوازي أضلاع بزاوية ٨٠): القيمة الأولى: ٨٠، القيمة الثانية: ص",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q30",
          prompt: "أوجد مجموع س + ع (مثلثين متقاطعين بزاوية ٧٠)",
          options: ["١٢٠", "١٠٠", "٨٠", "١٤٠"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q31",
          prompt: "في القيمة ٢/(−√س)، ما هي العبارة لقيمة س التي تجعل الناتج موجباً؟",
          options: ["س > ٠", "س < ٠", "س = ٠", "س ≠ ٠"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q32",
          prompt: "في الشكل المجاور (خطان متقاطعان بزاويتين ١٠٠ و ٤س)، قارن بين: القيمة الأولى: س، القيمة الثانية: ١٩",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q33",
          prompt: "إذا تم تقسيم الشكل المجاور إلى قطع متساوية، ما نسبة مساحة المظلل إلى الشكل؟",
          options: ["٢٥٪", "٤٠٪", "٥٠٪", "٦٠٪"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q34",
          prompt: "أوجد قيمة س (مربع فيه قطر بزاويتين ١٢٠ و ٢٥)",
          options: ["٨٤", "٩٠", "٩٥", "١٠٥"],
          correctAnswer: 2,
        },
        {
          id: "mufakkir-q35",
          prompt: "أوجد قيمة: ١٠² - ١١²",
          options: ["٤٠", "-٦٠", "٣٠", "-٢١"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q36",
          prompt: "إذا كانت س³ = ٤٨، قارن بين: القيمة الأولى: س، القيمة الثانية: ١٥",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q37",
          prompt: "إذا كانت م نصف قطر الدائرة (م ب = ٣سم، م أ = ٥سم)، أوجد قياس الضلع أ ب بالسنتمتر",
          options: ["١٠", "١٥", "٣", "٨"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q38",
          prompt: "عدد إذا ضرب في مثليه وطرح منه ٥ يساوي ١٣ أوجد قيمة هذا العدد",
          options: ["٢", "±٣", "±٤", "-٥"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q39",
          prompt: "أوجد قيمة: (٣⁵ - ٣³) / ٣³",
          options: ["١٣", "١٤", "٩", "٨"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q40",
          prompt: "إذا كان ارتفاع الأسطوانة = مثلي نصف قطر قاعدتها، قارن بين: القيمة الأولى: محيط قاعدة الأسطوانة، القيمة الثانية: ارتفاع الأسطوانة",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q41",
          prompt: "إذا كان وزن علبة شوكولاتة كيلوجرام، وكل شوكولاتة وزنها ٢٠ جرام، فكم قطعة شوكولاتة داخل العلبة؟",
          options: ["٢٥", "٤٠", "٤٥", "٥٠"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q42",
          prompt: "في الشكل المجاور مثلث متطابق الأضلاع (٥س-١ و ٣س+٣)، قارن بين: القيمة الأولى: محيط المثلث، القيمة الثانية: ٤٢",
          options: ["القيمة الأولى أكبر", "القيمة الثانية أكبر", "القيمتان متساويتان", "المعطيات غير كافية"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q43",
          prompt: "كم مجموع الأعداد الفردية من ١ إلى ١١؟",
          options: ["٤٥", "١١", "٦٦", "٣٦"],
          correctAnswer: 3,
        },
        {
          id: "mufakkir-q44",
          prompt: "يعمل العمال عدداً معيناً من الأيام بعدها يحصلون على يوم إجازة. العامل الأول: ٦ أيام، الثاني: ٥ أيام، الثالث: ٧ أيام. إذا كانت مدة الشهر ٣٠ يوماً، فكم يوم إجازة يستحقه العامل الثالث؟",
          options: ["٣", "٥", "٧", "٨"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q45",
          prompt: "٥ مربعات متطابقة ٤ لونهم أحمر ومربع لونه أسود إذا وضعت المربعات متلاصقة في صف واحد ما احتمال أن يقع المربع الأسود بين مربعين لونهما أحمر؟",
          options: ["١/٥", "٣/٥", "٢/٥", "١"],
          correctAnswer: 1,
        },
        {
          id: "mufakkir-q46",
          prompt: "يمثل الشكل التالي الأوزان بالكيلوجرام مجموعة من الطلاب في فصلين، كم عدد الطلاب الذين أوزانهم أعداد زوجية؟",
          options: ["١٥", "١٢", "١٠", "٩"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q47",
          prompt: "في الشكل المجاور إذا كانت مساحة النجمة تساوي ثلث مساحة الدائرة، ما أقرب قيمة لنسبة مساحة الشكل المظلل إلى الشكل كامل؟",
          options: ["٧٠", "٥٠", "٢٠", "٣٥"],
          correctAnswer: 0,
        },
        {
          id: "mufakkir-q48",
          prompt: "الجدول التالي يمثل عدد مشاركات الطلاب في الأنشطة المدرسية (١٣ طالب: ١٦ مشاركة، ١٤ طالب: ٢٤ مشاركة، ١٥ طالب: ١٠ مشاركات)، كم عدد المشاركات المدرسية للطلاب الذين لا يزيد عددهم عن ١٤؟",
          options: ["١٠", "١٦", "٢٤", "٤٠"],
          correctAnswer: 3,
        },
          ],
        },
        {
          id: "bank-49",
          name: "الإصدار ٤٩",
          questions: [
            {
              id: "b49-q1",
              prompt: "إذا كان س + ص = ١٠ و س - ص = ٤، فما قيمة س؟",
              options: ["٣", "٥", "٧", "٩"],
              correctAnswer: 2,
            },
            {
              id: "b49-q2",
              prompt: "ما ناتج ٢٥ × ٤؟",
              options: ["٨٠", "٩٠", "١٠٠", "١١٠"],
              correctAnswer: 2,
            },
            {
              id: "b49-q3",
              prompt: "إذا كانت نسبة الأولاد إلى البنات ٣:٢ وكان عدد الأولاد ١٥، فكم عدد البنات؟",
              options: ["٨", "١٠", "١٢", "١٤"],
              correctAnswer: 1,
            },
          ],
        },
        {
          id: "bank-48",
          name: "الإصدار ٤٨",
          questions: [
            {
              id: "b48-q1",
              prompt: "ما قيمة ٣² + ٤²؟",
              options: ["٧", "١٢", "٢٥", "٤٩"],
              correctAnswer: 2,
            },
            {
              id: "b48-q2",
              prompt: "إذا كان ثمن ٥ أقلام ٢٠ ريال، فكم ثمن ٨ أقلام؟",
              options: ["٢٤", "٢٨", "٣٢", "٣٦"],
              correctAnswer: 2,
            },
            {
              id: "b48-q3",
              prompt: "ما العدد الذي إذا أضفنا إليه ٧ حصلنا على ١٥؟",
              options: ["٦", "٧", "٨", "٩"],
              correctAnswer: 2,
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
  "verbal": "اللفظي - استيعاب",
  "analogy": "اللفظي - تناظر",
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
  const exercises = getExercisesByCategory(category);

  // Get pinned collections for quantitative or verbal main categories
  const getCollectionsForCategory = () => {
    if (category === "all-math" || category === "quantitative" || category === "algebra") {
      return pinnedCollections.quantitative;
    }
    if (category === "all-verbal" || category === "verbal" || category === "analogy") {
      return pinnedCollections.verbal;
    }
    return [];
  };

  const collections = getCollectionsForCategory();

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

      {/* Category Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold">{categoryNames[category] || category}</h2>
          <p className="text-sm text-muted-foreground">{exercises.length} تمارين متاحة</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info className="w-4 h-4" />
            معلومات الوحدة
          </motion.button>

          {exercises.length > 0 && (
            <motion.button
              onClick={() => onExerciseClick(exercises[0])}
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4 fill-current" />
              ابدأ التمارين
            </motion.button>
          )}
        </div>
      </motion.div>

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

            {/* Play Overlay */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <Play className="w-4 h-4 fill-current" />
                <span>ابدأ التمرين</span>
              </div>
            </div>
          </motion.div>
        ))}

        {exercises.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد تمارين في هذا القسم حالياً</p>
            <p className="text-sm">سيتم إضافة تمارين جديدة قريباً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonGrid;
