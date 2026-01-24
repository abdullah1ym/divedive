import { useState, useEffect } from "react";
import { Search, MoreVertical, Brain, Flame, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Switch } from "@/components/ui/switch";
import ProfileModal from "./ProfileModal";

interface HeaderProps {
  onManageGuide?: () => void;
  onProfileClick?: () => void;
}

const Header = ({ onManageGuide, onProfileClick }: HeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { stats } = useUserProfile();
  const [hasReviewQuestions, setHasReviewQuestions] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if there are questions to review
  useEffect(() => {
    const checkReviewQuestions = () => {
      const saved = localStorage.getItem("reviewMistakes");
      if (saved) {
        const questions = JSON.parse(saved);
        setHasReviewQuestions(questions.length > 0);
      } else {
        setHasReviewQuestions(false);
      }
    };

    checkReviewQuestions();
    // Listen for storage changes
    window.addEventListener("storage", checkReviewQuestions);
    // Check periodically in case of same-tab changes
    const interval = setInterval(checkReviewQuestions, 1000);

    return () => {
      window.removeEventListener("storage", checkReviewQuestions);
      clearInterval(interval);
    };
  }, []);

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      setProfileOpen(true);
    }
  };

  return (
    <header className="h-14 md:h-16 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-3 md:px-6">
      {/* Right - Breadcrumb (RTL) - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <Brain className="w-4 h-4 text-turquoise" />
        <span className="text-muted-foreground">القدرات</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">التمارين</span>
      </div>

      {/* Mobile - Logo/Title */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-yellow flex items-center justify-center">
          <Brain className="w-5 h-5 text-yellow-foreground" />
        </div>
        <span className="font-bold text-lg">دايف دايف</span>
      </div>

      {/* Center - Search - Hidden on mobile */}
      <motion.div
        className="hidden md:block flex-1 max-w-md mx-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن سؤال أو تمرين..."
            className="w-full h-10 pr-11 pl-4 bg-muted rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right"
          />
        </div>
      </motion.div>

      {/* Left - Actions (RTL) */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle - Simplified on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-left">
            <p className="font-semibold text-sm">الوضع الداكن</p>
          </div>
          <Switch
            checked={mounted && resolvedTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className="data-[state=checked]:bg-turquoise"
          />
        </div>

        {/* Mobile theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={onManageGuide}
          className="hidden md:block px-4 py-2 bg-turquoise text-turquoise-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          راجع أخطاءك
        </button>

        <button className="hidden md:block p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* Profile Section */}
        <motion.div
          className="flex items-center gap-2 md:gap-3 cursor-pointer bg-muted/50 hover:bg-muted rounded-full pr-1 pl-2 md:pl-4 py-1 transition-colors"
          onClick={handleProfileClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Streak */}
          {stats.currentStreak > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{stats.currentStreak}</span>
            </div>
          )}

          {/* Level & XP - Hidden on mobile */}
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold">مستوى {stats.level}</p>
            <p className="text-[10px] text-muted-foreground">{stats.xp} XP</p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
              {stats.username.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-yellow text-yellow-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
              {stats.level}
            </div>
          </div>
        </motion.div>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
};

export default Header;
