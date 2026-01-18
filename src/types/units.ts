// ============================================
// أنواع المحتوى التعليمي
// ============================================

export type ContentType =
  | 'text'           // نص توضيحي
  | 'example'        // مثال محلول
  | 'tip'            // نصيحة سريعة
  | 'formula'        // معادلة أو قاعدة
  | 'image';         // صورة توضيحية

export interface LessonContent {
  id: string;
  type: ContentType;
  title?: string;
  content: string;
  example?: {
    problem: string;
    steps: string[];
    solution: string;
  };
  imageUrl?: string;
}

// ============================================
// الدرس التأسيسي
// ============================================

export interface FoundationalLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  contents: LessonContent[];
  keyPoints: string[];
}

// ============================================
// السؤال
// ============================================

export interface UnitQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'practice' | 'collection';
  year?: number;
  tags?: string[];
}

// ============================================
// مجموعة التمارين
// ============================================

export interface ExerciseSet {
  id: string;
  title: string;
  type: 'practice' | 'collection';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: UnitQuestion[];
  timeLimit?: number;
}

// ============================================
// الوحدة التعليمية
// ============================================

export interface LearningUnit {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'quantitative' | 'verbal';
  topic: string;
  icon: string;
  color: string;
  order: number;
  foundationalLesson?: FoundationalLesson;
  exerciseSets: ExerciseSet[];
  totalQuestions: number;
  estimatedDuration: string;
}

// ============================================
// تقدم الطالب
// ============================================

export interface ExerciseSetProgress {
  setId: string;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedAt?: string;
}

export interface UnitProgress {
  unitId: string;
  lessonWatched: boolean;
  lessonCompletedAt?: string;
  exerciseProgress: ExerciseSetProgress[];
  overallProgress: number;
  accuracy: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
  lastAttemptAt?: string;
  strugglePoints: string[];
  needsLessonReview: boolean;
}

// ============================================
// الاقتراحات الذكية
// ============================================

export type RecommendationType =
  | 'review_lesson'
  | 'retry_easy'
  | 'continue'
  | 'try_harder'
  | 'take_break';

export interface SmartRecommendation {
  type: RecommendationType;
  unitId: string;
  message: string;
  reason: string;
  priority: number;
}
