import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trophy, Zap, Star, Sparkles } from "lucide-react";

export const showLevelUpNotification = (level: number) => {
  toast.custom(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-[2px] rounded-2xl shadow-2xl"
      >
        <div className="bg-background rounded-2xl p-4 flex items-center gap-4">
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            <Zap className="w-7 h-7 text-white" />
          </motion.div>

          <div className="flex-1">
            <p className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              ارتقيت للمستوى {level}!
            </p>
            <p className="text-sm text-muted-foreground">أحسنت! واصل التقدم</p>
          </div>

          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0.4)", "0 0 0 10px rgba(251, 191, 36, 0)"] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-xl font-bold text-white">{level}</span>
          </motion.div>
        </div>
      </motion.div>
    ),
    { duration: 5000, position: "top-center" }
  );
};

export const showBadgeUnlockNotification = (badgeName: string, badgeDescription: string) => {
  toast.custom(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-[2px] rounded-2xl shadow-2xl"
      >
        <div className="bg-background rounded-2xl p-4 flex items-center gap-4">
          <motion.div
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Trophy className="w-7 h-7 text-white" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </motion.div>

          <div className="flex-1">
            <p className="text-xs text-purple-400 font-semibold mb-0.5">شارة جديدة!</p>
            <p className="text-lg font-bold">{badgeName}</p>
            <p className="text-sm text-muted-foreground">{badgeDescription}</p>
          </div>

          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
      </motion.div>
    ),
    { duration: 6000, position: "top-center" }
  );
};
