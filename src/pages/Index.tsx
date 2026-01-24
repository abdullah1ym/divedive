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
    // Scroll to top on section change
    window.scrollTo(0, 0);
  };

  const handleExerciseClickWithFullPage = (exercise: Exercise) => {
    // If it's a mixed exercise, open full page view
    if (exercise.category === "mixed" || exercise.type === "mixed") {
      setSelectedMixedExercise(exercise);
    } else if (exercise.id === "quant-2") {
      // النسب والتناسب - open with CollectionView for better features
      const howToSolveGuides: Record<string, string> = {
        "q1": "لإيجاد نسبة مئوية من عدد:\n\n١. حوّل النسبة المئوية إلى كسر عشري (اقسم على ١٠٠)\n٢. اضرب في العدد\n\nمثال: ١٠٪ من ٨٠\n= ١٠ ÷ ١٠٠ × ٨٠\n= ٠٫١ × ٨٠\n= ٨",
        "q2": "لحل التناسب أ:ب = ج:د\n\nاستخدم الضرب التبادلي:\nأ × د = ب × ج\n\nمثال: ٢:٤ = س:٨\n٢ × ٨ = ٤ × س\n١٦ = ٤س\nس = ٤",
        "q3": "لإيجاد قيمة مجهولة في نسبة:\n\n١. اكتب النسبة كتناسب\n٢. استخدم الضرب التبادلي\n\nمثال: ٢:٥ = ٦:س\n٢ × س = ٥ × ٦\n٢س = ٣٠\nس = ١٥",
        "q4": "لتبسيط النسبة:\n\n١. أوجد القاسم المشترك الأكبر (ق.م.أ)\n٢. اقسم كلا الطرفين على ق.م.أ\n\nمثال: ١٢:١٦\nق.م.أ = ٤\n١٢÷٤ : ١٦÷٤ = ٣:٤",
        "q5": "لتقسيم مبلغ بنسبة معينة:\n\n١. اجمع أجزاء النسبة\n٢. اقسم المبلغ على المجموع\n٣. اضرب في نصيب كل شخص\n\nمثال: ١٠٠ ريال بنسبة ١:٤\nالمجموع = ٥\nنصيب الأول = ١/٥ × ١٠٠ = ٢٠",
        "q6": "لإيجاد نسبة مئوية من عدد:\n\n١. حوّل النسبة المئوية إلى كسر عشري\n٢. اضرب في العدد\n\nمثال: ٥٠٪ من ٦٠\n= ٠٫٥ × ٦٠ = ٣٠",
        "q7": "إذا عُلمت النسبة وقيمة أحد الطرفين:\n\n١. اكتب النسبة ككسر\n٢. عوّض بالقيمة المعلومة\n٣. حل المعادلة\n\nمثال: أ:ب = ٣:٦، ب=١٢\nأ/١٢ = ٣/٦\nأ = ٦",
        "q8": "لحساب نسبة الزيادة المئوية:\n\n١. احسب الفرق (الزيادة)\n٢. اقسم على القيمة الأصلية\n٣. اضرب في ١٠٠\n\nمثال: من ٤٠ إلى ٥٠\nالزيادة = ١٠\nالنسبة = ١٠/٤٠ × ١٠٠ = ٢٥٪",
        "q9": "لحل نسبة ثلاثية:\n\n١. اجمع جميع الأجزاء\n٢. اقسم الكل على المجموع لإيجاد قيمة الجزء\n٣. اضرب في نصيب المطلوب\n\nمثال: ١:٢:٢، المجموع=٢٥\nالأجزاء = ٥، الجزء = ٥\nالأكبر = ٢×٥ = ١٠",
        "q10": "لإيجاد العدد الأصلي من نسبته المئوية:\n\n١. اكتب المعادلة\n٢. حوّل النسبة لكسر عشري\n٣. اقسم على الكسر العشري\n\nمثال: ٥٠٪ من س = ٣٠\n٠٫٥ × س = ٣٠\nس = ٣٠ ÷ ٠٫٥ = ٦٠",
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
