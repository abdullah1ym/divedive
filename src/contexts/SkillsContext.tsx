import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SkillNode {
  id: number;
  title: string;
  status: "completed" | "current" | "available" | "locked";
  x: number;
  y: number;
  iconName: string;
  color: string;
  size: "small" | "medium" | "large";
  connections: number[];
  skillTag?: string;       // ربط بـ skillTag الأسئلة
  totalQuestions?: number; // إجمالي أسئلة هذه المهارة
}

export type MapType = "math" | "verbal";

interface SkillsContextType {
  skills: SkillNode[];
  mathSkills: SkillNode[];
  verbalSkills: SkillNode[];
  activeMap: MapType;
  setActiveMap: (map: MapType) => void;
  addSkill: (skill: Omit<SkillNode, "id">) => void;
  updateSkill: (id: number, skill: Partial<SkillNode>) => void;
  deleteSkill: (id: number) => void;
  reorderSkill: (id: number, direction: "up" | "down") => void;
}

const defaultMathSkills: SkillNode[] = [
  { id: 1, title: "أساسيات الرياضيات", status: "available", x: 50, y: 15, iconName: "Calculator", color: "muted", size: "large", connections: [], skillTag: "basics", totalQuestions: 5 },
  { id: 2, title: "العمليات الحسابية", status: "available", x: 30, y: 35, iconName: "Plus", color: "muted", size: "medium", connections: [], skillTag: "arithmetic", totalQuestions: 5 },
  { id: 3, title: "النسب والتناسب", status: "available", x: 70, y: 35, iconName: "Percent", color: "muted", size: "medium", connections: [], skillTag: "ratios", totalQuestions: 10 },
  { id: 4, title: "الجبر والمعادلات", status: "available", x: 15, y: 55, iconName: "Sigma", color: "muted", size: "medium", connections: [], skillTag: "algebra", totalQuestions: 5 },
  { id: 5, title: "الهندسة", status: "available", x: 50, y: 55, iconName: "Shapes", color: "muted", size: "large", connections: [], skillTag: "geometry", totalQuestions: 5 },
  { id: 6, title: "الإحصاء والاحتمالات", status: "available", x: 85, y: 55, iconName: "BarChart", color: "muted", size: "medium", connections: [], skillTag: "statistics", totalQuestions: 5 },
  { id: 7, title: "المقارنة والتحليل", status: "available", x: 25, y: 75, iconName: "Scale", color: "muted", size: "medium", connections: [], skillTag: "comparison", totalQuestions: 5 },
  { id: 8, title: "الأسس واللوغاريتمات", status: "available", x: 50, y: 80, iconName: "Superscript", color: "muted", size: "small", connections: [], skillTag: "exponents", totalQuestions: 5 },
  { id: 9, title: "التفاضل والتكامل", status: "available", x: 75, y: 75, iconName: "TrendingUp", color: "muted", size: "medium", connections: [], skillTag: "calculus", totalQuestions: 5 },
  { id: 10, title: "إتقان الكمي", status: "locked", x: 50, y: 95, iconName: "Award", color: "jellyfish", size: "large", connections: [] },
];

const defaultVerbalSkills: SkillNode[] = [
  { id: 1, title: "أساسيات اللغة", status: "available", x: 50, y: 15, iconName: "BookOpen", color: "muted", size: "large", connections: [], skillTag: "language-basics", totalQuestions: 5 },
  { id: 2, title: "المفردات والمعاني", status: "available", x: 30, y: 35, iconName: "Type", color: "muted", size: "medium", connections: [], skillTag: "vocabulary", totalQuestions: 5 },
  { id: 3, title: "القواعد النحوية", status: "available", x: 70, y: 35, iconName: "FileText", color: "muted", size: "medium", connections: [], skillTag: "grammar", totalQuestions: 5 },
  { id: 4, title: "التناظر اللفظي", status: "available", x: 15, y: 55, iconName: "GitCompare", color: "muted", size: "medium", connections: [], skillTag: "analogy", totalQuestions: 5 },
  { id: 5, title: "استيعاب المقروء", status: "available", x: 50, y: 55, iconName: "FileSearch", color: "muted", size: "large", connections: [], skillTag: "reading", totalQuestions: 5 },
  { id: 6, title: "إكمال الجمل", status: "available", x: 85, y: 55, iconName: "PenLine", color: "muted", size: "medium", connections: [], skillTag: "completion", totalQuestions: 5 },
  { id: 7, title: "الخطأ السياقي", status: "available", x: 25, y: 75, iconName: "AlertCircle", color: "muted", size: "medium", connections: [], skillTag: "contextual-error", totalQuestions: 5 },
  { id: 8, title: "الارتباط والاختلاف", status: "locked", x: 50, y: 80, iconName: "Link", color: "muted", size: "small", connections: [] },
  { id: 9, title: "التحليل الأدبي", status: "locked", x: 75, y: 75, iconName: "Feather", color: "muted", size: "medium", connections: [] },
  { id: 10, title: "إتقان اللفظي", status: "locked", x: 50, y: 95, iconName: "Award", color: "jellyfish", size: "large", connections: [] },
];

