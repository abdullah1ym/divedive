import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RecommendationPanel from "@/components/RecommendationPanel";
import CategoryTabs from "@/components/CategoryTabs";
import LessonGrid, { Collection } from "@/components/LessonGrid";
import BubbleDecoration from "@/components/BubbleDecoration";
import AdminPanel from "@/components/AdminPanel";
import ExerciseModal from "@/components/ExerciseModal";
import { Exercise } from "@/contexts/ExercisesContext";
import ProgressView from "@/components/views/ProgressView";
import SettingsView from "@/components/views/SettingsView";
import HelpView from "@/components/views/HelpView";
import LessonsView from "@/components/views/LessonsView";
import AchievementsView from "@/components/views/AchievementsView";
import FavoritesView from "@/components/views/FavoritesView";
import QuantitativeView from "@/components/views/QuantitativeView";
import VerbalView from "@/components/views/VerbalView";
import SkillMapView from "@/components/views/SkillMapView";
import ReviewMistakesView from "@/components/views/ReviewMistakesView";
import CollectionView from "@/components/views/CollectionView";
import ProfileView from "@/components/views/ProfileView";
import SimulationTestView from "@/components/views/SimulationTestView";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [activeCategory, setActiveCategory] = useState("quantitative");
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedMixedExercise, setSelectedMixedExercise] = useState<Exercise | null>(null);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  const handleExerciseClose = () => {
    setExerciseModalOpen(false);
    setSelectedExercise(null);
  };

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleCollectionBack = () => {
    setSelectedCollection(null);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleMixedExerciseBack = () => {
    setSelectedMixedExercise(null);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Clear any open views when changing sections
    setSelectedMixedExercise(null);
    setSelectedCollection(null);
  };

  const handleExerciseClickWithFullPage = (exercise: Exercise) => {
    // If it's a mixed exercise, open full page view
    if (exercise.category === "mixed" || exercise.type === "mixed") {
      setSelectedMixedExercise(exercise);
    } else if (exercise.id === "quant-2") {
      // النسب والتناسب - open with CollectionView for better features
      const howToSolveGuides: Record<string, string> = {
        "q1": "لإيجاد نسبة مئوية من عدد:\n\n١. حوّل النسبة المئوية إلى كسر عشري (اقسم على ١٠٠)\n٢. اضرب في العدد\n\nمثال: ٢٠٪ من ١٥٠\n= ٢٠ ÷ ١٠٠ × ١٥٠\n= ٠٫٢ × ١٥٠\n= ٣٠",
        "q2": "لحل التناسب أ:ب = ج:د\n\nاستخدم الضرب التبادلي:\nأ × د = ب × ج\n\nمثال: ٣:٥ = س:٢٠\n٣ × ٢٠ = ٥ × س\n٦٠ = ٥س\nس = ١٢",
        "q3": "لإيجاد قيمة مجهولة في نسبة:\n\n١. اكتب النسبة كتناسب\n٢. استخدم الضرب التبادلي\n\nمثال: ٤:٣ = ١٦:س\n٤ × س = ٣ × ١٦\n٤س = ٤٨\nس = ١٢",
        "q4": "لتبسيط النسبة:\n\n١. أوجد القاسم المشترك الأكبر (ق.م.أ)\n٢. اقسم كلا الطرفين على ق.م.أ\n\nمثال: ١٨:٢٤\nق.م.أ = ٦\n١٨÷٦ : ٢٤÷٦ = ٣:٤",
        "q5": "لتقسيم مبلغ بنسبة معينة:\n\n١. اجمع أجزاء النسبة\n٢. اقسم المبلغ على المجموع\n٣. اضرب في نصيب كل شخص\n\nمثال: ٢٠٠ بنسبة ٣:٢\nالمجموع = ٥\nنصيب الأول = ٣/٥ × ٢٠٠ = ١٢٠",
        "q6": "لإيجاد نسبة مئوية من عدد:\n\n١. حوّل النسبة المئوية إلى كسر عشري\n٢. اضرب في العدد\n\nمثال: ١٥٪ من ٢٠٠\n= ٠٫١٥ × ٢٠٠ = ٣٠",
        "q7": "إذا عُلمت النسبة وقيمة أحد الطرفين:\n\n١. اكتب النسبة ككسر\n٢. عوّض بالقيمة المعلومة\n٣. حل المعادلة\n\nمثال: أ:ب = ٢:٥، ب=٢٥\nأ/٢٥ = ٢/٥\nأ = ١٠",
        "q8": "لحساب نسبة الزيادة المئوية:\n\n١. احسب الفرق (الزيادة)\n٢. اقسم على القيمة الأصلية\n٣. اضرب في ١٠٠\n\nمثال: من ٨٠ إلى ١٠٠\nالزيادة = ٢٠\nالنسبة = ٢٠/٨٠ × ١٠٠ = ٢٥٪",
        "q9": "لحل نسبة ثلاثية:\n\n١. اجمع جميع الأجزاء\n٢. اقسم الكل على المجموع لإيجاد قيمة الجزء\n٣. اضرب في نصيب المطلوب\n\nمثال: ٢:٣:٥، المجموع=٥٠\nالأجزاء = ١٠، الجزء = ٥\nالأكبر = ٥×٥ = ٢٥",
        "q10": "لإيجاد العدد الأصلي من نسبته المئوية:\n\n١. اكتب المعادلة\n٢. حوّل النسبة لكسر عشري\n٣. اقسم على الكسر العشري\n\nمثال: ٤٠٪ من س = ٢٠\n٠٫٤ × س = ٢٠\nس = ٢٠ ÷ ٠٫٤ = ٥٠",
      };
      const ratiosCollection: Collection = {
        id: "quant-2-collection",
        name: exercise.title,
        description: exercise.description,
        category: "quantitative",
        hasFlipFeature: true,
        questions: exercise.questions.map((q, idx) => ({
          id: q.id,
          prompt: q.prompt,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: (q as any).explanation,
          skillTag: "ratios",
          howToSolve: howToSolveGuides[q.id],
          variants: (q as any).variants,
        })),
      };
      setSelectedCollection(ratiosCollection);
    } else {
      handleExerciseClick(exercise);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <BubbleDecoration />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-turquoise/5 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Main Content */}
      <div className="mr-20 relative z-10">
        <Header onManageGuide={() => setActiveSection("reviewMistakes")} onProfileClick={() => setActiveSection("profile")} />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === "home" || activeSection === "exercises" ? (
              selectedMixedExercise ? (
                <SimulationTestView exercise={selectedMixedExercise} onBack={handleMixedExerciseBack} />
              ) : selectedCollection ? (
                <CollectionView
                  collection={selectedCollection}
                  onBack={handleCollectionBack}
                />
              ) : (
                <>
                  {/* Hero + Recommendation Grid */}
                  <div className="grid grid-cols-3 gap-6 mb-8 items-stretch">
                    <div className="col-span-2 h-full">
                      <HeroSection />
                    </div>
                    <div className="col-span-1 h-full">
                      <RecommendationPanel />
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="mb-6">
                    <CategoryTabs
                      activeCategory={activeCategory}
                      onCategoryChange={handleCategoryChange}
                    />
                  </div>

                  {/* Lesson Grid */}
                  <LessonGrid
                    category={activeCategory}
                    onExerciseClick={handleExerciseClickWithFullPage}
                    onCollectionClick={handleCollectionClick}
                  />
                </>
              )
            ) : activeSection === "progress" ? (
              <ProgressView />
            ) : activeSection === "settings" ? (
              <SettingsView />
            ) : activeSection === "help" ? (
              <HelpView />
            ) : activeSection === "lessons" ? (
              <LessonsView />
            ) : activeSection === "skillmap" ? (
              <SkillMapView onGoHome={() => setActiveSection("home")} />
            ) : activeSection === "achievements" ? (
              <AchievementsView />
            ) : activeSection === "favorites" ? (
              <FavoritesView />
            ) : activeSection === "quantitative" ? (
              <QuantitativeView />
            ) : activeSection === "verbal" ? (
              <VerbalView />
            ) : activeSection === "reviewMistakes" ? (
              <ReviewMistakesView onBack={() => setActiveSection("home")} />
            ) : activeSection === "profile" ? (
              <ProfileView />
            ) : null}
          </div>
        </main>
      </div>

      {/* Admin Panel */}
      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />

      {/* Exercise Modal */}
      <ExerciseModal
        exercise={selectedExercise}
        open={exerciseModalOpen}
        onClose={handleExerciseClose}
      />
    </div>
  );
};

export default Index;
