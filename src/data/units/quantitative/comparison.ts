import { LearningUnit } from "@/types/units";

export const comparisonUnit: LearningUnit = {
  id: "quant-comparison",
  slug: "comparison",
  title: "المقارنة والتحليل",
  description: "مقارنة الكميات والنسب والتحليل الكمي",
  category: "quantitative",
  topic: "comparison",
  icon: "Scale",
  color: "lavender",
  order: 5,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-comparison",
    title: "أساسيات المقارنة والتحليل",
    description: "تعلم كيفية مقارنة الكميات وتحليل العلاقات",
    duration: "٥ دقائق",
    contents: [
      {
        id: "comp-c1",
        type: "text",
        title: "أسئلة المقارنة",
        content: "في أسئلة المقارنة، تُعطى كميتين ويُطلب منك تحديد أيهما أكبر، أو هل هما متساويتان، أو لا يمكن التحديد. هذا النوع شائع جداً في اختبار القدرات."
      },
      {
        id: "comp-c2",
        type: "formula",
        title: "النسب والتناسب",
        content: "• النسبة: أ : ب تعني أ/ب\n• التناسب: أ/ب = ج/د\n• إذا أ : ب = ج : د، فإن أ × د = ب × ج (الضرب التبادلي)"
      },
      {
        id: "comp-c3",
        type: "example",
        title: "مقارنة كسور",
        content: "مقارنة كسرين مختلفي المقام",
        example: {
          problem: "قارن بين ٣/٤ و ٥/٧",
          steps: [
            "وحّد المقامات: المضاعف المشترك = ٢٨",
            "٣/٤ = ٢١/٢٨",
            "٥/٧ = ٢٠/٢٨",
            "٢١/٢٨ > ٢٠/٢٨"
          ],
          solution: "٣/٤ > ٥/٧"
        }
      },
      {
        id: "comp-c4",
        type: "tip",
        title: "طريقة الضرب التبادلي",
        content: "لمقارنة أ/ب و ج/د بسرعة:\n• اضرب أ × د و ب × ج\n• إذا أ×د > ب×ج فإن أ/ب > ج/د\n\nمثال: ٣/٤ و ٥/٧\n٣×٧ = ٢١ و ٤×٥ = ٢٠\n٢١ > ٢٠، إذن ٣/٤ > ٥/٧"
      },
      {
        id: "comp-c5",
        type: "formula",
        title: "النسب المئوية",
        content: "• س٪ من ص = (س/١٠٠) × ص\n• الزيادة المئوية = (الفرق/القيمة الأصلية) × ١٠٠\n• النقصان المئوي = (الفرق/القيمة الأصلية) × ١٠٠"
      }
    ],
    keyPoints: [
      "في أسئلة المقارنة، جرب أرقاماً محددة إذا كانت المتغيرات موجودة",
      "استخدم الضرب التبادلي لمقارنة الكسور بسرعة",
      "تذكر أن الضرب في عدد سالب يعكس إشارة المقارنة",
      "في بعض الأحيان الإجابة هي 'لا يمكن التحديد'"
    ]
  },

  exerciseSets: [
    {
      id: "comparison-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "comp-e1",
          prompt: "قارن: الكمية الأولى: ٣/٥ | الكمية الثانية: ١/٢",
          options: ["الأولى أكبر", "الثانية أكبر", "متساويتان", "لا يمكن التحديد"],
          correctAnswer: 0,
          explanation: "٣/٥ = ٠٫٦ و ١/٢ = ٠٫٥، إذن ٣/٥ > ١/٢",
          hint: "حوّل الكسرين إلى أعداد عشرية أو وحّد المقامات",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "comp-e2",
          prompt: "إذا كانت نسبة الأولاد إلى البنات ٣ : ٢، وكان عدد الأولاد ١٥، فما عدد البنات؟",
          options: ["٨", "١٠", "١٢", "٢٠"],
          correctAnswer: 1,
          explanation: "٣/٢ = ١٥/س، إذن ٣س = ٣٠، س = ١٠",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "comp-e3",
          prompt: "ما قيمة ٢٠٪ من ٥٠؟",
          options: ["٥", "١٠", "١٥", "٢٥"],
          correctAnswer: 1,
          explanation: "٢٠٪ من ٥٠ = (٢٠/١٠٠) × ٥٠ = ١٠",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "comp-e4",
          prompt: "قارن: الكمية الأولى: ٠٫٢٥ | الكمية الثانية: ١/٤",
          options: ["الأولى أكبر", "الثانية أكبر", "متساويتان", "لا يمكن التحديد"],
          correctAnswer: 2,
          explanation: "١/٤ = ٠٫٢٥، إذن الكميتان متساويتان",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "comp-e5",
          prompt: "إذا كان أ : ب = ٢ : ٣ و ب = ٩، فما قيمة أ؟",
          options: ["٤", "٥", "٦", "٧"],
          correctAnswer: 2,
          explanation: "أ/٩ = ٢/٣، إذن ٣أ = ١٨، أ = ٦",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "comparison-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "comp-m1",
          prompt: "قارن: الكمية الأولى: (-٣)² | الكمية الثانية: -٣²",
          options: ["الأولى أكبر", "الثانية أكبر", "متساويتان", "لا يمكن التحديد"],
          correctAnswer: 0,
          explanation: "(-٣)² = ٩ و -٣² = -(٣²) = -٩. إذن ٩ > -٩",
          hint: "انتبه للفرق بين تربيع العدد السالب وسالب مربع العدد",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "comp-m2",
          prompt: "زاد سعر منتج من ٨٠ ريال إلى ١٠٠ ريال، ما نسبة الزيادة المئوية؟",
          options: ["٢٠٪", "٢٥٪", "٣٠٪", "٨٠٪"],
          correctAnswer: 1,
          explanation: "الفرق = ٢٠، نسبة الزيادة = (٢٠/٨٠) × ١٠٠ = ٢٥٪",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "comp-m3",
          prompt: "إذا كان س > ٠، قارن: الكمية الأولى: س² | الكمية الثانية: س³",
          options: ["الأولى أكبر", "الثانية أكبر", "متساويتان", "لا يمكن التحديد"],
          correctAnswer: 3,
          explanation: "إذا س = ٢: س² = ٤، س³ = ٨ (الثانية أكبر). إذا س = ½: س² = ¼، س³ = ⅛ (الأولى أكبر). لا يمكن التحديد.",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "comp-m4",
          prompt: "نسبة أ إلى ب هي ٤ : ٥، ونسبة ب إلى ج هي ٢ : ٣، ما نسبة أ إلى ج؟",
          options: ["٤ : ٦", "٨ : ١٥", "٤ : ١٥", "٨ : ٦"],
          correctAnswer: 1,
          explanation: "أ : ب = ٤ : ٥ = ٨ : ١٠، ب : ج = ٢ : ٣ = ١٠ : ١٥. إذن أ : ج = ٨ : ١٥",
          hint: "اجعل قيمة ب متساوية في النسبتين",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "comp-m5",
          prompt: "إذا كان ٤٠٪ من س = ٢٠، فما قيمة س؟",
          options: ["٤٠", "٥٠", "٦٠", "٨٠"],
          correctAnswer: 1,
          explanation: "(٤٠/١٠٠) × س = ٢٠، س = ٢٠ × (١٠٠/٤٠) = ٥٠",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "comparison-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "comp-c1",
          prompt: "إذا كان أ > ب > ٠، قارن: الكمية الأولى: أ/ب | الكمية الثانية: (أ+١)/(ب+١)",
          options: ["الأولى أكبر", "الثانية أكبر", "متساويتان", "لا يمكن التحديد"],
          correctAnswer: 0,
          explanation: "عند إضافة نفس العدد للبسط والمقام، النسبة تقترب من ١. بما أن أ/ب > ١، فإن (أ+١)/(ب+١) أقرب لـ ١ وبالتالي أصغر.",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "comp-c2",
          prompt: "سعر منتج بعد خصم ٢٠٪ أصبح ١٦٠ ريال، ما السعر الأصلي؟",
          options: ["١٨٠", "١٩٢", "٢٠٠", "٢١٠"],
          correctAnswer: 2,
          explanation: "٨٠٪ من السعر الأصلي = ١٦٠، السعر الأصلي = ١٦٠ ÷ ٠٫٨ = ٢٠٠",
          hint: "بعد خصم ٢٠٪، يتبقى ٨٠٪ من السعر",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "comp-c3",
          prompt: "خُلط محلولان: الأول ٢٠٪ ملح والثاني ٥٠٪ ملح بنسبة ٣ : ١. ما نسبة الملح في الخليط؟",
          options: ["٢٧٫٥٪", "٣٠٪", "٣٢٫٥٪", "٣٥٪"],
          correctAnswer: 0,
          explanation: "نسبة الملح = (٣×٢٠ + ١×٥٠) ÷ ٤ = (٦٠ + ٥٠) ÷ ٤ = ١١٠ ÷ ٤ = ٢٧٫٥٪",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "comp-c4",
          prompt: "قارن: الكمية الأولى: √(٤٩ + ٤٩) | الكمية الثانية: √٤٩ + √٤٩",
          options: ["الأولى أكبر", "الثانية أكبر", "متساويتان", "لا يمكن التحديد"],
          correctAnswer: 1,
          explanation: "√(٤٩ + ٤٩) = √٩٨ ≈ ٩٫٩، بينما √٤٩ + √٤٩ = ٧ + ٧ = ١٤. الثانية أكبر.",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "comp-c5",
          prompt: "إذا زاد عدد بنسبة ٢٥٪ ثم نقص الناتج بنسبة ٢٠٪، ما التغير النهائي؟",
          options: ["زيادة ٥٪", "نقص ٥٪", "لا تغيير", "زيادة ٤٪"],
          correctAnswer: 2,
          explanation: "لنفرض العدد = ١٠٠. بعد الزيادة: ١٢٥. بعد النقص: ١٢٥ × ٠٫٨ = ١٠٠. لا تغيير!",
          hint: "جرب العدد ١٠٠ لتسهيل الحساب",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