const MATH_STORAGE_KEY = "dd-math-v10";
const VERBAL_STORAGE_KEY = "dd-verbal-v10";
const ACTIVE_MAP_KEY = "divedive-active-map";

// دمج البيانات المحفوظة مع الافتراضية لإضافة الحقول الجديدة
const mergeWithDefaults = (stored: SkillNode[], defaults: SkillNode[]): SkillNode[] => {
  return defaults.map(defaultNode => {
    const storedNode = stored.find(s => s.id === defaultNode.id);
    if (storedNode) {
      return {
        ...defaultNode,
        ...storedNode,
        skillTag: storedNode.skillTag || defaultNode.skillTag,
        totalQuestions: storedNode.totalQuestions || defaultNode.totalQuestions,
        connections: Array.isArray(storedNode.connections) ? storedNode.connections : [],
      };
    }
    return { ...defaultNode, connections: [] };
  });
};

// تم إزالة الريست التلقائي - الاتصالات تُحفظ الآن بشكل دائم

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider = ({ children }: { children: ReactNode }) => {
  const [activeMap, setActiveMap] = useState<MapType>(() => {
    const stored = localStorage.getItem(ACTIVE_MAP_KEY);
    return (stored as MapType) || "math";
  });

  const [mathSkills, setMathSkills] = useState<SkillNode[]>(() => {
    const stored = localStorage.getItem(MATH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return mergeWithDefaults(parsed, defaultMathSkills);
      } catch {
        return defaultMathSkills;
      }
    }
    return defaultMathSkills;
  });

  const [verbalSkills, setVerbalSkills] = useState<SkillNode[]>(() => {
    const stored = localStorage.getItem(VERBAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return mergeWithDefaults(parsed, defaultVerbalSkills);
      } catch {
        return defaultVerbalSkills;
      }
    }
    return defaultVerbalSkills;
  });

  const skills = activeMap === "math" ? mathSkills : verbalSkills;
  const setSkills = activeMap === "math" ? setMathSkills : setVerbalSkills;

  useEffect(() => {
    localStorage.setItem(ACTIVE_MAP_KEY, activeMap);
  }, [activeMap]);

  useEffect(() => {
    localStorage.setItem(MATH_STORAGE_KEY, JSON.stringify(mathSkills));
  }, [mathSkills]);

  useEffect(() => {
    localStorage.setItem(VERBAL_STORAGE_KEY, JSON.stringify(verbalSkills));
  }, [verbalSkills]);

  const addSkill = (skill: Omit<SkillNode, "id">) => {
    const newId = Math.max(...skills.map(s => s.id), 0) + 1;
    setSkills(prev => [...prev, { ...skill, id: newId }]);
  };

  const updateSkill = (id: number, updates: Partial<SkillNode>) => {
    setSkills(prev => prev.map(skill =>
      skill.id === id ? { ...skill, ...updates } : skill
    ));
  };

  const deleteSkill = (id: number) => {
    setSkills(prev => {
      // Remove the skill and remove it from all connections
      return prev
        .filter(skill => skill.id !== id)
        .map(skill => ({
          ...skill,
          connections: skill.connections.filter(connId => connId !== id)
        }));
    });
  };

  const reorderSkill = (id: number, direction: "up" | "down") => {
    setSkills(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      if (direction === "up" && index === 0) return prev;
      if (direction === "down" && index === prev.length - 1) return prev;

      const newSkills = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newSkills[index], newSkills[swapIndex]] = [newSkills[swapIndex], newSkills[index]];
      return newSkills;
    });
  };

  return (
    <SkillsContext.Provider value={{
      skills,
      mathSkills,
      verbalSkills,
      activeMap,
      setActiveMap,
      addSkill,
      updateSkill,
      deleteSkill,
      reorderSkill
    }}>
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
};
