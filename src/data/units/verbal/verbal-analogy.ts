import { LearningUnit } from "@/types/units";
import bank1Data from "@/data/bank1_tanadhur_questions.json";

// Transform JSON questions to match the app's expected format
const transformQuestions = (questions: typeof bank1Data.questions, difficulty: "easy" | "medium" | "hard", startIdx: number, endIdx: number) => {
  return questions.slice(startIdx, endIdx).map((q, idx) => ({
    id: `va-bank1-${q.id}`,
    prompt: q.prompt,
    options: q.options.filter(opt => opt !== ""), // Remove empty options
    correctAnswer: q.correctAnswer,
    explanation: "العلاقة: ترادف أو تشابه في المعنى",
    difficulty,
    source: "collection" as const,
    year: 2025
  }));
};

// Split 138 questions into difficulty levels
const easyQuestions = transformQuestions(bank1Data.questions, "easy", 0, 46);
const mediumQuestions = transformQuestions(bank1Data.questions, "medium", 46, 92);
const hardQuestions = transformQuestions(bank1Data.questions, "hard", 92, 138);

export const verbalAnalogyUnit: LearningUnit = {
  id: "verbal-analogy",
  slug: "verbal-analogy",
  title: "التناظر اللفظي",
  description: "العلاقات بين الكلمات والتناظرات اللفظية",
  category: "verbal",
  topic: "analogy",
  icon: "ArrowLeftRight",
  color: "turquoise",
  order: 3,
  totalQuestions: 138,
  estimatedDuration: "٤٥-٦٠ دقيقة",

  foundationalLesson: {
    id: "lesson-verbal-analogy",
    title: "أساسيات التناظر اللفظي",
    description: "تعلم أنواع العلاقات بين الكلمات",
    duration: "٥ دقائق",
    contents: [
      {
        id: "va-c1",
        type: "text",
        title: "ما هو التناظر اللفظي؟",
        content: "التناظر اللفظي يختبر قدرتك على فهم العلاقة بين كلمتين، ثم إيجاد كلمتين أخريين بينهما نفس العلاقة. مثال: (طبيب : مستشفى) تناظر (معلم : مدرسة) - كلاهما علاقة عامل بمكان عمله."
      },
      {
        id: "va-c2",
        type: "formula",
        title: "أنواع العلاقات الشائعة",
        content: "• التضاد: كبير ↔ صغير\n• الترادف: سعيد ↔ مسرور\n• الجزء من الكل: إصبع → يد\n• الكل من الجزء: غابة ← شجرة\n• العامل ومكان عمله: طبيب → مستشفى\n• الأداة ووظيفتها: قلم → كتابة"
      },
      {
        id: "va-c3",
        type: "formula",
        title: "علاقات إضافية",
        content: "• المادة والمنتج: قمح → خبز\n• الحيوان وصوته: أسد → زئير\n• المرحلة والتالية: طفل → شاب\n• السبب والنتيجة: نار → حرارة\n• التصنيف: تفاح → فاكهة"
      },
      {
        id: "va-c4",
        type: "example",
        title: "مثال تطبيقي",
        content: "كيفية حل سؤال تناظر لفظي",
        example: {
          problem: "قلم : كتابة :: مقص : ؟",
          steps: [
            "حدد العلاقة: قلم أداة للكتابة",
            "نوع العلاقة: أداة ووظيفتها",
            "طبق نفس العلاقة: مقص أداة لـ ؟",
            "الإجابة: القص أو القطع"
          ],
          solution: "قص"
        }
      },
      {
        id: "va-c5",
        type: "tip",
        title: "نصائح مهمة",
        content: "• حدد العلاقة بدقة قبل النظر للخيارات\n• العلاقة يجب أن تكون بنفس الاتجاه\n• إذا وجدت خيارين مناسبين، اختر الأدق\n• انتبه لترتيب الكلمات في العلاقة"
      }
    ],
    keyPoints: [
      "حدد نوع العلاقة أولاً قبل النظر للخيارات",
      "تأكد من اتجاه العلاقة (من الأول للثاني)",
      "العلاقة يجب أن تكون متطابقة وليست متشابهة فقط",
      "احفظ أنواع العلاقات الشائعة"
    ]
  },

  exerciseSets: [
    {
      id: "verbal-analogy-easy",
      title: "تمارين تأسيسية (البنك الأول)",
      type: "practice",
      difficulty: "easy",
      questions: easyQuestions
    },
    {
      id: "verbal-analogy-medium",
      title: "تمارين متوسطة (البنك الأول)",
      type: "practice",
      difficulty: "medium",
      questions: mediumQuestions
    },
    {
      id: "verbal-analogy-collection",
      title: "أسئلة تجميعات (البنك الأول)",
      type: "collection",
      difficulty: "hard",
      questions: hardQuestions
    }
  ]
};
