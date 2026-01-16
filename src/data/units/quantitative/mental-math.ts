import { LearningUnit } from "@/types/units";

export const mentalMathUnit: LearningUnit = {
  id: "quant-mental-math",
  slug: "mental-math",
  title: "الحساب الذهني",
  description: "تقنيات سريعة للحساب بدون آلة حاسبة",
  category: "quantitative",
  topic: "arithmetic",
  icon: "Brain",
  color: "turquoise",
  order: 1,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-mental-math",
    title: "أساسيات الحساب الذهني",
    description: "تعلم التقنيات الأساسية للحساب السريع",
    duration: "٣ دقائق",
    contents: [
      {
        id: "c1",
        type: "text",
        title: "لماذا الحساب الذهني مهم؟",
        content: "في اختبار القدرات، الوقت ثمين. الحساب الذهني يوفر عليك وقت كبير ويزيد من دقة إجاباتك. بدل ما تكتب كل خطوة، تقدر تحل في ذهنك بسرعة."
      },
      {
        id: "c2",
        type: "tip",
        title: "قاعدة الضرب في ١١",
        content: "لضرب أي عدد من رقمين في ١١: اجمع الرقمين وضع الناتج بينهما.\n\nمثال: ٢٣ × ١١\n• اجمع: ٢ + ٣ = ٥\n• ضعه بالوسط: ٢٥٣\n\nالناتج: ٢٥٣"
      },
      {
        id: "c3",
        type: "example",
        title: "ضرب الأعداد القريبة من ١٠٠",
        content: "طريقة سريعة لضرب أعداد قريبة من ١٠٠",
        example: {
          problem: "٩٧ × ٩٦ = ؟",
          steps: [
            "احسب فرق كل عدد من ١٠٠: ٩٧ ← ٣، ٩٦ ← ٤",
            "اطرح أحد الفرقين من العدد الآخر: ٩٧ - ٤ = ٩٣",
            "اضرب الفرقين: ٣ × ٤ = ١٢",
            "الناتج: ٩٣١٢"
          ],
          solution: "٩٣١٢"
        }
      },
      {
        id: "c4",
        type: "tip",
        title: "الضرب في ٥",
        content: "لضرب أي عدد في ٥:\n• اقسم العدد على ٢\n• اضرب في ١٠\n\nمثال: ٤٨ × ٥\n• ٤٨ ÷ ٢ = ٢٤\n• ٢٤ × ١٠ = ٢٤٠"
      },
      {
        id: "c5",
        type: "formula",
        title: "مربع أي عدد ينتهي بـ ٥",
        content: "لتربيع عدد ينتهي بـ ٥:\n• اضرب الرقم الأول في (الرقم + ١)\n• أضف ٢٥ في النهاية\n\nمثال: ٣٥²\n• ٣ × ٤ = ١٢\n• أضف ٢٥: ١٢٢٥\n\nالناتج: ١٢٢٥"
      }
    ],
    keyPoints: [
      "استخدم خصائص الأعداد لتبسيط الحساب",
      "قرّب الأعداد ثم صحح الفرق",
      "قسّم الأعداد الكبيرة لأجزاء صغيرة",
      "احفظ مربعات الأعداد من ١ إلى ٢٠"
    ]
  },

  exerciseSets: [
    {
      id: "mental-math-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "mm-e1",
          prompt: "ما ناتج: ٢٥ × ٤ ؟",
          options: ["٨٠", "١٠٠", "٩٠", "١٢٠"],
          correctAnswer: 1,
          explanation: "٢٥ × ٤ = ١٠٠ (لأن ٤ أرباع = ١ صحيح، و٢٥ هو ربع المئة)",
          hint: "فكر: كم مرة ٢٥ تكوّن ١٠٠؟",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "mm-e2",
          prompt: "ما ناتج: ١٥ × ٦ ؟",
          options: ["٨٠", "٩٠", "٧٥", "١٠٠"],
          correctAnswer: 1,
          explanation: "١٥ × ٦ = ١٥ × ٢ × ٣ = ٣٠ × ٣ = ٩٠",
          hint: "قسّم ٦ إلى ٢ × ٣",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "mm-e3",
          prompt: "ما ناتج: ١٢ × ١١ ؟",
          options: ["١٢٢", "١٣٢", "١٤٢", "١٢١"],
          correctAnswer: 1,
          explanation: "١٢ × ١١: اجمع ١+٢=٣، ضعه بالوسط = ١٣٢",
          hint: "استخدم قاعدة الضرب في ١١",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "mm-e4",
          prompt: "ما ناتج: ٥٠ × ٨ ؟",
          options: ["٤٥٠", "٤٠٠", "٣٥٠", "٥٠٠"],
          correctAnswer: 1,
          explanation: "٥٠ × ٨ = ٥ × ٨ × ١٠ = ٤٠ × ١٠ = ٤٠٠",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "mm-e5",
          prompt: "ما ناتج: ٣٥² ؟",
          options: ["١٢٢٥", "١١٢٥", "١٣٢٥", "١٠٢٥"],
          correctAnswer: 0,
          explanation: "٣٥²: ٣×٤=١٢، أضف ٢٥ = ١٢٢٥",
          hint: "استخدم قاعدة تربيع الأعداد المنتهية بـ ٥",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "mental-math-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "mm-m1",
          prompt: "ما ناتج: ٩٩ × ٧ ؟",
          options: ["٦٩٣", "٧٠٣", "٦٨٣", "٧١٣"],
          correctAnswer: 0,
          explanation: "٩٩ × ٧ = (١٠٠-١) × ٧ = ٧٠٠ - ٧ = ٦٩٣",
          hint: "فكر في ٩٩ كـ (١٠٠ - ١)",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "mm-m2",
          prompt: "ما ناتج: ٤٥ × ١٢ ؟",
          options: ["٥٢٠", "٥٤٠", "٥٦٠", "٥٠٠"],
          correctAnswer: 1,
          explanation: "٤٥ × ١٢ = ٤٥ × ٤ × ٣ = ١٨٠ × ٣ = ٥٤٠",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "mm-m3",
          prompt: "ما ناتج: ٢٥ × ٢٤ ؟",
          options: ["٥٠٠", "٦٠٠", "٥٥٠", "٦٥٠"],
          correctAnswer: 1,
          explanation: "٢٥ × ٢٤ = ٢٥ × ٤ × ٦ = ١٠٠ × ٦ = ٦٠٠",
          hint: "٢٥ × ٤ = ١٠٠",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "mm-m4",
          prompt: "ما ناتج: ٦٥² ؟",
          options: ["٤٢٢٥", "٤١٢٥", "٤٣٢٥", "٤٠٢٥"],
          correctAnswer: 0,
          explanation: "٦٥²: ٦×٧=٤٢، أضف ٢٥ = ٤٢٢٥",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "mm-m5",
          prompt: "ما ناتج: ١٢٥ × ٨ ؟",
          options: ["٩٠٠", "١٠٠٠", "١١٠٠", "٨٠٠"],
          correctAnswer: 1,
          explanation: "١٢٥ × ٨ = ١٠٠٠ (لأن ١٢٥ = ١٠٠٠÷٨)",
          hint: "١٢٥ هو ثُمن الألف",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "mental-math-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "mm-c1",
          prompt: "إذا كان س × ص = ١٤٤ و س + ص = ٢٥، فما قيمة س² + ص²؟",
          options: ["٣٣٧", "٣٤٥", "٣٥٣", "٣٦١"],
          correctAnswer: 0,
          explanation: "س² + ص² = (س+ص)² - ٢(س×ص) = ٦٢٥ - ٢٨٨ = ٣٣٧",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "mm-c2",
          prompt: "ما قيمة: (٩٩)² - (٩٨)²؟",
          options: ["١٩٧", "١٩٨", "١٩٩", "٢٠٠"],
          correctAnswer: 0,
          explanation: "فرق مربعين: (٩٩+٩٨)(٩٩-٩٨) = ١٩٧ × ١ = ١٩٧",
          hint: "استخدم قانون فرق المربعين: أ² - ب² = (أ+ب)(أ-ب)",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "mm-c3",
          prompt: "إذا كان ٣س + ٢ = ٢٠، فما قيمة ٩س + ٦؟",
          options: ["٥٤", "٦٠", "٦٦", "٧٢"],
          correctAnswer: 1,
          explanation: "٩س + ٦ = ٣(٣س + ٢) = ٣ × ٢٠ = ٦٠",
          hint: "لاحظ أن ٩س + ٦ = ٣(٣س + ٢)",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "mm-c4",
          prompt: "ما الرقم الذي إذا ضُرب في ٦ ثم أُضيف إليه ١٢ كان الناتج ٤٨؟",
          options: ["٤", "٥", "٦", "٧"],
          correctAnswer: 2,
          explanation: "٦س + ١٢ = ٤٨ ← ٦س = ٣٦ ← س = ٦",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "mm-c5",
          prompt: "إذا كان ٢^١٠ = ١٠٢٤، فما قيمة ٢^١١؟",
          options: ["١٥٣٦", "٢٠٤٨", "٣٠٧٢", "٤٠٩٦"],
          correctAnswer: 1,
          explanation: "٢^١١ = ٢ × ٢^١٠ = ٢ × ١٠٢٤ = ٢٠٤٨",
          hint: "٢^١١ = ٢ × ٢^١٠",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
