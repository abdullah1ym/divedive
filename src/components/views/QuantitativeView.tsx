import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Target, TrendingUp, CheckCircle, Brain, Library, Play } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";
import { LearningUnit } from "@/types/units";
import UnitCard from "@/components/units/UnitCard";
import UnitView from "@/components/units/UnitView";

const collections = [
  { id: 1, name: "تجميعات 1446", questions: 120, description: "أحدث تجميعات الاختبارات" },
  { id: 2, name: "تجميعات 1445", questions: 150, description: "تجميعات العام الماضي" },
];

const QuantitativeView = () => {
  const { getUnitsByCategory, getUnitProgress, getOverallStats } = useUnits();
  const [selectedUnit, setSelectedUnit] = useState<LearningUnit | null>(null);

  const units = getUnitsByCategory("quantitative");
  const stats = getOverallStats();

  // Calculate quantitative-specific stats
  const quantUnits = units.length;
  const totalQuestions = units.reduce((sum, u) => sum + u.totalQuestions, 0);
  const progressValues = units.map(u => getUnitProgress(u.id)?.overallProgress || 0);
  const avgProgress = progressValues.length > 0
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0;

  if (selectedUnit) {
    return (
      <UnitView
        unit={selectedUnit}
        onBack={() => setSelectedUnit(null)}
      />
    );
  }

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
          <p className="text-2xl font-bold">{quantUnits}</p>
          <p className="text-sm text-muted-foreground">وحدة</p>
        </div>
      </motion.div>

      {/* Collections - Pinned at top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-xl font-bold mb-4">التجميعات</h2>
        <div className="grid gap-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="bg-gradient-to-l from-primary/10 to-turquoise/10 border border-primary/20 rounded-2xl p-5 hover:border-primary/40 transition-colors cursor-pointer group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Library className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">{collection.description} • {collection.questions} سؤال</p>
                  </div>
                </div>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  ابدأ
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Units Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">الوحدات التعليمية</h2>

        {units.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Brain className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">سيتم إضافة الوحدات قريباً</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {units.map((unit, index) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                progress={getUnitProgress(unit.id)}
                onClick={() => setSelectedUnit(unit)}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Practice */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
