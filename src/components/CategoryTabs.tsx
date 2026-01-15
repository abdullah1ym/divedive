import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, FileText, Shapes, BarChart3, Award, ChevronLeft } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const mainSets = [
  { id: "quantitative", label: "الكمي", icon: Calculator, color: "coral" },
  { id: "verbal", label: "اللفظي", icon: FileText, color: "turquoise" },
  { id: "mixed", label: "اختبار شامل", icon: Award, color: "jellyfish" },
];

const supersets: Record<string, { id: string; label: string; icon: typeof Calculator; color: string }[]> = {
  quantitative: [
    { id: "quantitative-all", label: "الكل", icon: Calculator, color: "coral" },
    { id: "quantitative", label: "حساب", icon: Calculator, color: "coral" },
    { id: "algebra", label: "جبر", icon: Shapes, color: "primary" },
  ],
  verbal: [
    { id: "verbal-all", label: "الكل", icon: FileText, color: "turquoise" },
    { id: "verbal", label: "استيعاب", icon: FileText, color: "turquoise" },
    { id: "analogy", label: "تناظر", icon: BarChart3, color: "mint" },
  ],
};

const gradientClasses: Record<string, string> = {
  coral: "gradient-coral text-coral-foreground",
  primary: "gradient-ocean text-foreground",
  turquoise: "gradient-turquoise text-turquoise-foreground",
  mint: "gradient-mint text-mint-foreground",
  jellyfish: "gradient-jellyfish text-jellyfish-foreground",
};

const iconBgClasses: Record<string, string> = {
  coral: "bg-coral/20",
  primary: "bg-primary/20",
  turquoise: "bg-turquoise/20",
  mint: "bg-mint/20",
  jellyfish: "bg-jellyfish/20",
};

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const [activeMainSet, setActiveMainSet] = useState<string | null>(null);

  const handleMainSetClick = (id: string) => {
    if (supersets[id]) {
      setActiveMainSet(id);
      onCategoryChange(supersets[id][0].id);
    } else {
      onCategoryChange(id);
    }
  };

  const handleBack = () => {
    setActiveMainSet(null);
  };

  const currentMainSet = activeMainSet ? mainSets.find(s => s.id === activeMainSet) : null;

  return (
    <motion.div
      className="flex items-center gap-3 overflow-x-auto pb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {!activeMainSet ? (
          // Main sets view
          <motion.div
            key="main-sets"
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            {mainSets.map((set, index) => {
              const Icon = set.icon;

              return (
                <motion.button
                  key={set.id}
                  onClick={() => handleMainSetClick(set.id)}
                  className="flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgClasses[set.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {set.label}
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          // Supersets view
          <motion.div
            key="supersets"
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            {/* Parent set button - same design as other buttons */}
            {currentMainSet && (
              <motion.button
                onClick={handleBack}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${gradientClasses[currentMainSet.color]} shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-foreground/20">
                  <currentMainSet.icon className="w-4 h-4" />
                </div>
                {currentMainSet.label}
              </motion.button>
            )}

            {/* Breadcrumb separator */}
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Supersets */}
            {supersets[activeMainSet]?.map((superset, index) => {
              const Icon = superset.icon;
              const isActive = activeCategory === superset.id;

              return (
                <motion.button
                  key={superset.id}
                  onClick={() => onCategoryChange(superset.id)}
                  className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? `${gradientClasses[superset.color]} shadow-lg`
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-foreground/20" : iconBgClasses[superset.color]
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {superset.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryTabs;
