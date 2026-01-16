import { useState } from "react";
import { Search, Star, MoreVertical, Brain, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useUserProfile } from "@/contexts/UserProfileContext";
import ProfileModal from "./ProfileModal";

interface HeaderProps {
  onManageGuide?: () => void;
  onProfileClick?: () => void;
}

const Header = ({ onManageGuide, onProfileClick }: HeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { stats } = useUserProfile();

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      setProfileOpen(true);
    }
  };

  return (
    <header className="h-16 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
      {/* Right - Breadcrumb (RTL) */}
      <div className="flex items-center gap-2 text-sm">
        <Brain className="w-4 h-4 text-turquoise" />
        <span className="text-muted-foreground">القدرات</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">التمارين</span>
      </div>

      {/* Center - Search */}
      <motion.div
        className="flex-1 max-w-md mx-8"
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
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Star className="w-4 h-4" />
          <span>المفضلة</span>
        </button>

        <button
          onClick={onManageGuide}
          className="px-4 py-2 bg-turquoise text-turquoise-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          إدارة التقدم
        </button>

        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* Profile Section */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer bg-muted/50 hover:bg-muted rounded-full pr-1 pl-4 py-1 transition-colors"
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

          {/* Level & XP */}
          <div className="text-left">
            <p className="text-xs font-semibold">مستوى {stats.level}</p>
            <p className="text-[10px] text-muted-foreground">{stats.xp} XP</p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
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
