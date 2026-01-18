import { LearningUnit } from "@/types/units";

export const vocabularyUnit: LearningUnit = {
  id: "verbal-vocabulary",
  slug: "vocabulary",
  title: "المفردات والمعاني",
  description: "معاني الكلمات والمترادفات والمتضادات",
  category: "verbal",
  topic: "vocabulary",
  icon: "BookA",
  color: "lavender",
  order: 5,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-vocabulary",
    title: "أساسيات المفردات والمعاني",
    description: "تعلم كيفية فهم معاني الكلمات",
    duration: "٤ دقائق",
    contents: [
      {
        id: "voc-c1",
        type: "text",
        title: "أهمية المفردات",
        content: "المفردات هي أساس اللغة. كلما زادت حصيلتك من المفردات، زادت قدرتك على الفهم والتعبير. في اختبار القدرات، تُسأل عن معاني الكلمات، مترادفاتها، ومتضاداتها."
      },
      {
        id: "voc-c2",
        type: "formula",
        title: "أنواع الأسئلة",
        content: "• معنى الكلمة: ما معنى \"الجَلَد\"؟ → الصبر والتحمل\n• المرادف: مرادف \"السُّرور\": الفرح\n• المتضاد: ضد \"الكرم\": البخل\n• الكلمة الشاذة: أي كلمة لا تنتمي للمجموعة"
      },
      {
        id: "voc-c3",
        type: "tip",
        title: "استراتيجيات تعلم المفردات",
        content: "• اربط الكلمة الجديدة بكلمة تعرفها\n• استخدم الكلمة في جملة\n• تعلم الكلمة مع مرادفها وضدها\n• اقرأ كثيراً لتتعرض لكلمات جديدة في سياقات مختلفة"
      },
      {
        id: "voc-c4",
        type: "text",
        title: "الجذور والاشتقاق",
        content: "كثير من الكلمات العربية تشترك في نفس الجذر:\n• كَتَبَ، كاتِب، كِتاب، مكتوب، مكتبة (جذر: ك-ت-ب)\n• عَلِمَ، عالِم، عِلم، معلوم، تعليم (جذر: ع-ل-م)\n\nمعرفة الجذر يساعد في فهم الكلمات المشتقة."
      }
    ],
    keyPoints: [
      "السياق يساعد في فهم معنى الكلمة",
      "تعلم الكلمة مع مرادفها وضدها",
      "الجذر اللغوي يربط بين الكلمات المتشابهة",
      "اقرأ بانتظام لزيادة حصيلتك اللغوية"
    ]
  },

  exerciseSets: [
    {
      id: "vocabulary-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "voc-e1",
          prompt: "ما مرادف كلمة \"السرور\"؟",
          options: ["الحزن", "الفرح", "الغضب", "الخوف"],
          correctAnswer: 1,
          explanation: "السرور والفرح كلمتان مترادفتان تعبران عن الشعور بالسعادة",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "voc-e2",
          prompt: "ما ضد كلمة \"الشجاعة\"؟",
          options: ["القوة", "الجُبن", "الكرم", "الصبر"],
          correctAnswer: 1,
          explanation: "الجُبن هو عكس الشجاعة",
          hint: "ابحث عن الكلمة التي تعني عدم الإقدام والخوف",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "voc-e3",
          prompt: "ما معنى كلمة \"الوفير\"؟",
          options: ["القليل", "الكثير", "الجميل", "السريع"],
          correctAnswer: 1,
          explanation: "الوفير يعني الكثير أو الغزير",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "voc-e4",
          prompt: "ما مرادف كلمة \"يسير\"؟",
          options: ["صعب", "سهل", "بعيد", "طويل"],
          correctAnswer: 1,
          explanation: "يسير تعني سهل وبسيط",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "voc-e5",
          prompt: "ما ضد كلمة \"النجاح\"؟",
          options: ["التفوق", "الفشل", "التميز", "الإنجاز"],
          correctAnswer: 1,
          explanation: "الفشل هو عكس النجاح",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "vocabulary-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "voc-m1",
          prompt: "ما معنى كلمة \"التَّقِيّة\"؟",
          options: ["الخداع والمكر", "إخفاء العقيدة عند الخوف", "الكذب المستمر", "الصدق الدائم"],
          correctAnswer: 1,
          explanation: "التقية هي إخفاء المعتقد أو الرأي عند الخوف من الأذى",
          hint: "الكلمة من \"وقى\" أي حمى نفسه",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "voc-m2",
          prompt: "ما مرادف كلمة \"الحصيف\"؟",
          options: ["الغبي", "العاقل الرزين", "السريع", "البطيء"],
          correctAnswer: 1,
          explanation: "الحصيف هو العاقل الرزين ذو الرأي السديد",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "voc-m3",
          prompt: "أي كلمة لا تنتمي للمجموعة؟",
          options: ["سعيد", "مسرور", "فرِح", "حزين"],
          correctAnswer: 3,
          explanation: "حزين هي الكلمة الشاذة لأنها عكس معنى بقية الكلمات (السعادة)",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "voc-m4",
          prompt: "ما معنى كلمة \"الجَلَد\"؟",
          options: ["الجلد (البشرة)", "الصبر والتحمل", "القسوة", "السرعة"],
          correctAnswer: 1,
          explanation: "الجَلَد يعني الصبر والقدرة على التحمل",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "voc-m5",
          prompt: "ما ضد كلمة \"الوَجْل\"؟",
          options: ["الخوف", "الأمان والطمأنينة", "الفرح", "الحزن"],
          correctAnswer: 1,
          explanation: "الوَجْل يعني الخوف والفزع، وضده الأمان والطمأنينة",
          hint: "الوجل من الخوف والقلق",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "vocabulary-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "voc-c1",
          prompt: "ما معنى كلمة \"النُّكوص\"؟",
          options: ["التقدم", "الرجوع والتراجع", "السكوت", "الصراخ"],
          correctAnswer: 1,
          explanation: "النكوص يعني الرجوع إلى الوراء أو التراجع عن الأمر",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "voc-c2",
          prompt: "ما مرادف كلمة \"الألمعي\"؟",
          options: ["البطيء الفهم", "الذكي الفطن", "الكسول", "القوي"],
          correctAnswer: 1,
          explanation: "الألمعي هو شديد الذكاء والفطنة",
          hint: "من اللمع وهو البريق والتوقد",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "voc-c3",
          prompt: "\"العُجاب\" تعني:",
          options: ["الشيء العادي", "الشيء العجيب جداً", "الشخص المتكبر", "المكان البعيد"],
          correctAnswer: 1,
          explanation: "العُجاب صيغة مبالغة من العجيب، تعني الشيء شديد الغرابة",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "voc-c4",
          prompt: "ما ضد كلمة \"الإيجاز\"؟",
          options: ["الاختصار", "الإطناب", "الوضوح", "الغموض"],
          correctAnswer: 1,
          explanation: "الإيجاز هو الاختصار، وضده الإطناب وهو التطويل والإسهاب",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "voc-c5",
          prompt: "ما معنى كلمة \"الدَّعَة\"؟",
          options: ["العمل الشاق", "الراحة والسكون", "الضجيج", "السفر"],
          correctAnswer: 1,
          explanation: "الدَّعَة تعني الراحة والسكون والاستقرار",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
