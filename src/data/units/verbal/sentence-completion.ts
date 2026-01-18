import { LearningUnit } from "@/types/units";

export const sentenceCompletionUnit: LearningUnit = {
  id: "verbal-sentence-completion",
  slug: "sentence-completion",
  title: "إكمال الجمل",
  description: "إكمال الجمل الناقصة باختيار الكلمة المناسبة",
  category: "verbal",
  topic: "completion",
  icon: "PenLine",
  color: "mint",
  order: 2,
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

  foundationalLesson: {
    id: "lesson-sentence-completion",
    title: "أساسيات إكمال الجمل",
    description: "تعلم كيفية إكمال الجمل باختيار الكلمة الأنسب",
    duration: "٤ دقائق",
    contents: [
      {
        id: "sc-c1",
        type: "text",
        title: "ما هو إكمال الجمل؟",
        content: "إكمال الجمل يختبر قدرتك على فهم السياق واختيار الكلمة التي تكمل المعنى بشكل صحيح ومنطقي. يتطلب فهماً للعلاقات بين الكلمات والمعاني."
      },
      {
        id: "sc-c2",
        type: "tip",
        title: "استراتيجيات الحل",
        content: "• اقرأ الجملة كاملة أولاً\n• حدد نوع الكلمة المطلوبة (اسم، فعل، صفة)\n• انتبه للكلمات المفتاحية والروابط\n• جرب كل خيار في الفراغ\n• اختر الذي يعطي معنى متماسكاً"
      },
      {
        id: "sc-c3",
        type: "text",
        title: "كلمات الربط المهمة",
        content: "• كلمات التضاد: لكن، إلا أن، بالرغم من، على عكس\n• كلمات التشابه: كذلك، أيضاً، مثل، كما\n• كلمات السبب: لأن، بسبب، نتيجة\n• كلمات النتيجة: لذلك، إذن، وبالتالي"
      },
      {
        id: "sc-c4",
        type: "example",
        title: "مثال تطبيقي",
        content: "كيفية تحليل جملة إكمال",
        example: {
          problem: "الطالب المجتهد _______ النجاح دائماً.",
          steps: [
            "السياق: الطالب المجتهد → نتيجة إيجابية متوقعة",
            "نوع الكلمة: فعل مضارع",
            "المعنى المطلوب: تحقيق النجاح",
            "الخيارات: (يخاف - يحقق - يتجنب - يفقد)"
          ],
          solution: "يحقق"
        }
      }
    ],
    keyPoints: [
      "السياق هو المفتاح لاختيار الإجابة الصحيحة",
      "كلمات الربط تحدد العلاقة المطلوبة",
      "تأكد أن الجملة مفهومة ومنطقية بعد الإكمال",
      "لا تختر كلمة لمجرد أنك تعرفها"
    ]
  },

  exerciseSets: [
    {
      id: "sentence-completion-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "sc-e1",
          prompt: "الشمس _______ من الشرق كل يوم.",
          options: ["تغرب", "تشرق", "تختفي", "تسقط"],
          correctAnswer: 1,
          explanation: "الشمس تشرق (تطلع) من الشرق، وتغرب في الغرب",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "sc-e2",
          prompt: "القراءة تُنمّي _______ وتوسع المدارك.",
          options: ["الجهل", "الملل", "العقل", "النوم"],
          correctAnswer: 2,
          explanation: "القراءة تنمي العقل والمعرفة",
          hint: "ابحث عن كلمة إيجابية تناسب فائدة القراءة",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "sc-e3",
          prompt: "الطبيب يعالج _______ في المستشفى.",
          options: ["السيارات", "المرضى", "الكتب", "الأشجار"],
          correctAnswer: 1,
          explanation: "الطبيب يعالج المرضى",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "sc-e4",
          prompt: "الماء _______ للحياة على كوكب الأرض.",
          options: ["ضار", "مفيد", "ضروري", "غريب"],
          correctAnswer: 2,
          explanation: "الماء ضروري (أساسي ولا غنى عنه) للحياة",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "sc-e5",
          prompt: "في فصل الشتاء يكون الجو _______.",
          options: ["حاراً", "بارداً", "صيفياً", "ربيعياً"],
          correctAnswer: 1,
          explanation: "فصل الشتاء يتميز بالجو البارد",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "sentence-completion-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "sc-m1",
          prompt: "على الرغم من _______ الامتحان، إلا أن الطالب نجح بتفوق.",
          options: ["سهولة", "صعوبة", "جمال", "قصر"],
          correctAnswer: 1,
          explanation: "\"على الرغم من\" تدل على تناقض: صعوبة الامتحان تتناقض مع النجاح المتفوق",
          hint: "\"على الرغم من\" تشير إلى تضاد بين جزئي الجملة",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "sc-m2",
          prompt: "العالِم _______ يبحث عن الحقيقة مهما كانت التحديات.",
          options: ["المتردد", "الحقيقي", "الكسول", "الخائف"],
          correctAnswer: 1,
          explanation: "العالِم الحقيقي يبحث عن الحقيقة بإصرار",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "sc-m3",
          prompt: "بسبب الأمطار الغزيرة، _______ المباراة إلى الأسبوع القادم.",
          options: ["أُقيمت", "أُجّلت", "انتهت", "فازت"],
          correctAnswer: 1,
          explanation: "الأمطار سبب لتأجيل المباراة وليس إقامتها",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "sc-m4",
          prompt: "الصدق _______ بينما الكذب يُفقد الثقة.",
          options: ["يضر بالعلاقات", "يبني الثقة", "يسبب المشاكل", "يؤدي للفشل"],
          correctAnswer: 1,
          explanation: "\"بينما\" تدل على التضاد: الصدق عكس الكذب، فإذا الكذب يُفقد الثقة، فالصدق يبنيها",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "sc-m5",
          prompt: "كلما زاد العلم، _______ التواضع عند صاحبه.",
          options: ["قلّ", "زاد", "اختفى", "ضعف"],
          correctAnswer: 1,
          explanation: "المعنى: كلما زاد العلم زاد التواضع (العلاقة طردية إيجابية)",
          hint: "العلم الحقيقي يؤدي إلى التواضع لا الكبر",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "sentence-completion-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "sc-c1",
          prompt: "لم يكن الأمر _______ كما توقعنا، بل كان أكثر تعقيداً.",
          options: ["صعباً", "معقداً", "بسيطاً", "مستحيلاً"],
          correctAnswer: 2,
          explanation: "\"بل كان أكثر تعقيداً\" يدل على أن التوقع كان أنه بسيط",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "sc-c2",
          prompt: "إن _______ في العمل يؤدي إلى إتقانه، لكن التسرع يفسد النتائج.",
          options: ["الإهمال", "التأني", "التردد", "الخوف"],
          correctAnswer: 1,
          explanation: "التأني (عكس التسرع) يؤدي للإتقان، و\"لكن\" تشير للتضاد",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "sc-c3",
          prompt: "يتميز القائد الناجح بـ _______ في اتخاذ القرارات و _______ في التعامل مع فريقه.",
          options: ["التردد - القسوة", "الحزم - المرونة", "التسرع - الجمود", "الضعف - الشدة"],
          correctAnswer: 1,
          explanation: "القائد الناجح يجمع بين الحزم في القرارات والمرونة في التعامل",
          hint: "ابحث عن صفات إيجابية ومتوازنة للقائد",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "sc-c4",
          prompt: "مهما بلغت _______ المرء، فإنه يظل بحاجة إلى من ينصحه ويرشده.",
          options: ["ثروة", "حكمة", "شهرة", "قوة"],
          correctAnswer: 1,
          explanation: "حتى الحكيم يحتاج النصيحة، وهذا يدل على أهمية الاستماع للآخرين",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "sc-c5",
          prompt: "النجاح الحقيقي لا يُقاس بـ _______ فحسب، بل بمدى تأثيرك الإيجابي في من حولك.",
          options: ["العمل الجاد", "الإنجازات الشخصية", "مساعدة الآخرين", "السعادة الداخلية"],
          correctAnswer: 1,
          explanation: "\"لا ... فحسب، بل\" تشير إلى أن هناك ما هو أهم من الإنجازات الشخصية وهو التأثير في الآخرين",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
