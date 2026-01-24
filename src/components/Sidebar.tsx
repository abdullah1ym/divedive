import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  Settings,
  HelpCircle,
  BookOpen,
  Award,
  Bookmark,
  Calculator,
  FileText,
  Map
} from "lucide-react";
import Logo from "./Logo";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "home", icon: Home, label: "الرئيسية", group: "الرئيسية" },
  { id: "lessons", icon: BookOpen, label: "الدروس", group: "الرئيسية" },
];

const guideItems = [
  { id: "skillmap", icon: Map, label: "خريطة المهارات", group: "التعلم" },
  { id: "achievements", icon: Award, label: "الإنجازات", group: "التعلم" },
  { id: "favorites", icon: Bookmark, label: "المحفوظة", group: "التعلم" },
];

const resourceItems = [
  { id: "quantitative", icon: Calculator, label: "الكمي", group: "الموارد" },
  { id: "verbal", icon: FileText, label: "اللفظي", group: "الموارد" },
];

const systemItems = [
  { id: "settings", icon: Settings, label: "الإعدادات", group: "النظام" },
  { id: "progress", icon: BarChart3, label: "التقدم", group: "النظام" },
  { id: "help", icon: HelpCircle, label: "المساعدة", group: "النظام" },
];

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <>
    {/* Desktop Sidebar */}
    <aside className="hidden md:flex fixed right-0 top-0 h-screen w-20 bg-sidebar border-l border-sidebar-border flex-col items-center py-6 z-50">
      {/* Logo */}
      <motion.div
        className="mb-8"
        whileHover={{ scale: 1.1, rotate: -10 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center shadow-lg">
          <Logo className="w-6 h-6 text-yellow-foreground" />
        </div>
      </motion.div>

      {/* Main Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">الرئيسية</span>
        {menuItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Learning Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">التعلم</span>
        {guideItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Resources Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">الموارد</span>
        {resourceItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Spacer to push system items to bottom */}
      <div className="flex-1" />

      {/* System Section */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">النظام</span>
        {systemItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>
    </aside>

    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {[
          { id: "home", icon: Home, label: "الرئيسية" },
          { id: "skillmap", icon: Map, label: "المهارات" },
          { id: "lessons", icon: BookOpen, label: "الدروس" },
          { id: "progress", icon: BarChart3, label: "التقدم" },
          { id: "settings", icon: Settings, label: "الإعدادات" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
    </>
  );
};

interface SidebarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarButton = ({ icon: Icon, label, isActive, onClick }: SidebarButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${
        isActive
          ? "bg-primary text-primary-foreground shadow-lg"
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />

      {/* Tooltip */}
      <div className="absolute left-[-120px] px-3 py-1.5 bg-card rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-card z-50">
        {label}
      </div>
    </motion.button>
  );
};

export default Sidebar;
