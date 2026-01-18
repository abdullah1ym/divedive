import { LearningUnit } from "@/types/units";

export const geometryUnit: LearningUnit = {
  id: "quant-geometry",
  slug: "geometry",
  title: "الهندسة",
  description: "الأشكال الهندسية والزوايا والمساحات والمحيطات",
  category: "quantitative",
  topic: "geometry",
  icon: "Shapes",
  color: "mint",
  order: 3,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-geometry",
    title: "أساسيات الهندسة",
    description: "تعلم الأشكال الهندسية وخصائصها",
    duration: "٥ دقائق",
    contents: [
      {
        id: "geo-c1",
        type: "text",
        title: "الأشكال الهندسية الأساسية",
        content: "الأشكال الهندسية تشمل المثلثات، المربعات، المستطيلات، الدوائر، وغيرها. لكل شكل خصائص مميزة من حيث الأضلاع والزوايا."
      },
      {
        id: "geo-c2",
        type: "formula",
        title: "قوانين المساحة",
        content: "• مساحة المربع = الضلع²\n• مساحة المستطيل = الطول × العرض\n• مساحة المثلث = ½ × القاعدة × الارتفاع\n• مساحة الدائرة = π × نق²"
      },
      {
        id: "geo-c3",
        type: "formula",
        title: "قوانين المحيط",
        content: "• محيط المربع = ٤ × الضلع\n• محيط المستطيل = ٢(الطول + العرض)\n• محيط الدائرة = ٢ × π × نق"
      },
      {
        id: "geo-c4",
        type: "example",
        title: "حساب مساحة مثلث",
        content: "تطبيق قانون مساحة المثلث",
        example: {
          problem: "مثلث قاعدته ٨ سم وارتفاعه ٦ سم، ما مساحته؟",
          steps: [
            "المساحة = ½ × القاعدة × الارتفاع",
            "المساحة = ½ × ٨ × ٦",
            "المساحة = ½ × ٤٨ = ٢٤ سم²"
          ],
          solution: "٢٤ سم²"
        }
      },
      {
        id: "geo-c5",
        type: "tip",
        title: "زوايا المثلث",
        content: "مجموع زوايا أي مثلث = ١٨٠°\nمجموع زوايا أي مربع أو مستطيل = ٣٦٠°"
      }
    ],
    keyPoints: [
      "احفظ قوانين المساحة والمحيط الأساسية",
      "مجموع زوايا المثلث = ١٨٠°",
      "في المثلث القائم: أ² + ب² = ج² (نظرية فيثاغورس)",
      "قطر المربع = الضلع × √٢"
    ]
  },

  exerciseSets: [
    {
      id: "geometry-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "geo-e1",
          prompt: "ما مساحة مربع طول ضلعه ٥ سم؟",
          options: ["٢٠ سم²", "٢٥ سم²", "١٠ سم²", "١٥ سم²"],
          correctAnswer: 1,
          explanation: "مساحة المربع = الضلع² = ٥² = ٢٥ سم²",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "geo-e2",
          prompt: "ما محيط مستطيل طوله ٦ سم وعرضه ٤ سم؟",
          options: ["١٠ سم", "٢٠ سم", "٢٤ سم", "١٤ سم"],
          correctAnswer: 1,
          explanation: "محيط المستطيل = ٢(الطول + العرض) = ٢(٦ + ٤) = ٢٠ سم",
          hint: "المحيط هو مجموع أطوال جميع الأضلاع",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "geo-e3",
          prompt: "مثلث فيه زاويتان قياسهما ٦٠° و ٥٠°، ما قياس الزاوية الثالثة؟",
          options: ["٦٠°", "٧٠°", "٨٠°", "٩٠°"],
          correctAnswer: 1,
          explanation: "الزاوية الثالثة = ١٨٠ - ٦٠ - ٥٠ = ٧٠°",
          hint: "مجموع زوايا المثلث = ١٨٠°",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "geo-e4",
          prompt: "ما مساحة مستطيل طوله ٧ سم وعرضه ٣ سم؟",
          options: ["١٠ سم²", "٢٠ سم²", "٢١ سم²", "٢٤ سم²"],
          correctAnswer: 2,
          explanation: "مساحة المستطيل = الطول × العرض = ٧ × ٣ = ٢١ سم²",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "geo-e5",
          prompt: "ما محيط مربع طول ضلعه ٨ سم؟",
          options: ["١٦ سم", "٢٤ سم", "٣٢ سم", "٦٤ سم"],
          correctAnswer: 2,
          explanation: "محيط المربع = ٤ × الضلع = ٤ × ٨ = ٣٢ سم",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "geometry-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "geo-m1",
          prompt: "ما مساحة مثلث قاعدته ١٠ سم وارتفاعه ٨ سم؟",
          options: ["٣٠ سم²", "٤٠ سم²", "٨٠ سم²", "١٨ سم²"],
          correctAnswer: 1,
          explanation: "مساحة المثلث = ½ × القاعدة × الارتفاع = ½ × ١٠ × ٨ = ٤٠ سم²",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "geo-m2",
          prompt: "إذا كان محيط مربع ٣٦ سم، فما مساحته؟",
          options: ["٦٤ سم²", "٧٢ سم²", "٨١ سم²", "٩ سم²"],
          correctAnswer: 2,
          explanation: "الضلع = ٣٦ ÷ ٤ = ٩ سم، المساحة = ٩² = ٨١ سم²",
          hint: "أولاً جد طول الضلع من المحيط",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "geo-m3",
          prompt: "مثلث قائم الزاوية، ضلعاه القائمان ٣ سم و ٤ سم، ما طول الوتر؟",
          options: ["٥ سم", "٦ سم", "٧ سم", "٨ سم"],
          correctAnswer: 0,
          explanation: "الوتر² = ٣² + ٤² = ٩ + ١٦ = ٢٥، الوتر = ٥ سم",
          hint: "استخدم نظرية فيثاغورس",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "geo-m4",
          prompt: "دائرة نصف قطرها ٧ سم، ما محيطها تقريباً؟ (π = ٢٢/٧)",
          options: ["٢٢ سم", "٤٤ سم", "١٥٤ سم", "٣٨٫٥ سم"],
          correctAnswer: 1,
          explanation: "محيط الدائرة = ٢ × π × نق = ٢ × ٢٢/٧ × ٧ = ٤٤ سم",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "geo-m5",
          prompt: "مستطيل مساحته ٤٨ سم² وطوله ٨ سم، ما عرضه؟",
          options: ["٤ سم", "٥ سم", "٦ سم", "٧ سم"],
          correctAnswer: 2,
          explanation: "العرض = المساحة ÷ الطول = ٤٨ ÷ ٨ = ٦ سم",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "geometry-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "geo-c1",
          prompt: "إذا تضاعف طول ضلع مربع، فإن مساحته تصبح:",
          options: ["ضعف المساحة الأصلية", "٣ أضعاف", "٤ أضعاف", "٨ أضعاف"],
          correctAnswer: 2,
          explanation: "إذا الضلع أصبح ٢ض، المساحة = (٢ض)² = ٤ض²، أي ٤ أضعاف",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "geo-c2",
          prompt: "مثلث متساوي الأضلاع محيطه ٢٤ سم، ما طول ضلعه؟",
          options: ["٦ سم", "٧ سم", "٨ سم", "١٢ سم"],
          correctAnswer: 2,
          explanation: "في المثلث متساوي الأضلاع، الأضلاع الثلاثة متساوية، الضلع = ٢٤ ÷ ٣ = ٨ سم",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "geo-c3",
          prompt: "دائرة مساحتها ١٥٤ سم²، ما نصف قطرها؟ (π = ٢٢/٧)",
          options: ["٥ سم", "٦ سم", "٧ سم", "٨ سم"],
          correctAnswer: 2,
          explanation: "نق² = المساحة ÷ π = ١٥٤ ÷ (٢٢/٧) = ١٥٤ × ٧/٢٢ = ٤٩، نق = ٧ سم",
          hint: "مساحة الدائرة = π × نق²",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "geo-c4",
          prompt: "مستطيل محيطه ٣٠ سم وطوله يزيد عن عرضه بـ ٣ سم، ما مساحته؟",
          options: ["٤٥ سم²", "٥٠ سم²", "٥٤ سم²", "٦٠ سم²"],
          correctAnswer: 2,
          explanation: "٢(ط + ع) = ٣٠، ط + ع = ١٥، وط = ع + ٣. بالتعويض: ٢ع + ٣ = ١٥، ع = ٦، ط = ٩. المساحة = ٩ × ٦ = ٥٤ سم²",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "geo-c5",
          prompt: "مثلث قائم وتره ١٣ سم وأحد ضلعيه القائمين ٥ سم، ما مساحته؟",
          options: ["٢٥ سم²", "٣٠ سم²", "٦٠ سم²", "٦٥ سم²"],
          correctAnswer: 1,
          explanation: "الضلع الآخر² = ١٣² - ٥² = ١٦٩ - ٢٥ = ١٤٤، الضلع = ١٢. المساحة = ½ × ٥ × ١٢ = ٣٠ سم²",
          hint: "استخدم فيثاغورس لإيجاد الضلع الثالث",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
