import { motion } from "framer-motion";
import { Calculator, Play, CheckCircle, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

const topics = [
  { id: 1, name: "الحساب", questions: 45, progress: 80 },
  { id: 2, name: "الجبر", questions: 38, progress: 65 },
  { id: 3, name: "الهندسة", questions: 42, progress: 40 },
  { id: 4, name: "الإحصاء والاحتمالات", questions: 30, progress: 25 },
  { id: 5, name: "المقارنة والتحليل", questions: 35, progress: 0 },
];

const QuantitativeView = () => {
  const totalQuestions = topics.reduce((sum, t) => sum + t.questions, 0);
  const avgProgress = Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">القسم الكمي</h1>
        <p className="text-muted-foreground">تدريب على المسائل الرياضية والتحليل الكمي</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-turquoise/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-turquoise" />
          </div>
          <p className="text-2xl font-bold">{totalQuestions}</p>
          <p className="text-sm text-muted-foreground">سؤال</p>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-yellow/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-yellow" />
          </div>
          <p className="text-2xl font-bold">{avgProgress}٪</p>
          <p className="text-sm text-muted-foreground">تقدم</p>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-mint/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-mint" />
          </div>
          <p className="text-2xl font-bold">{topics.length}</p>
          <p className="text-sm text-muted-foreground">مواضيع</p>
        </div>
      </motion.div>

      {/* Topics */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold">المواضيع</h2>
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            className="bg-card rounded-2xl p-5 hover:bg-muted/50 transition-colors cursor-pointer group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground">{topic.questions} سؤال</p>
                </div>
              </div>
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4 fill-current" />
                تدريب
              </motion.button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-turquoise rounded-full transition-all"
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground w-12">{topic.progress}٪</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Practice */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">تدريب سريع</h3>
        <p className="text-muted-foreground mb-6">٢٠ سؤال عشوائي من جميع المواضيع</p>
        <motion.button
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ابدأ التدريب السريع
        </motion.button>
      </motion.div>
    </div>
  );
};

export default QuantitativeView;
