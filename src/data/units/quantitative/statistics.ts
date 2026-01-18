import { LearningUnit } from "@/types/units";

export const statisticsUnit: LearningUnit = {
  id: "quant-statistics",
  slug: "statistics",
  title: "الإحصاء والاحتمالات",
  description: "المتوسط والوسيط والاحتمالات",
  category: "quantitative",
  topic: "statistics",
  icon: "BarChart3",
  color: "yellow",
  order: 4,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-statistics",
    title: "أساسيات الإحصاء والاحتمالات",
    description: "تعلم مقاييس النزعة المركزية والاحتمالات",
    duration: "٥ دقائق",
    contents: [
      {
        id: "stat-c1",
        type: "text",
        title: "ما هو الإحصاء؟",
        content: "الإحصاء هو علم جمع وتنظيم وتحليل البيانات. يساعدنا في فهم الأنماط واتخاذ القرارات بناءً على المعلومات المتاحة."
      },
      {
        id: "stat-c2",
        type: "formula",
        title: "مقاييس النزعة المركزية",
        content: "• المتوسط الحسابي = مجموع القيم ÷ عددها\n• الوسيط = القيمة في المنتصف بعد الترتيب\n• المنوال = القيمة الأكثر تكراراً"
      },
      {
        id: "stat-c3",
        type: "example",
        title: "حساب المتوسط",
        content: "إيجاد المتوسط الحسابي لمجموعة أرقام",
        example: {
          problem: "جد المتوسط الحسابي للأعداد: ٤، ٦، ٨، ١٠، ١٢",
          steps: [
            "المجموع = ٤ + ٦ + ٨ + ١٠ + ١٢ = ٤٠",
            "عدد القيم = ٥",
            "المتوسط = ٤٠ ÷ ٥ = ٨"
          ],
          solution: "المتوسط = ٨"
        }
      },
      {
        id: "stat-c4",
        type: "formula",
        title: "الاحتمالات",
        content: "احتمال وقوع حدث = عدد النتائج المطلوبة ÷ عدد النتائج الممكنة\n\nالاحتمال دائماً بين ٠ و ١ (أو ٠٪ و ١٠٠٪)"
      },
      {
        id: "stat-c5",
        type: "tip",
        title: "نصيحة للوسيط",
        content: "إذا كان عدد القيم فردياً: الوسيط هو القيمة الوسطى\nإذا كان زوجياً: الوسيط = متوسط القيمتين الوسطيتين"
      }
    ],
    keyPoints: [
      "المتوسط يتأثر بالقيم الشاذة، الوسيط لا يتأثر",
      "رتب البيانات قبل إيجاد الوسيط",
      "الاحتمال لا يمكن أن يكون سالباً أو أكبر من ١",
      "مجموع احتمالات جميع النتائج الممكنة = ١"
    ]
  },

  exerciseSets: [
    {
      id: "statistics-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "stat-e1",
          prompt: "ما المتوسط الحسابي للأعداد: ٥، ١٠، ١٥؟",
          options: ["٨", "٩", "١٠", "١١"],
          correctAnswer: 2,
          explanation: "المتوسط = (٥ + ١٠ + ١٥) ÷ ٣ = ٣٠ ÷ ٣ = ١٠",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "stat-e2",
          prompt: "ما الوسيط للأعداد: ٣، ٧، ٩، ١٢، ١٥؟",
          options: ["٧", "٩", "١٠", "١٢"],
          correctAnswer: 1,
          explanation: "الأعداد مرتبة، والوسيط هو القيمة في المنتصف = ٩",
          hint: "في ٥ قيم، الوسيط هو القيمة الثالثة",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "stat-e3",
          prompt: "عند رمي نرد (زهر)، ما احتمال ظهور الرقم ٤؟",
          options: ["١/٢", "١/٣", "١/٤", "١/٦"],
          correctAnswer: 3,
          explanation: "النرد له ٦ أوجه، واحتمال ظهور أي رقم = ١/٦",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "stat-e4",
          prompt: "ما المنوال للأعداد: ٢، ٣، ٣، ٤، ٥، ٣، ٧؟",
          options: ["٢", "٣", "٤", "٥"],
          correctAnswer: 1,
          explanation: "٣ هو الأكثر تكراراً (يظهر ٣ مرات)",
          hint: "المنوال هو القيمة الأكثر تكراراً",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "stat-e5",
          prompt: "في صندوق ٥ كرات حمراء و٣ كرات زرقاء، ما احتمال سحب كرة حمراء؟",
          options: ["٣/٨", "٥/٨", "١/٢", "٥/٣"],
          correctAnswer: 1,
          explanation: "احتمال الحمراء = ٥ ÷ ٨ = ٥/٨",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "statistics-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "stat-m1",
          prompt: "إذا كان متوسط ٤ أعداد هو ١٥، فما مجموعها؟",
          options: ["٤٥", "٥٠", "٦٠", "٧٥"],
          correctAnswer: 2,
          explanation: "المجموع = المتوسط × العدد = ١٥ × ٤ = ٦٠",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "stat-m2",
          prompt: "ما الوسيط للأعداد: ٤، ٧، ٢، ٩، ١١، ٣؟",
          options: ["٥", "٥٫٥", "٦", "٧"],
          correctAnswer: 1,
          explanation: "بعد الترتيب: ٢، ٣، ٤، ٧، ٩، ١١. الوسيط = (٤ + ٧) ÷ ٢ = ٥٫٥",
          hint: "رتب الأعداد أولاً، ثم جد متوسط القيمتين الوسطيتين",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "stat-m3",
          prompt: "رمي عملتين معاً، ما احتمال ظهور صورتين؟",
          options: ["١/٢", "١/٣", "١/٤", "٣/٤"],
          correctAnswer: 2,
          explanation: "النتائج الممكنة: صص، صك، كص، كك = ٤ نتائج. صورتان = نتيجة واحدة. الاحتمال = ١/٤",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "stat-m4",
          prompt: "إذا أضفنا العدد ٢٠ لمجموعة متوسطها ١٠ وعدد عناصرها ٤، ما المتوسط الجديد؟",
          options: ["١٠", "١١", "١٢", "١٥"],
          correctAnswer: 2,
          explanation: "المجموع القديم = ١٠ × ٤ = ٤٠. المجموع الجديد = ٤٠ + ٢٠ = ٦٠. المتوسط = ٦٠ ÷ ٥ = ١٢",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "stat-m5",
          prompt: "في نرد، ما احتمال ظهور عدد أكبر من ٤؟",
          options: ["١/٣", "١/٢", "٢/٣", "١/٦"],
          correctAnswer: 0,
          explanation: "الأعداد الأكبر من ٤ هي: ٥، ٦ (عددها ٢). الاحتمال = ٢/٦ = ١/٣",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "statistics-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "stat-c1",
          prompt: "إذا كان متوسط ٥ أعداد هو ١٢ ومتوسط ٣ أعداد أخرى هو ٨، ما متوسط الأعداد الثمانية؟",
          options: ["٩٫٥", "١٠", "١٠٫٥", "١١"],
          correctAnswer: 2,
          explanation: "مجموع الخمسة = ٦٠، مجموع الثلاثة = ٢٤. المتوسط الكلي = ٨٤ ÷ ٨ = ١٠٫٥",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "stat-c2",
          prompt: "عند رمي نردين، ما احتمال أن يكون مجموعهما ٧؟",
          options: ["١/٩", "١/٦", "٥/٣٦", "١/١٢"],
          correctAnswer: 1,
          explanation: "التوليفات التي تعطي ٧: (١،٦)، (٢،٥)، (٣،٤)، (٤،٣)، (٥،٢)، (٦،١) = ٦ من ٣٦ = ١/٦",
          hint: "عدد كل النتائج الممكنة = ٦ × ٦ = ٣٦",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "stat-c3",
          prompt: "مجموعة أعداد متوسطها ١٥ ووسيطها ١٤. إذا ضُرب كل عدد في ٢، ما المتوسط والوسيط الجديدان؟",
          options: ["٣٠، ٢٨", "٣٠، ١٤", "١٥، ٢٨", "١٧، ١٦"],
          correctAnswer: 0,
          explanation: "عند ضرب جميع القيم في عدد، المتوسط والوسيط يُضربان في نفس العدد. المتوسط = ٣٠، الوسيط = ٢٨",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "stat-c4",
          prompt: "صندوق به ٤ كرات بيضاء و٦ كرات سوداء. سُحبت كرة ولم تُرد، ما احتمال أن تكون الثانية بيضاء إذا كانت الأولى بيضاء؟",
          options: ["١/٣", "٣/٩", "٤/١٠", "٤/٩"],
          correctAnswer: 0,
          explanation: "بعد سحب كرة بيضاء: بقي ٣ بيضاء و٦ سوداء = ٩ كرات. الاحتمال = ٣/٩ = ١/٣",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "stat-c5",
          prompt: "درجات ٥ طلاب: ٧٠، ٧٥، ٨٠، ٨٥، س. إذا كان المتوسط ٨٠، فما قيمة س؟",
          options: ["٨٥", "٩٠", "٩٥", "١٠٠"],
          correctAnswer: 1,
          explanation: "المجموع = ٨٠ × ٥ = ٤٠٠. س = ٤٠٠ - (٧٠ + ٧٥ + ٨٠ + ٨٥) = ٤٠٠ - ٣١٠ = ٩٠",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
