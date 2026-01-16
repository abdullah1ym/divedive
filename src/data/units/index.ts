import { LearningUnit } from "@/types/units";
import { mentalMathUnit } from "./quantitative/mental-math";

// جميع الوحدات
export const allUnits: LearningUnit[] = [
  mentalMathUnit,
  // سيتم إضافة المزيد من الوحدات هنا
];

// الوحدات حسب التصنيف
export const quantitativeUnits = allUnits.filter(u => u.category === "quantitative");
export const verbalUnits = allUnits.filter(u => u.category === "verbal");

// دوال مساعدة
export const getUnitBySlug = (slug: string) => allUnits.find(u => u.slug === slug);
export const getUnitById = (id: string) => allUnits.find(u => u.id === id);
