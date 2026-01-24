import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Calculator, FileText, Shapes, BarChart3, ChevronRight, ChevronLeft } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const sets = [
  { id: "math", label: "الكمي", icon: Calculator, color: "coral", hasSupersets: true },
  { id: "verbal", label: "اللفظي", icon: FileText, color: "turquoise", hasSupersets: true },
  { id: "mixed", label: "اختبار محاكي", icon: BarChart3, color: "jellyfish", hasSupersets: false },
];

const supersets: Record<string, { id: string; label: string; icon: typeof Calculator; color: string }[]> = {
  math: [
    { id: "all-math", label: "الكل", icon: Calculator, color: "coral" },
    { id: "quantitative", label: "حساب", icon: Calculator, color: "coral" },
    { id: "algebra", label: "جبر", icon: Shapes, color: "primary" },
  ],
  verbal: [
    { id: "verbal", label: "البنك الأول", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-2", label: "البنك الثاني", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-3", label: "البنك الثالث", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-4", label: "البنك الرابع", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-5", label: "البنك الخامس", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-6", label: "البنك السادس", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-7", label: "البنك السابع", icon: FileText, color: "turquoise" },
    { id: "verbal-bank-8", label: "البنك الثامن", icon: FileText, color: "turquoise" },
  ],
};

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
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

  const handleSetClick = (set: typeof sets[0]) => {
    if (set.hasSupersets) {
      setSelectedSet(set.id);
      // Select the first superset by default
      const firstSuperset = supersets[set.id]?.[0];
      if (firstSuperset) {
        onCategoryChange(firstSuperset.id);
      }
    } else {
      // No supersets, directly select this category
      onCategoryChange(set.id);
    }
  };

  const handleBackClick = () => {
    setSelectedSet(null);
    // Reset to default category when going back
    onCategoryChange("quantitative");
  };

  // Show supersets if a set is selected
  if (selectedSet) {
    const currentSupersets = supersets[selectedSet] || [];
    const currentSet = sets.find(s => s.id === selectedSet);
    const showScrollArrows = currentSupersets.length > 4;

    return (
      <div className="flex items-center gap-2">
        {/* Back button - fixed */}
        <motion.button
          onClick={handleBackClick}
          className="flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-3 rounded-xl font-semibold text-xs md:text-sm bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all whitespace-nowrap"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronRight className="w-4 h-4" />
          {currentSet?.label}
        </motion.button>

        {/* Scrollable supersets container */}
        <div className="relative flex-1 min-w-0">
          {/* Scroll Left Button */}
          {showScrollArrows && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Scroll Right Button */}
          {showScrollArrows && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <motion.div
            ref={scrollContainerRef}
            className={`flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth ${showScrollArrows ? 'mx-10 px-2' : ''}`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Supersets */}
            {currentSupersets.map((superset, index) => {
              const Icon = superset.icon;
              const isActive = activeCategory === superset.id;

              return (
                <motion.button
                  key={superset.id}
                  onClick={() => onCategoryChange(superset.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? `${gradientClasses[superset.color]} shadow-lg`
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-foreground/20" : iconBgClasses[superset.color]
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {superset.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // Show main sets
  return (
    <motion.div
      className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {sets.map((set, index) => {
        const Icon = set.icon;
        const isActive = activeCategory === set.id;

        return (
          <motion.button
            key={set.id}
            onClick={() => handleSetClick(set)}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${
              isActive
                ? `${gradientClasses[set.color]} shadow-lg`
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
              isActive ? "bg-foreground/20" : iconBgClasses[set.color]
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            {set.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default CategoryTabs;
