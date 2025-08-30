import { useState, useCallback } from "react";
import { Assessment, Resume } from "@/types";
import { mockResumes, biasPersonas, aiMockScore } from "@/utils/mockData";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentResumeIndex, setCurrentResumeIndex] = useState(() => 
    Math.floor(Math.random() * mockResumes.length)
  );
  const [reportReady, setReportReady] = useState(false);

  const getCurrentResume = useCallback((): Resume => {
    return mockResumes[currentResumeIndex % mockResumes.length];
  }, [currentResumeIndex]);

  const generateNewCandidate = useCallback(() => {
    const newIndex = Math.floor(Math.random() * mockResumes.length);
    setCurrentResumeIndex(newIndex);
    setReportReady(false);
  }, []);

  const generateScores = useCallback((resume: Resume): [string, number][] => {
    const aiScore = aiMockScore(resume);
    const personaNames = Object.keys(biasPersonas);
    const randomPersona = personaNames[Math.floor(Math.random() * personaNames.length)];
    const personaScore = biasPersonas[randomPersona as keyof typeof biasPersonas](resume);
    
    const scores: [string, number][] = [
      ["AI Model", aiScore],
      [randomPersona, personaScore]
    ];
    
    // Shuffle the order randomly
    const shuffled = Math.random() > 0.5 ? [scores[0], scores[1]] : [scores[1], scores[0]];
    return shuffled;
  }, []);

  const submitAssessment = useCallback((
    resume: Resume,
    scores: [string, number][],
    choice: number,
    explanation: string
  ) => {
    const aiScore = scores.find(s => s[0] === "AI Model")?.[1] ?? 0;
    const personaScore = scores.find(s => s[0] !== "AI Model")?.[1] ?? 0;
    const personaName = scores.find(s => s[0] !== "AI Model")?.[0] ?? "";
    
    const correctAnswer = scores[choice - 1][0] !== "AI Model" ? 1 : 0;
    
    const assessment: Assessment = {
      resume,
      ai_score: aiScore,
      persona_score: personaScore,
      persona: personaName,
      choice,
      correct: correctAnswer,
      explanation,
      timestamp: new Date().toLocaleString()
    };

    setAssessments(prev => [...prev, assessment]);
    setReportReady(false);
  }, []);

  const runReport = useCallback(() => {
    setReportReady(true);
  }, []);

  return {
    assessments,
    currentResume: getCurrentResume(),
    reportReady,
    generateNewCandidate,
    generateScores,
    submitAssessment,
    runReport
  };
};