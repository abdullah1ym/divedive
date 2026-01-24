import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, Calculator, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface SavedQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  category: "quantitative" | "verbal";
  savedAt: string;
  note?: string;
}

const STORAGE_KEY = "divedive-saved-questions";

// Helper to convert number to Arabic numerals
const toArabicNumeral = (num: number): string => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().split("").map(d => arabicNumerals[parseInt(d)] || d).join("");
};

const FavoritesView = () => {
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "quantitative" | "verbal">("all");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedQuestions(JSON.parse(stored));
      } catch {
        setSavedQuestions([]);
      }
    }
  }, []);

  const removeQuestion = (id: string) => {
    const updated = savedQuestions.filter(q => q.id !== id);
    setSavedQuestions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filteredQuestions = savedQuestions.filter(q =>
    filter === "all" ? true : q.category === filter
  );

  const quantitativeCount = savedQuestions.filter(q => q.category === "quantitative").length;
  const verbalCount = savedQuestions.filter(q => q.category === "verbal").length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">الأسئلة المحفوظة</h1>
        <p className="text-muted-foreground">الأسئلة التي حفظتها للمراجعة لاحقاً</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-turquoise text-white"
              : "bg-muted/30 hover:bg-muted/50"
          }`}
        >
          الكل ({toArabicNumeral(savedQuestions.length)})
        </button>
        <button
          onClick={() => setFilter("quantitative")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "quantitative"
              ? "bg-turquoise text-white"
              : "bg-muted/30 hover:bg-muted/50"
          }`}
        >
          <Calculator className="w-4 h-4" />
          الكمي ({toArabicNumeral(quantitativeCount)})
        </button>
        <button
          onClick={() => setFilter("verbal")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "verbal"
              ? "bg-turquoise text-white"
              : "bg-muted/30 hover:bg-muted/50"
          }`}
        >
          <FileText className="w-4 h-4" />
          اللفظي ({toArabicNumeral(verbalCount)})
        </button>
      </motion.div>

      {filteredQuestions.length > 0 ? (
        <div className="space-y-3">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              className="bg-card rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    question.category === "quantitative" ? "bg-turquoise/20" : "bg-turquoise/20"
                  }`}>
                    {question.category === "quantitative"
                      ? <Calculator className="w-5 h-5 text-turquoise" />
                      : <FileText className="w-5 h-5 text-turquoise" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-relaxed line-clamp-2">{question.prompt}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(question.savedAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      className="w-8 h-8 rounded-lg bg-muted/30 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(question.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    {expandedId === question.id
                      ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    }
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === question.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-muted/20"
                  >
                    <div className="p-5 pt-4 space-y-3">
                      {question.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl text-sm ${
                            idx === question.correctAnswer
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-muted/20"
                          }`}
                        >
                          {option}
                          {idx === question.correctAnswer && (
                            <span className="mr-2 text-xs">(الإجابة الصحيحة)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-card rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد أسئلة محفوظة</h3>
          <p className="text-muted-foreground">
            احفظ الأسئلة المهمة أثناء التدريب للمراجعة لاحقاً
          </p>
        </motion.div>
      )}

      {/* Tip */}
      <motion.div
        className="bg-muted/50 rounded-xl p-4 flex items-start gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Bookmark className="w-5 h-5 text-turquoise mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">معلومة:</span> اضغط على أيقونة الحفظ في أي سؤال لإضافته هنا
        </p>
      </motion.div>
    </div>
  );
};

export default FavoritesView;
