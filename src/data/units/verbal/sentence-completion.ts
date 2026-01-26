import { LearningUnit } from "@/types/units";
import bank1Data from "@/data/bank1_sentence_completion_questions.json";

// Transform JSON questions to match the app's expected format
const transformQuestions = (questions: typeof bank1Data.questions, difficulty: "easy" | "medium" | "hard", startIdx: number, endIdx: number) => {
  return questions.slice(startIdx, endIdx).map((q) => ({
    id: `sc-bank1-${q.id}`,
    prompt: q.prompt,
    options: q.options.filter(opt => opt !== "" && opt !== "......"), // Remove empty options
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty,
    source: "collection" as const,
    year: 2025
  }));
};

// Split 101 questions into difficulty levels
const easyQuestions = transformQuestions(bank1Data.questions, "easy", 0, 34);
const mediumQuestions = transformQuestions(bank1Data.questions, "medium", 34, 68);
const hardQuestions = transformQuestions(bank1Data.questions, "hard", 68, 101);

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
  totalQuestions: 101,
  estimatedDuration: "٤٥-٦٠ دقيقة",

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
      title: "تمارين تأسيسية (البنك الأول)",
      type: "practice",
      difficulty: "easy",
      questions: easyQuestions
    },
    {
      id: "sentence-completion-medium",
      title: "تمارين متوسطة (البنك الأول)",
      type: "practice",
      difficulty: "medium",
      questions: mediumQuestions
    },
    {
      id: "sentence-completion-collection",
      title: "أسئلة تجميعات (البنك الأول)",
      type: "collection",
      difficulty: "hard",
      questions: hardQuestions
    }
  ]
};
