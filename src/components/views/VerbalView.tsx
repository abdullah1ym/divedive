import { motion } from "framer-motion";
import { FileText, Play, CheckCircle, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useUnits } from "@/contexts/UnitsContext";
import UnitExerciseModal from "@/components/UnitExerciseModal";
import { LearningUnit } from "@/types/units";

const VerbalView = () => {
  const { getUnitsByCategory, getUnitProgress } = useUnits();
  const [selectedUnit, setSelectedUnit] = useState<LearningUnit | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  const units = getUnitsByCategory("verbal");

  const totalQuestions = units.reduce((sum, u) => sum + u.totalQuestions, 0);

  const getProgress = (unitId: string) => {
    const progress = getUnitProgress(unitId);
    return progress?.overallProgress || 0;
  };

  const avgProgress = units.length > 0
    ? Math.round(units.reduce((sum, u) => sum + getProgress(u.id), 0) / units.length)
    : 0;

  const handleStartExercise = (unit: LearningUnit) => {
    setSelectedUnit(unit);
    setIsExerciseModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">القسم اللفظي</h1>
        <p className="text-muted-foreground">تدريب على فهم النصوص والمفردات العربية</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-coral/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-coral" />
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
          <p className="text-2xl font-bold">{units.length}</p>
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
        {units.map((unit, index) => {
          const progress = getProgress(unit.id);
          return (
            <motion.div
              key={unit.id}
              className="bg-card rounded-2xl p-5 hover:bg-muted/50 transition-colors cursor-pointer group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleStartExercise(unit)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center group-hover:bg-coral/30 transition-colors">
                    <FileText className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{unit.title}</h3>
                    <p className="text-sm text-muted-foreground">{unit.totalQuestions} سؤال</p>
                  </div>
                </div>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-coral text-coral-foreground rounded-xl font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartExercise(unit);
                  }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  تدريب
                </motion.button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground w-12">{progress}٪</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Practice */}
      <motion.div
        className="bg-gradient-to-br from-coral/20 to-yellow/20 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-coral/20 flex items-center justify-center">
          <FileText className="w-8 h-8 text-coral" />
        </div>
        <h3 className="text-xl font-bold mb-2">تدريب سريع</h3>
        <p className="text-muted-foreground mb-6">٢٠ سؤال عشوائي من جميع المواضيع</p>
        <motion.button
          className="px-8 py-3 bg-coral text-coral-foreground rounded-xl font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ابدأ التدريب السريع
        </motion.button>
      </motion.div>

      {/* Exercise Modal */}
      {selectedUnit && (
        <UnitExerciseModal
          isOpen={isExerciseModalOpen}
          onClose={() => {
            setIsExerciseModalOpen(false);
            setSelectedUnit(null);
          }}
          unit={selectedUnit}
        />
      )}
    </div>
  );
};

export default VerbalView;
