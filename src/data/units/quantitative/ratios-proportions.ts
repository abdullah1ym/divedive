import { LearningUnit } from "@/types/units";

export const ratiosProportionsUnit: LearningUnit = {
  id: "quant-ratios",
  slug: "ratios-proportions",
  title: "النسب والتناسب",
  description: "فهم النسب والتناسب وتطبيقاتها في حل المسائل الرياضية",
  category: "quantitative",
  topic: "ratios",
  icon: "Scale",
  color: "turquoise",
  order: 6,
  totalQuestions: 10,
  estimatedDuration: "١٠-١٥ دقيقة",

  foundationalLesson: {
    id: "lesson-ratios",
    title: "أساسيات النسب والتناسب",
    description: "تعلم مفاهيم النسب والتناسب وطرق حلها",
    duration: "٥ دقائق",
    contents: [
      {
        id: "ratio-c1",
        type: "text",
        title: "ما هي النسبة؟",
        content: "النسبة هي مقارنة بين كميتين من نفس النوع. تُكتب على صورة أ : ب أو أ/ب، وتُقرأ 'أ إلى ب'. مثال: نسبة الأولاد إلى البنات ٣ : ٢ تعني أن لكل ٣ أولاد يوجد بنتان."
      },
      {
        id: "ratio-c2",
        type: "formula",
        title: "قوانين النسب والتناسب",
        content: "• إذا أ : ب = ج : د، فإن أ × د = ب × ج (الضرب التبادلي)\n• النسبة بين جزء والكل: الجزء/الكل\n• تبسيط النسبة: قسمة الطرفين على عامل مشترك\n• النسبة المتسلسلة: أ : ب : ج"
      },
      {
        id: "ratio-c3",
        type: "example",
        title: "مثال على التناسب",
        content: "إيجاد قيمة مجهولة باستخدام التناسب",
        example: {
          problem: "إذا كانت ٣ : ٥ = س : ٢٠، أوجد قيمة س",
          steps: [
            "نستخدم الضرب التبادلي: ٣ × ٢٠ = ٥ × س",
            "٦٠ = ٥س",
            "س = ٦٠ ÷ ٥ = ١٢"
          ],
          solution: "س = ١٢"
        }
      },
      {
        id: "ratio-c4",
        type: "tip",
        title: "نصيحة مهمة",
        content: "عند حل مسائل النسب:\n• تأكد أن الوحدات متماثلة قبل كتابة النسبة\n• النسبة ليس لها وحدة (رقم مجرد)\n• يمكن ضرب أو قسمة طرفي النسبة في نفس العدد دون تغيير قيمتها"
      }
    ],
    keyPoints: [
      "النسبة تقارن بين كميتين من نفس النوع",
      "الضرب التبادلي: أ × د = ب × ج عندما أ/ب = ج/د",
      "لإيجاد الكل من النسبة: اجمع أجزاء النسبة",
      "النسبة يمكن تبسيطها بالقسمة على العامل المشترك الأكبر"
    ]
  },

  exerciseSets: [
    {
      id: "ratios-easy",
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "ratio-e1",
          prompt: "إذا كانت نسبة عدد الطلاب إلى الطالبات في فصل ٤ : ٣، وكان عدد الطلاب ١٦، فما عدد الطالبات؟",
          options: ["١٠", "١٢", "١٤", "١٨"],
          correctAnswer: 1,
          explanation: "٤ : ٣ = ١٦ : س. بالضرب التبادلي: ٤س = ٤٨، إذن س = ١٢",
          hint: "استخدم الضرب التبادلي: ٤ × س = ٣ × ١٦",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "ratio-e2",
          prompt: "بسّط النسبة ١٨ : ٢٤",
          options: ["٢ : ٣", "٣ : ٤", "٤ : ٥", "٦ : ٨"],
          correctAnswer: 1,
          explanation: "العامل المشترك الأكبر هو ٦. ١٨ ÷ ٦ = ٣، و ٢٤ ÷ ٦ = ٤. إذن النسبة = ٣ : ٤",
          hint: "اقسم كلا العددين على العامل المشترك الأكبر",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "ratio-e3",
          prompt: "إذا كان ٢ : ٥ = ٦ : س، فما قيمة س؟",
          options: ["١٠", "١٢", "١٥", "٢٠"],
          correctAnswer: 2,
          explanation: "بالضرب التبادلي: ٢ × س = ٥ × ٦ = ٣٠، إذن س = ١٥",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "ratio-e4",
          prompt: "قُسم مبلغ ١٠٠ ريال بين شخصين بنسبة ٣ : ٢. كم يحصل الأول؟",
          options: ["٤٠ ريال", "٥٠ ريال", "٦٠ ريال", "٧٥ ريال"],
          correctAnswer: 2,
          explanation: "مجموع أجزاء النسبة = ٣ + ٢ = ٥. نصيب الأول = (٣/٥) × ١٠٠ = ٦٠ ريال",
          hint: "اجمع أجزاء النسبة أولاً، ثم أوجد نصيب كل جزء",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "ratios-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "ratio-m1",
          prompt: "نسبة أ إلى ب هي ٢ : ٣، ونسبة ب إلى ج هي ٤ : ٥. ما نسبة أ إلى ج؟",
          options: ["٨ : ١٥", "٦ : ٢٠", "٢ : ٥", "٤ : ٧"],
          correctAnswer: 0,
          explanation: "أ : ب = ٢ : ٣ = ٨ : ١٢، ب : ج = ٤ : ٥ = ١٢ : ١٥. إذن أ : ج = ٨ : ١٥",
          hint: "اجعل قيمة ب متساوية في النسبتين بإيجاد المضاعف المشترك",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "ratio-m2",
          prompt: "إذا كانت نسبة أعمار ثلاثة أشخاص ٢ : ٣ : ٥، ومجموع أعمارهم ٥٠ سنة، فما عمر الأكبر؟",
          options: ["١٥ سنة", "٢٠ سنة", "٢٥ سنة", "٣٠ سنة"],
          correctAnswer: 2,
          explanation: "مجموع الأجزاء = ٢ + ٣ + ٥ = ١٠. قيمة الجزء الواحد = ٥٠ ÷ ١٠ = ٥. عمر الأكبر = ٥ × ٥ = ٢٥",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "ratio-m3",
          prompt: "خريطة مرسومة بمقياس رسم ١ : ٥٠٠٠٠. إذا كانت المسافة على الخريطة ٤ سم، فما المسافة الحقيقية؟",
          options: ["٢٠٠ متر", "٢٠٠٠ متر", "٢٠ كم", "٢٠٠ كم"],
          correctAnswer: 1,
          explanation: "المسافة الحقيقية = ٤ × ٥٠٠٠٠ = ٢٠٠٠٠٠ سم = ٢٠٠٠ متر = ٢ كم",
          hint: "اضرب المسافة على الخريطة في مقياس الرسم، ثم حوّل الوحدات",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "ratios-hard",
      title: "تمارين متقدمة",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "ratio-h1",
          prompt: "إذا كان أ : ب = ٣ : ٤ و أ : ج = ٥ : ٦، فما نسبة ب : ج؟",
          options: ["١٠ : ٩", "٩ : ١٠", "٤ : ٥", "١٥ : ٢٤"],
          correctAnswer: 0,
          explanation: "أ : ب = ٣ : ٤، إذن ب = ٤أ/٣. أ : ج = ٥ : ٦، إذن ج = ٦أ/٥. ب : ج = (٤أ/٣) : (٦أ/٥) = (٤/٣) × (٥/٦) = ٢٠/١٨ = ١٠ : ٩",
          hint: "عبّر عن ب و ج بدلالة أ، ثم أوجد النسبة",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "ratio-h2",
          prompt: "خُلط نوعان من العصير: الأول فيه نسبة السكر ١٠٪ والثاني ٢٥٪. إذا أردنا خليطاً نسبة السكر فيه ١٥٪، فما نسبة خلط النوعين؟",
          options: ["١ : ٢", "٢ : ١", "٢ : ٣", "٣ : ٢"],
          correctAnswer: 1,
          explanation: "بطريقة التحالف: |٢٥ - ١٥| : |١٠ - ١٥| = ١٠ : ٥ = ٢ : ١. أي نخلط جزأين من الأول مع جزء من الثاني",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "ratio-h3",
          prompt: "إذا زادت نسبة أ : ب من ٣ : ٥ إلى ٤ : ٥ دون تغيير ب، فكم نسبة الزيادة في أ؟",
          options: ["٢٥٪", "٣٣٫٣٪", "٥٠٪", "٦٦٫٦٪"],
          correctAnswer: 1,
          explanation: "لنفرض ب = ٥. أ القديمة = ٣، أ الجديدة = ٤. الزيادة = ١. نسبة الزيادة = (١/٣) × ١٠٠ ≈ ٣٣٫٣٪",
          hint: "افرض قيمة لـ ب، ثم احسب التغير في أ",
          difficulty: "hard",
          source: "collection",
          year: 1445
        }
      ]
    }
  ]
};
