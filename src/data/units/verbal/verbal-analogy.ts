import { LearningUnit } from "@/types/units";

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
  totalQuestions: 15,
  estimatedDuration: "١٥-٢٠ دقيقة",

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
      title: "تمارين تأسيسية",
      type: "practice",
      difficulty: "easy",
      questions: [
        {
          id: "va-e1",
          prompt: "ليل : نهار",
          options: ["شمس : قمر", "نور : ظلام", "صيف : حار", "شتاء : بارد"],
          correctAnswer: 1,
          explanation: "العلاقة: تضاد. ليل عكس نهار، ونور عكس ظلام",
          hint: "ابحث عن علاقة التضاد (العكس)",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "va-e2",
          prompt: "طبيب : مستشفى",
          options: ["طالب : كتاب", "معلم : مدرسة", "سيارة : شارع", "طعام : مطبخ"],
          correctAnswer: 1,
          explanation: "العلاقة: عامل ومكان عمله. الطبيب يعمل في المستشفى، والمعلم يعمل في المدرسة",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "va-e3",
          prompt: "أسد : زئير",
          options: ["قط : حليب", "كلب : نباح", "طائر : سماء", "سمكة : ماء"],
          correctAnswer: 1,
          explanation: "العلاقة: حيوان وصوته. الأسد يزأر، والكلب ينبح",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "va-e4",
          prompt: "يد : إصبع",
          options: ["قدم : حذاء", "رأس : شعر", "شجرة : غابة", "كتاب : مكتبة"],
          correctAnswer: 1,
          explanation: "العلاقة: الكل والجزء. الإصبع جزء من اليد، والشعر جزء من الرأس",
          difficulty: "easy",
          source: "practice"
        },
        {
          id: "va-e5",
          prompt: "سعيد : حزين",
          options: ["طويل : قصير", "جميل : وردة", "كبير : ضخم", "سريع : سيارة"],
          correctAnswer: 0,
          explanation: "العلاقة: تضاد. سعيد عكس حزين، وطويل عكس قصير",
          difficulty: "easy",
          source: "practice"
        }
      ]
    },
    {
      id: "verbal-analogy-medium",
      title: "تمارين متوسطة",
      type: "practice",
      difficulty: "medium",
      questions: [
        {
          id: "va-m1",
          prompt: "قمح : خبز",
          options: ["حليب : بقرة", "عنب : نبيذ", "ماء : نهر", "شجرة : خشب"],
          correctAnswer: 1,
          explanation: "العلاقة: مادة خام ومنتج. القمح يُصنع منه الخبز، والعنب يُصنع منه النبيذ",
          hint: "ابحث عن علاقة المادة الخام والمنتج النهائي",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "va-m2",
          prompt: "كاتب : رواية",
          options: ["رسام : لوحة", "قارئ : كتاب", "معلم : طالب", "طبيب : مريض"],
          correctAnswer: 0,
          explanation: "العلاقة: منتِج ومنتَج. الكاتب ينتج الرواية، والرسام ينتج اللوحة",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "va-m3",
          prompt: "طفل : رجل",
          options: ["بذرة : شجرة", "ماء : ثلج", "صيف : شتاء", "نهار : ليل"],
          correctAnswer: 0,
          explanation: "العلاقة: مرحلة نمو. الطفل يصبح رجلاً، والبذرة تصبح شجرة",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "va-m4",
          prompt: "عين : بصر",
          options: ["يد : لمس", "أذن : سمع", "أنف : شم", "جميع ما سبق"],
          correctAnswer: 1,
          explanation: "العلاقة: عضو وحاسته. العين للبصر، والأذن للسمع",
          difficulty: "medium",
          source: "practice"
        },
        {
          id: "va-m5",
          prompt: "محيط : دائرة",
          options: ["مساحة : مربع", "ضلع : مثلث", "قطر : كرة", "محيط : مستطيل"],
          correctAnswer: 3,
          explanation: "العلاقة: قياس وشكله. المحيط قياس للدائرة وأيضاً للمستطيل",
          hint: "المحيط يمكن حسابه لأشكال مختلفة",
          difficulty: "medium",
          source: "practice"
        }
      ]
    },
    {
      id: "verbal-analogy-collection",
      title: "أسئلة تجميعات",
      type: "collection",
      difficulty: "hard",
      questions: [
        {
          id: "va-c1",
          prompt: "متفائل : متشائم",
          options: ["كريم : بخيل", "ذكي : عالم", "سريع : بطيء", "جميع ما سبق"],
          correctAnswer: 0,
          explanation: "العلاقة: تضاد في الصفات. متفائل عكس متشائم، وكريم عكس بخيل. (سريع وبطيء أيضاً تضاد لكن كريم وبخيل أدق لأنها صفات شخصية مثل الأصل)",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "va-c2",
          prompt: "ريشة : طائر",
          options: ["شعر : إنسان", "حرشفة : سمكة", "جلد : حيوان", "ورقة : شجرة"],
          correctAnswer: 1,
          explanation: "العلاقة: غطاء خارجي مميز للكائن. الريش للطائر والحراشف للسمكة",
          hint: "ابحث عن الغطاء الخارجي المميز",
          difficulty: "hard",
          source: "collection",
          year: 1444
        },
        {
          id: "va-c3",
          prompt: "جوع : طعام",
          options: ["عطش : ماء", "نوم : سرير", "برد : معطف", "مرض : دواء"],
          correctAnswer: 0,
          explanation: "العلاقة: حاجة وما يشبعها مباشرة. الجوع يُشبع بالطعام، والعطش يُشبع بالماء",
          difficulty: "hard",
          source: "collection",
          year: 1445
        },
        {
          id: "va-c4",
          prompt: "نحلة : خلية",
          options: ["نملة : قرية", "عصفور : عش", "سمكة : بحر", "إنسان : مدينة"],
          correctAnswer: 1,
          explanation: "العلاقة: كائن ومسكنه الذي يبنيه. النحلة تعيش في الخلية، والعصفور يعيش في العش",
          difficulty: "hard",
          source: "collection",
          year: 1443
        },
        {
          id: "va-c5",
          prompt: "جاهل : علم",
          options: ["فقير : مال", "مريض : صحة", "ضعيف : قوة", "جميع ما سبق"],
          correctAnswer: 3,
          explanation: "العلاقة: شخص يفتقر لشيء. الجاهل يفتقر للعلم، والفقير للمال، والمريض للصحة، والضعيف للقوة",
          difficulty: "hard",
          source: "collection",
          year: 1444
        }
      ]
    }
  ]
};
