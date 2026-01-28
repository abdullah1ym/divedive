import { useState, useEffect } from "react";
import { Check, ChevronLeft, Save, Edit3, ArrowRight } from "lucide-react";
import { useExercises, Exercise } from "@/contexts/ExercisesContext";

type SubjectType = "verbal" | "quant" | null;
type BankNumber = number | null;

const QuickAnswerFixer = () => {
  const { exercises, updateExercise } = useExercises();
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>(null);
  const [selectedBank, setSelectedBank] = useState<BankNumber>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [localQuestions, setLocalQuestions] = useState<Exercise["questions"]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [editingExplanation, setEditingExplanation] = useState<number | null>(null);
  const [explanationText, setExplanationText] = useState("");

  // Categories that belong to bank 1
  const verbalBank1Categories = ["verbal", "analogy"];
  const quantBank1Categories = ["quantitative", "algebra"];

  // Get available banks for selected subject
  const getAvailableBanks = (subject: SubjectType): number[] => {
    if (!subject) return [];
    const banks = new Set<number>();

    // Check for bank 1 (original categories)
    const bank1Categories = subject === "verbal" ? verbalBank1Categories : quantBank1Categories;
    const hasBank1 = exercises.some(ex => bank1Categories.includes(ex.category));
    if (hasBank1) banks.add(1);

    // Check for bank 2+
    const prefix = subject === "verbal" ? "verbal-bank-" : "quant-bank-";
    exercises.forEach(ex => {
      if (ex.category.startsWith(prefix)) {
        const bankNum = parseInt(ex.category.replace(prefix, ""));
        if (!isNaN(bankNum)) banks.add(bankNum);
      }
    });
    return Array.from(banks).sort((a, b) => a - b);
  };

  // Get exercises for selected subject and bank
  const getExercisesForBank = (): Exercise[] => {
    if (!selectedSubject || !selectedBank) return [];

    // Bank 1 uses original category names
    if (selectedBank === 1) {
      const bank1Categories = selectedSubject === "verbal" ? verbalBank1Categories : quantBank1Categories;
      return exercises.filter(ex => bank1Categories.includes(ex.category));
    }

    // Bank 2+ uses prefixed category names
    const category = `${selectedSubject}-bank-${selectedBank}`;
    return exercises.filter(ex => ex.category === category);
  };

  // Exercise type labels for verbal
  const exerciseTypeLabels: Record<string, string> = {
    "التناظر اللفظي": "التناظر اللفظي",
    "إكمال الجمل": "إكمال الجمل",
    "الخطأ السياقي": "الخطأ السياقي",
    "استيعاب المقروء": "استيعاب المقروء",
  };

  const bankLabels: Record<number, string> = {
    1: "البنك الأول",
    2: "البنك الثاني",
    3: "البنك الثالث",
    4: "البنك الرابع",
    5: "البنك الخامس",
    6: "البنك السادس",
    7: "البنك السابع",
    8: "البنك الثامن",
  };

  useEffect(() => {
    if (selectedExercise) {
      setLocalQuestions([...selectedExercise.questions]);
      setHasChanges(false);
      setEditingExplanation(null);
    }
  }, [selectedExercise]);

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...localQuestions];
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      correctAnswer: optionIndex,
    };
    setLocalQuestions(newQuestions);
    setHasChanges(true);
  };

  const handleStartEditExplanation = (questionIndex: number) => {
    setEditingExplanation(questionIndex);
    setExplanationText(localQuestions[questionIndex].explanation || "");
  };

  const handleSaveExplanation = (questionIndex: number) => {
    const newQuestions = [...localQuestions];
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      explanation: explanationText,
    };
    setLocalQuestions(newQuestions);
    setHasChanges(true);
    setEditingExplanation(null);
  };

  const handleCancelEditExplanation = () => {
    setEditingExplanation(null);
    setExplanationText("");
  };

  const handleSave = () => {
    if (selectedExercise && hasChanges) {
      updateExercise(selectedExercise.id, {
        ...selectedExercise,
        questions: localQuestions,
      });
      setHasChanges(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    }
  };

  const handleBack = () => {
    if (selectedExercise) {
      setSelectedExercise(null);
    } else if (selectedBank) {
      setSelectedBank(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  const optionLabels = ["أ", "ب", "ج", "د", "هـ", "و"];

  // Get breadcrumb text
  const getBreadcrumb = () => {
    const parts: string[] = [];
    if (selectedSubject) {
      parts.push(selectedSubject === "verbal" ? "اللفظي" : "الكمي");
    }
    if (selectedBank) {
      parts.push(bankLabels[selectedBank]);
    }
    if (selectedExercise) {
      parts.push(selectedExercise.title);
    }
    return parts;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Navigation Panel */}
      <div className="bg-card rounded-2xl p-4 overflow-y-auto">
        {/* Breadcrumb & Back Button */}
        {(selectedSubject || selectedBank || selectedExercise) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع
          </button>
        )}

        {/* Breadcrumb */}
        {getBreadcrumb().length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
            {getBreadcrumb().map((part, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronLeft className="w-3 h-3" />}
                <span className={i === getBreadcrumb().length - 1 ? "text-foreground font-medium" : ""}>
                  {part}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Step 1: Choose Subject */}
        {!selectedSubject && (
          <>
            <h2 className="text-lg font-bold mb-4">اختر القسم</h2>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedSubject("verbal")}
                className="w-full p-4 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl text-right transition-colors"
              >
                <div className="font-bold text-lg">اللفظي</div>
                <div className="text-sm opacity-70">التناظر، إكمال الجمل، الخطأ السياقي...</div>
              </button>
              <button
                onClick={() => setSelectedSubject("quant")}
                className="w-full p-4 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl text-right transition-colors"
              >
                <div className="font-bold text-lg">الكمي</div>
                <div className="text-sm opacity-70">الحساب، الجبر، الهندسة...</div>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Choose Bank */}
        {selectedSubject && !selectedBank && (
          <>
            <h2 className="text-lg font-bold mb-4">اختر البنك</h2>
            <div className="space-y-2">
              {getAvailableBanks(selectedSubject).map(bankNum => (
                <button
                  key={bankNum}
                  onClick={() => setSelectedBank(bankNum)}
                  className="w-full p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl text-right transition-colors"
                >
                  <div className="font-medium">{bankLabels[bankNum]}</div>
                </button>
              ))}
              {getAvailableBanks(selectedSubject).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد بنوك متاحة
                </p>
              )}
            </div>
          </>
        )}

        {/* Step 3: Choose Exercise (for verbal) or show exercises directly (for quant) */}
        {selectedSubject && selectedBank && !selectedExercise && (
          <>
            <h2 className="text-lg font-bold mb-4">اختر التمرين</h2>
            <div className="space-y-2">
              {getExercisesForBank().map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl text-right transition-colors"
                >
                  <div className="font-medium">{exercise.title}</div>
                  <div className="text-xs opacity-70">{exercise.questions.length} سؤال</div>
                </button>
              ))}
              {getExercisesForBank().length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد تمارين متاحة
                </p>
              )}
            </div>
          </>
        )}

        {/* Show selected exercise info */}
        {selectedExercise && (
          <div className="p-3 bg-primary/10 rounded-xl">
            <div className="font-bold">{selectedExercise.title}</div>
            <div className="text-sm text-muted-foreground">{selectedExercise.questions.length} سؤال</div>
          </div>
        )}
      </div>

      {/* Questions Editor */}
      <div className="lg:col-span-2 bg-card rounded-2xl p-4 overflow-hidden flex flex-col">
        {selectedExercise ? (
          <>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-card pb-2 z-10">
              <div>
                <h2 className="text-lg font-bold">{selectedExercise.title}</h2>
                <p className="text-sm text-muted-foreground">{localQuestions.length} سؤال - اضغط على الإجابة الصحيحة</p>
              </div>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  hasChanges
                    ? "bg-turquoise text-turquoise-foreground hover:bg-turquoise/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                {savedMessage ? "تم الحفظ!" : "حفظ التغييرات"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {localQuestions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="border border-border rounded-xl p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <p className="font-medium text-base flex-1">{question.prompt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mr-11 mb-3">
                    {question.options.map((option, oIndex) => (
                      option && (
                        <button
                          key={oIndex}
                          onClick={() => handleSelectAnswer(qIndex, oIndex)}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm text-right transition-all ${
                            question.correctAnswer === oIndex
                              ? "bg-turquoise text-turquoise-foreground ring-2 ring-turquoise"
                              : "bg-muted hover:bg-muted/80 hover:ring-2 hover:ring-primary/30"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            question.correctAnswer === oIndex
                              ? "bg-white/20"
                              : "bg-background"
                          }`}>
                            {question.correctAnswer === oIndex ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              optionLabels[oIndex]
                            )}
                          </span>
                          <span className="flex-1 truncate">{option}</span>
                        </button>
                      )
                    ))}
                  </div>

                  {/* Explanation Section */}
                  <div className="mr-11 border-t border-border pt-2">
                    {editingExplanation === qIndex ? (
                      <div className="space-y-2">
                        <textarea
                          value={explanationText}
                          onChange={(e) => setExplanationText(e.target.value)}
                          className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          rows={2}
                          placeholder="اكتب الشرح هنا..."
                          dir="rtl"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveExplanation(qIndex)}
                            className="px-3 py-1 bg-turquoise text-turquoise-foreground text-xs rounded-lg"
                          >
                            حفظ الشرح
                          </button>
                          <button
                            onClick={handleCancelEditExplanation}
                            className="px-3 py-1 bg-muted text-xs rounded-lg"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <p className="text-xs text-muted-foreground flex-1">
                          <span className="font-medium text-orange-500">الشرح: </span>
                          {question.explanation || "لا يوجد شرح"}
                        </p>
                        <button
                          onClick={() => handleStartEditExplanation(qIndex)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="تعديل الشرح"
                        >
                          <Edit3 className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">مصحح الإجابات السريع</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              اختر تمريناً من القائمة ثم اضغط على الإجابة الصحيحة لكل سؤال.
              <br />
              يمكنك أيضاً تعديل الشرح بالضغط على أيقونة القلم.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAnswerFixer;
