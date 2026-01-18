import { LearningUnit } from "@/types/units";

// Quantitative Units
import { mentalMathUnit } from "./quantitative/mental-math";
import { algebraUnit } from "./quantitative/algebra";
import { geometryUnit } from "./quantitative/geometry";
import { statisticsUnit } from "./quantitative/statistics";
import { comparisonUnit } from "./quantitative/comparison";

// Verbal Units
import { readingComprehensionUnit } from "./verbal/reading-comprehension";
import { sentenceCompletionUnit } from "./verbal/sentence-completion";
import { verbalAnalogyUnit } from "./verbal/verbal-analogy";
import { contextualErrorUnit } from "./verbal/contextual-error";
import { vocabularyUnit } from "./verbal/vocabulary";

// جميع الوحدات
export const allUnits: LearningUnit[] = [
  // Quantitative
  mentalMathUnit,
  algebraUnit,
  geometryUnit,
  statisticsUnit,
  comparisonUnit,
  // Verbal
  readingComprehensionUnit,
  sentenceCompletionUnit,
  verbalAnalogyUnit,
  contextualErrorUnit,
  vocabularyUnit,
];

// الوحدات حسب التصنيف
export const quantitativeUnits = allUnits.filter(u => u.category === "quantitative");
export const verbalUnits = allUnits.filter(u => u.category === "verbal");

// دوال مساعدة
export const getUnitBySlug = (slug: string) => allUnits.find(u => u.slug === slug);
export const getUnitById = (id: string) => allUnits.find(u => u.id === id);

// تصدير الوحدات الفردية
export {
  // Quantitative
  mentalMathUnit,
  algebraUnit,
  geometryUnit,
  statisticsUnit,
  comparisonUnit,
  // Verbal
  readingComprehensionUnit,
  sentenceCompletionUnit,
  verbalAnalogyUnit,
  contextualErrorUnit,
  vocabularyUnit,
};
