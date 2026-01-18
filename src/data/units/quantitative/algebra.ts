import { LearningUnit } from "@/types/units";

export const algebraUnit: LearningUnit = {
  id: "quant-algebra",
  slug: "algebra",
  title: "الجبر",
  description: "المعادلات والمتغيرات والتعبيرات الجبرية",
  category: "quantitative",
  topic: "algebra",
  icon: "Variable",
  color: "coral",
  order: 2,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-algebra",
    title: "أساسيات الجبر",
    description: "تعلم أساسيات التعامل مع المعادلات والمتغيرات",
    duration: "٥ دقائق",
    contents: [
      {
        id: "alg-c1",
        type: "text",
        title: "ما هو الجبر؟",
        content: "الجبر هو فرع من الرياضيات يستخدم الرموز والحروف لتمثيل الأعداد والكميات في المعادلات والصيغ. يساعدنا في حل المسائل التي تحتوي على قيم مجهولة."
      },
      {
        id: "alg-c2",
        type: "formula",
        title: "قواعد أساسية",
        content: "• جمع الحدود المتشابهة: ٣س + ٢س = ٥س\n• ضرب الأقواس: ٢(س + ٣) = ٢س + ٦\n• فك الأقواس: (أ + ب)² = أ² + ٢أب + ب²"
      },
      {
        id: "alg-c3",
        type: "example",
        title: "حل معادلة من الدرجة الأولى",
        content: "خطوات حل المعادلات البسيطة",
        example: {
          problem: "٣س + ٥ = ١٧، جد قيمة س",
          steps: [
            "انقل ٥ للطرف الآخر: ٣س = ١٧ - ٥",
            "بسّط: ٣س = ١٢",
            "اقسم على ٣: س = ٤"
          ],
          solution: "س = ٤"
        }
      },
      {
        id: "alg-c4",
        type: "tip",
        title: "نصيحة مهمة",
        content: "عند حل المعادلات، ما تفعله في طرف يجب أن تفعله في الطرف الآخر للحفاظ على التوازن."
      }
    ],
    keyPoints: [
      "الحدود المتشابهة لها نفس المتغير ونفس الأس",
      "لحل معادلة، اعزل المتغير في طرف واحد",
      "تحقق من إجابتك بالتعويض في المعادلة الأصلية",
      "فرق المربعين: أ² - ب² = (أ+ب)(أ-ب)"
    ]
  },

  exerciseSets: [
    {
      id: "algebra-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "alg-e1",
          prompt: "إذا كان س + ٧ = ١٢، فما قيمة س؟",
          options: ["٣", "٤", "٥", "٦"],
          correctAnswer: 2,
          explanation: "س = ١٢ - ٧ = ٥",
          hint: "انقل ٧ للطرف الآخر بتغيير إشارته",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "alg-e2",
          prompt: "ما قيمة: ٢س + ٣س؟",
          options: ["٥س", "٦س", "٥س²", "٦س²"],
          correctAnswer: 0,
          explanation: "٢س + ٣س = ٥س (جمع الحدود المتشابهة)",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "alg-e3",
          prompt: "إذا كان ٢س = ١٠، فما قيمة س؟",
          options: ["٣", "٤", "٥", "٦"],
          correctAnswer: 2,
          explanation: "س = ١٠ ÷ ٢ = ٥",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "alg-e4",
          prompt: "ما ناتج: ٣(س + ٢)؟",
          options: ["٣س + ٢", "٣س + ٥", "٣س + ٦", "٥س"],
          correctAnswer: 2,
          explanation: "٣(س + ٢) = ٣×س + ٣×٢ = ٣س + ٦",
          hint: "وزّع ٣ على الحدين داخل القوس",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "alg-e5",
          prompt: "إذا كان س - ٤ = ٩، فما قيمة س؟",
          options: ["١١", "١٢", "١٣", "١٤"],
          correctAnswer: 2,
          explanation: "س = ٩ + ٤ = ١٣",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "algebra-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "alg-m1",
          prompt: "إذا كان ٣س - ٥ = ١٠، فما قيمة س؟",
          options: ["٣", "٤", "٥", "٦"],
          correctAnswer: 2,
          explanation: "٣س = ١٠ + ٥ = ١٥، إذن س = ٥",
          hint: "أولاً أضف ٥ للطرفين، ثم اقسم على ٣",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "alg-m2",
          prompt: "ما قيمة: (س + ٣)(س - ٣) إذا كان س = ٥؟",
          options: ["١٤", "١٥", "١٦", "١٧"],
          correctAnswer: 2,
          explanation: "(٥ + ٣)(٥ - ٣) = ٨ × ٢ = ١٦، أو باستخدام فرق المربعين: ٢٥ - ٩ = ١٦",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "alg-m3",
          prompt: "إذا كان ٢س + ٣ص = ١٢ و ص = ٢، فما قيمة س؟",
          options: ["٢", "٣", "٤", "٥"],
          correctAnswer: 1,
          explanation: "٢س + ٣(٢) = ١٢ ← ٢س + ٦ = ١٢ ← ٢س = ٦ ← س = ٣",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "alg-m4",
          prompt: "بسّط: ٤س² + ٣س - ٢س² + س",
          options: ["٢س² + ٤س", "٦س² + ٤س", "٢س² + ٢س", "٦س² + ٢س"],
          correctAnswer: 0,
          explanation: "(٤س² - ٢س²) + (٣س + س) = ٢س² + ٤س",
          hint: "اجمع الحدود المتشابهة معاً",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "alg-m5",
          prompt: "إذا كان (س + ٢)² = ٢٥، فما قيمة س الموجبة؟",
          options: ["٢", "٣", "٤", "٥"],
          correctAnswer: 1,
          explanation: "س + ٢ = ٥ (الجذر الموجب)، إذن س = ٣",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "algebra-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "alg-c1",
          prompt: "إذا كان س² - ٥س + ٦ = ٠، فما مجموع قيمتي س؟",
          options: ["٣", "٤", "٥", "٦"],
          correctAnswer: 2,
          explanation: "(س - ٢)(س - ٣) = ٠، إذن س = ٢ أو س = ٣، والمجموع = ٥",
          hint: "حلل المعادلة إلى عوامل أو استخدم قانون مجموع الجذور = -ب/أ",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "alg-c2",
          prompt: "إذا كان ٢^س = ٨، فما قيمة ٢^(س+٢)؟",
          options: ["١٦", "٣٢", "٦٤", "١٢٨"],
          correctAnswer: 1,
          explanation: "٢^س = ٨ = ٢³، إذن س = ٣. ٢^(٣+٢) = ٢^٥ = ٣٢",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "alg-c3",
          prompt: "إذا كان (أ + ب) = ٧ و (أ × ب) = ١٠، فما قيمة أ² + ب²؟",
          options: ["٢٧", "٢٩", "٣١", "٣٣"],
          correctAnswer: 1,
          explanation: "أ² + ب² = (أ + ب)² - ٢أب = ٤٩ - ٢٠ = ٢٩",
          hint: "استخدم المتطابقة: (أ + ب)² = أ² + ٢أب + ب²",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "alg-c4",
          prompt: "إذا كان ٣س + ٢ = ص و ص = ١٤، فما قيمة ٦س + ٤؟",
          options: ["٢٤", "٢٦", "٢٨", "٣٠"],
          correctAnswer: 2,
          explanation: "٦س + ٤ = ٢(٣س + ٢) = ٢ص = ٢ × ١٤ = ٢٨",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "alg-c5",
          prompt: "إذا كانت ٣^(٢س) = ٨١، فما قيمة ٣^س؟",
          options: ["٣", "٦", "٩", "١٢"],
          correctAnswer: 2,
          explanation: "٣^(٢س) = ٨١ = ٣⁴، إذن ٢س = ٤ وس = ٢. ٣^٢ = ٩",
          hint: "لاحظ أن ٣^(٢س) = (٣^س)²",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
