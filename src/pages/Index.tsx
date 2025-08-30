import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HeroSection } from "@/components/HeroSection";
import { CandidateProfile } from "@/components/CandidateProfile";
import { AssessmentPanel } from "@/components/AssessmentPanel";
import { AssessmentHistory } from "@/components/AssessmentHistory";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { useAssessments } from "@/hooks/useAssessments";

const Index = () => {
  const { toast } = useToast();
  const [showAssessment, setShowAssessment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScores, setCurrentScores] = useState<[string, number][]>([]);
  
  const {
    assessments,
    currentResume,
    reportReady,
    generateNewCandidate,
    generateScores,
    submitAssessment,
    runReport
  } = useAssessments();

  const handleGetStarted = () => {
    setShowAssessment(true);
    // Initialize scores immediately
    const initialScores = generateScores(currentResume);
    setCurrentScores(initialScores);
  };

  const handleGenerateNewCandidate = () => {
    generateNewCandidate();
    // Generate scores for the new candidate
    const newScores = generateScores(currentResume);
    setCurrentScores(newScores);
  };

  const handleSubmitAssessment = async (choice: number, explanation: string) => {
    setIsSubmitting(true);
    
    try {
      submitAssessment(currentResume, currentScores, choice, explanation);
      
      toast({
        title: "Assessment Submitted!",
        description: "Your assessment has been recorded. Generate a new candidate to continue.",
        variant: "default"
      });
      
      // Auto-generate new candidate after successful submission
      setTimeout(() => {
        handleGenerateNewCandidate();
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  if (!showAssessment) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <HeroSection onGetStarted={handleGetStarted} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Assessment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CandidateProfile 
            resume={currentResume}
            onGenerate={handleGenerateNewCandidate}
          />
          <AssessmentPanel
            scores={currentScores}
            onSubmit={handleSubmitAssessment}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* History Section */}
        {assessments.length > 0 && (
          <AssessmentHistory assessments={assessments} />
        )}

        {/* Analytics Section */}
        <AnalyticsDashboard
          assessments={assessments}
          onRunReport={runReport}
          reportReady={reportReady}
        />
      </div>
    </div>
  );
};

export default Index;
