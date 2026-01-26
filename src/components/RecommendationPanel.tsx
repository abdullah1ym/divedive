import { Sparkles, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import ProgressMap from "./ProgressMap";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface Recommendation {
  title: string;
  description: string;
}

const RecommendationPanel = () => {
  const [mapOpen, setMapOpen] = useState(false);
  const { stats } = useUserProfile();

  const getRecommendation = (): Recommendation => {
    // Priority 1: New user - start with basics
    if (stats.exercisesCompleted < 3) {
      return {
        title: "ننصحك بتمارين الأساسيات",
        description: "أساسيات الكمي واللفظي",
      };
    }

    // Priority 3: Low accuracy - needs practice
    if (stats.accuracy < 60 && stats.totalQuestionsAnswered >= 10) {
      return {
        title: "ركز على تحسين دقتك",
        description: `دقتك الحالية ${stats.accuracy}% - راجع الأساسيات`,
      };
    }

    // Priority 4: Daily goal reminder
    const { mathCompleted, mathTarget, languageCompleted, languageTarget } = stats.dailyGoal;
    const mathRemaining = mathTarget - mathCompleted;
    const languageRemaining = languageTarget - languageCompleted;

    if (mathRemaining > 0 || languageRemaining > 0) {
      const parts = [];
      if (mathRemaining > 0) parts.push(`${mathRemaining} كمي`);
      if (languageRemaining > 0) parts.push(`${languageRemaining} لفظي`);

      return {
        title: "أكمل هدفك اليومي",
        description: `متبقي ${parts.join(" و ")}`,
      };
    }

    // Priority 5: High performer - encourage advanced
    if (stats.accuracy >= 80) {
      return {
        title: "أنت تتقدم بشكل ممتاز!",
        description: "جرب الاختبار التجريبي الشامل",
      };
    }

    // Default: Keep practicing
    return {
      title: "استمر في التدريب",
      description: `أكملت ${stats.exercisesCompleted} تمرين - واصل التقدم!`,
    };
  };

  const recommendation = getRecommendation();

  return (
    <>
      {/* Mobile Version */}
      <motion.div
        className="md:hidden bg-card rounded-2xl p-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold">{recommendation.title}</h3>
            <p className="text-xs text-muted-foreground">{recommendation.description}</p>
          </div>
          <motion.button
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl text-xs font-semibold"
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapOpen(true)}
          >
            <Map className="w-4 h-4" />
            الخريطة
          </motion.button>
        </div>
      </motion.div>

      {/* Desktop Version */}
      <motion.div
        className="hidden md:block bg-card rounded-2xl p-6 relative overflow-hidden h-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Decorative icon */}
        <motion.div
          className="absolute -top-2 -left-2"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-yellow rounded-2xl flex items-center justify-center -rotate-12 shadow-lg">
            <Sparkles className="w-8 h-8 text-yellow-foreground" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="pl-12">
          <h3 className="text-lg font-bold mb-2">
            بناءً على مستواك، {recommendation.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            في هذه الوحدة ستتعلم <span className="text-coral font-semibold">{recommendation.description}</span> والمهارات الأساسية لاختبار القدرات.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-border">
          <div>
            <p className="font-semibold text-sm">تفعيل دليل التدريب</p>
            <p className="text-xs text-muted-foreground">يعرض النصائح ومتتبع التقدم</p>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-turquoise" />
        </div>

        {/* Map Section */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">تابع تقدمك في خريطة المهارات</h4>
          <p className="text-xs text-muted-foreground mb-4">
            الخريطة متزامنة مع تقدمك في التمارين.
          </p>

          <motion.div
            className="relative h-24 rounded-xl overflow-hidden bg-gradient-to-l from-primary/30 via-turquoise/20 to-jellyfish/30 flex items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            onClick={() => setMapOpen(true)}
          >
            {/* Decorative dots */}
            <div className="absolute inset-0 flex items-center justify-around px-4">
              <div className="w-3 h-3 rounded-full bg-coral" />
              <div className="w-2 h-2 rounded-full bg-yellow" />
              <div className="w-3 h-3 rounded-full bg-turquoise" />
              <div className="w-2 h-2 rounded-full bg-mint" />
              <div className="w-3 h-3 rounded-full bg-jellyfish" />
            </div>

            {/* Connecting line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 30 48 Q 100 30, 170 48 T 310 48 T 450 48"
                stroke="white"
                strokeOpacity="0.3"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>

            <button className="flex items-center gap-2 px-4 py-2 bg-foreground/10 backdrop-blur-sm rounded-full text-sm font-semibold group-hover:bg-foreground/20 transition-colors z-10">
              <Map className="w-4 h-4" />
              عرض الخريطة
            </button>
          </motion.div>
        </div>
      </motion.div>

      <ProgressMap open={mapOpen} onClose={() => setMapOpen(false)} />
    </>
  );
};

export default RecommendationPanel;
