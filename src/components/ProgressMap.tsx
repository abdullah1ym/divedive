import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Check, Lock, Play, Star, Volume2, Music, Ear, Type, MessageCircle, MessageSquare, Users, TreePine, Radio, Award, X, Calculator, BookOpen } from "lucide-react";
import { useSkills, SkillNode, MapType } from "@/contexts/SkillsContext";
import { useSkillProgress } from "@/contexts/SkillProgressContext";

interface ProgressMapProps {
  open: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Volume2: <Volume2 className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Ear: <Ear className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  MessageCircle: <MessageCircle className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  TreePine: <TreePine className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  Star: <Star className="w-4 h-4" />,
};

const getIcon = (iconName: string) => iconMap[iconName] || <Star className="w-4 h-4" />;

// التصميم بناءً على نسبة التقدم
const getNodeStyles = (node: SkillNode, progress: number) => {
  const baseSize = node.size === "large" ? "w-14 h-14" : node.size === "medium" ? "w-11 h-11" : "w-8 h-8";
  const isLocked = !node.skillTag;

  // مقفل - بدون skillTag
  if (isLocked) {
    return {
      bg: "bg-muted/40",
      glow: "",
      size: baseSize
    };
  }

  // 100% - مكتمل (تركوازي)
  if (progress === 100) {
    return {
      bg: "bg-turquoise",
      glow: "shadow-[0_0_20px_hsl(var(--turquoise)/0.5)]",
      size: baseSize
    };
  }

  // 1-99% - قيد التقدم (أصفر)
  if (progress > 0) {
    return {
      bg: "bg-yellow",
      glow: "shadow-[0_0_25px_hsl(var(--yellow)/0.6)]",
      size: baseSize
    };
  }

  // 0% - لم يبدأ (رمادي)
  return {
    bg: "bg-muted/80",
    glow: "",
    size: baseSize
  };
};

// حساب نصف قطر الدائرة بالنسبة المئوية (تقريبي)
const getNodeRadiusPercent = (size: "small" | "medium" | "large", containerWidth: number, containerHeight: number) => {
  const radiusPx = size === "large" ? 28 : size === "medium" ? 22 : 16;
  // نحسب متوسط النسبة للعرض والارتفاع
  const radiusPercentX = (radiusPx / containerWidth) * 100;
  const radiusPercentY = (radiusPx / containerHeight) * 100;
  return { x: radiusPercentX, y: radiusPercentY };
};

