import { Play, Brain, BookOpen, Dumbbell, Map, RotateCcw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const guideSections = [
  {
    id: "study",
    title: "كيف تذاكر",
    icon: BookOpen,
    color: "bg-turquoise",
    content: [
      "حدد هدفك اليومي من التمارين والتزم به",
      "ابدأ بالأساسيات ثم انتقل للمستويات الأعلى",
      "راجع أخطاءك يومياً لتثبيت المعلومات",
      "تدرب على الوقت لمحاكاة الاختبار الحقيقي",
    ],
  },
  {
    id: "exercises",
    title: "التمارين",
    icon: Dumbbell,
    color: "bg-coral",
    content: [
      "اختر القسم المناسب: كمي أو لفظي",
      "كل تمرين يحتوي على مجموعة أسئلة متدرجة",
      "اقرأ السؤال بتركيز قبل اختيار الإجابة",
      "بعد الإجابة، راجع الشرح لفهم الحل",
    ],
  },
  {
    id: "skillmap",
    title: "خريطة المهارات",
    icon: Map,
    color: "bg-yellow",
    content: [
      "تعرض الخريطة جميع المهارات المطلوبة",
      "كل مهارة تظهر نسبة إتقانك لها",
      "ركز على المهارات ذات النسب المنخفضة",
      "تابع تقدمك بشكل مرئي وواضح",
    ],
  },
  {
    id: "review",
    title: "مراجعة الأخطاء",
    icon: RotateCcw,
    color: "bg-mint",
    content: [
      "كل سؤال تخطئ فيه يُحفظ تلقائياً",
      "راجع أخطاءك من قسم المراجعة",
      "أعد حل الأسئلة حتى تتقنها",
      "الأسئلة المتقنة تُحذف من القائمة",
    ],
  },
];

const HeroSection = () => {
  const [guideOpen, setGuideOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % guideSections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + guideSections.length) % guideSections.length);
  };

  const section = guideSections[currentSection];
  const Icon = section.icon;

  return (
    <>
      <motion.div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col-reverse md:flex-row-reverse">
          {/* Content */}
          <div className="flex-1 p-4 md:p-8 z-10">
            <motion.span
              className="inline-block px-3 py-1 bg-yellow text-yellow-foreground rounded-full text-xs font-semibold mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              دليل المتدرب
            </motion.span>

            <motion.h1
              className="text-xl md:text-3xl font-bold mb-3 md:mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              مقدمة في اختبار القدرات
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-4 max-w-md leading-relaxed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              تعرف على اختبار القدرات العامة وأقسامه الرئيسية: الكمي واللفظي. نبدأ بالأساسيات ونتدرج للمستويات المتقدمة.
            </motion.p>

            <motion.div
              className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>١٠ دقائق</span>
              <span>•</span>
              <span>تمهيدي</span>
              <span>•</span>
              <span>نظرة عامة</span>
            </motion.div>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap items-center gap-2 mb-4 md:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="px-3 py-1 bg-turquoise text-turquoise-foreground rounded-full text-xs font-semibold">
                كيف تذاكر
              </span>
              <span className="px-3 py-1 bg-turquoise text-turquoise-foreground rounded-full text-xs font-semibold">
                التمارين
              </span>
              <span className="px-3 py-1 bg-turquoise text-turquoise-foreground rounded-full text-xs font-semibold">
                خريطة المهارات
              </span>
              <span className="px-3 py-1 bg-muted text-foreground rounded-full text-xs font-semibold">
                مراجعة الأخطاء
              </span>
            </motion.div>

            {/* Start Button */}
            <motion.button
              className="flex items-center gap-3 px-6 py-3 bg-yellow text-yellow-foreground rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => setGuideOpen(true)}
            >
              <Play className="w-5 h-5 fill-current" />
              ابدأ الدليل
            </motion.button>
          </div>

          {/* Preview - Hidden on mobile */}
          <motion.div
            className="hidden md:block relative w-[400px] h-[320px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary/80 z-10" />
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-turquoise/30 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full gradient-turquoise flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-8 h-8 text-turquoise-foreground" />
                </motion.div>
                <p className="text-sm text-muted-foreground">تدريب ذهني</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-foreground/20 animate-float" />
            <div className="absolute top-12 left-12 w-2 h-2 rounded-full bg-foreground/15 animate-float" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-foreground/10 animate-float" style={{ animationDelay: "1s" }} />
          </motion.div>
        </div>
      </motion.div>

      {/* Guide Modal */}
      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentSection + 1} من {guideSections.length}
                  </p>
                </div>
              </div>

              {/* Content */}
              <ul className="space-y-4 mb-8">
                {section.content.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className={`w-6 h-6 ${section.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                      {idx + 1}
                    </span>
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSection}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                  السابق
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {guideSections.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSection(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSection ? section.color : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                {currentSection === guideSections.length - 1 ? (
                  <button
                    onClick={() => setGuideOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow text-yellow-foreground rounded-lg font-semibold hover:brightness-110 transition-all"
                  >
                    ابدأ التدريب
                  </button>
                ) : (
                  <button
                    onClick={nextSection}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    التالي
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;