const ProgressMap = ({ open, onClose }: ProgressMapProps) => {
  const { skills: skillNodes, activeMap, setActiveMap } = useSkills();
  const { getSkillProgress } = useSkillProgress();

  // حساب النسبة لكل مهارة
  // TEST MODE: Remove this after testing fluid animation
  const testProgressValues = [10, 25, 40, 50, 65, 75, 85, 100, 15, 30, 55, 70, 90, 20, 45];
  const getNodeProgress = (node: SkillNode, index?: number): number => {
    // TEST: Return different values for each node to test fluid
    if (typeof index === 'number') {
      return testProgressValues[index % testProgressValues.length];
    }
    if (!node.skillTag || !node.totalQuestions) return 0;
    const category = activeMap === "math" ? "math" : "verbal";
    return getSkillProgress(node.skillTag, node.totalQuestions, category);
  };

  const completedCount = skillNodes.filter(n => {
    if (!n.skillTag || !n.totalQuestions) return false;
    const category = activeMap === "math" ? "math" : "verbal";
    return getSkillProgress(n.skillTag, n.totalQuestions, category) === 100;
  }).length;
  const totalCount = skillNodes.filter(n => n.skillTag).length;

  const mapTitle = activeMap === "math" ? "خريطة الكمي" : "خريطة اللفظي";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-background overflow-hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: '5rem',
            bottom: 0,
            height: '100vh',
            zIndex: 40,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-background via-background/80 to-transparent">
            <div className="flex items-center gap-3">
              {activeMap === "math" ? (
                <Calculator className="w-6 h-6 text-yellow" />
              ) : (
                <BookOpen className="w-6 h-6 text-yellow" />
              )}
              <h1 className="text-2xl font-bold">{mapTitle}</h1>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalCount} مهارة مكتملة
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Map Toggle Button */}
              <motion.div
                className="flex items-center bg-card rounded-full p-1 gap-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.button
                  onClick={() => setActiveMap("math")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeMap === "math"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calculator className="w-4 h-4" />
                  الكمي
                </motion.button>
                <motion.button
                  onClick={() => setActiveMap("verbal")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeMap === "verbal"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-4 h-4" />
                  اللفظي
                </motion.button>
              </motion.div>

              <motion.button
                onClick={onClose}
                className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-turquoise/15 via-background to-primary/15">
            {/* Grid pattern background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}
            />

            {/* Ambient particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-turquoise/40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Skill nodes */}
            <div className="absolute inset-0" style={{ top: '80px', zIndex: 2 }}>
            {skillNodes.map((node, index) => {
              const progress = getNodeProgress(node, index); // TEST: passing index for test values
              const styles = getNodeStyles(node, progress);
              const isLocked = !node.skillTag;
              const isCompleted = progress === 100;
              const isInProgress = progress > 0 && progress < 100;

              return (
                <motion.div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                >
                  {/* Progress ring around node */}
                  {node.skillTag && !isLocked && progress > 0 && (
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        width: node.size === "large" ? 70 : node.size === "medium" ? 58 : 46,
                        height: node.size === "large" ? 70 : node.size === "medium" ? 58 : 46,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      {/* Background circle */}
                      <circle
                        cx="50%"
                        cy="50%"
                        r={node.size === "large" ? 32 : node.size === "medium" ? 26 : 20}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="3"
                        opacity="0.2"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50%"
                        cy="50%"
                        r={node.size === "large" ? 32 : node.size === "medium" ? 26 : 20}
                        fill="none"
                        stroke={isCompleted ? "hsl(var(--turquoise))" : "rgb(155, 89, 246)"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * (node.size === "large" ? 32 : node.size === "medium" ? 26 : 20)}
                        strokeDashoffset={2 * Math.PI * (node.size === "large" ? 32 : node.size === "medium" ? 26 : 20) * (1 - progress / 100)}
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: "center",
                          transition: "stroke-dashoffset 0.5s ease-in-out"
                        }}
                      />
                    </svg>
                  )}

                  {/* Node button */}
                  <motion.div
                    className={`relative ${styles.size} rounded-full ${styles.glow} flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden`}
                    style={{
                      background: (!isLocked && node.skillTag && progress > 0)
                        ? "hsl(var(--background))"
                        : undefined
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isInProgress ? {
                      boxShadow: [
                        "0 0 20px hsl(var(--yellow) / 0.4)",
                        "0 0 35px hsl(var(--yellow) / 0.6)",
                        "0 0 20px hsl(var(--yellow) / 0.4)"
                      ]
                    } : {}}
                    transition={isInProgress ? { duration: 2, repeat: Infinity } : { type: "spring", stiffness: 600, damping: 20 }}
                  >
                    {/* Dark background for water contrast */}
                    {!isLocked && node.skillTag && progress > 0 && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "hsl(var(--muted) / 0.3)" }}
                      />
                    )}
                    {/* Fluid water fill animation */}
                    {!isLocked && node.skillTag && progress > 0 && (
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        {/* Water body - fills from bottom */}
                        <div
                          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                          style={{
                            height: `${progress}%`,
                            background: isCompleted
                              ? "hsl(var(--turquoise))"
                              : "hsl(var(--yellow))",
                          }}
                        />
                        {/* Wave surface */}
                        <motion.div
                          className="absolute left-[-50%] w-[200%]"
                          style={{
                            bottom: `${progress - 8}%`,
                            height: '16%',
                          }}
                          animate={{
                            x: ["-25%", "0%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="w-full h-full">
                            <path
                              d="M0,10 C25,0 50,20 75,10 C100,0 125,20 150,10 C175,0 200,20 200,10 L200,20 L0,20 Z"
                              fill={isCompleted ? "hsl(var(--turquoise))" : "hsl(var(--yellow))"}
                            />
                          </svg>
                        </motion.div>
                        <motion.div
                          className="absolute left-[-50%] w-[200%]"
                          style={{
                            bottom: `${progress - 4}%`,
                            height: '10%',
                          }}
                          animate={{
                            x: ["0%", "-25%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="w-full h-full">
                            <path
                              d="M0,10 C25,20 50,0 75,10 C100,20 125,0 150,10 C175,20 200,0 200,10 L200,20 L0,20 Z"
                              fill={isCompleted ? "hsl(var(--turquoise) / 0.7)" : "hsl(var(--yellow) / 0.7)"}
                            />
                          </svg>
                        </motion.div>
                      </div>
                    )}

                    {/* Icon/content on top of fluid */}
                    <div className="relative z-10">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground/50" />
                    ) : isCompleted ? (
                      <Check className="w-5 h-5 text-turquoise-foreground" />
                    ) : node.skillTag ? (
                      <span className={`text-sm font-bold ${isInProgress ? "text-yellow-foreground" : "text-foreground/70"}`}>{progress}%</span>
                    ) : (
                      <span className="text-foreground/70">{getIcon(node.iconName)}</span>
                    )}
                    </div>
                  </motion.div>

                  {/* Title below node */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center pointer-events-none z-10">
                    <span className="text-xs font-semibold text-foreground whitespace-nowrap drop-shadow-sm">
                      {node.title}
                    </span>
                    {/* Answered/Total questions counter */}
                    {node.skillTag && node.totalQuestions && (
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {Math.round(progress / 100 * node.totalQuestions)}/{node.totalQuestions}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-turquoise" />
                <span>مكتمل (100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow" />
                <span>قيد التقدم</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted/80 ring-1 ring-foreground/20" />
                <span>لم يبدأ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted/40" />
                <span>مقفل</span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-3">
                <motion.button
                  className="px-4 py-2 bg-yellow text-yellow-foreground rounded-lg text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  استمر
                </motion.button>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">الخبرة</p>
                  <p className="text-sm font-bold text-yellow">٤٥٠ / ١٠٠٠ نقطة</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProgressMap;
