import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, History, CheckCircle, XCircle } from "lucide-react";
import { Assessment } from "@/types";

interface AssessmentHistoryProps {
  assessments: Assessment[];
}

export const AssessmentHistory = ({ assessments }: AssessmentHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (assessments.length === 0) return null;

  const accuracy = assessments.filter(a => a.correct === 1).length / assessments.length;

  return (
    <Card className="glass p-6 animate-slide-up">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Assessment History</span>
              <Badge variant="secondary" className="ml-2">
                {assessments.length} assessments
              </Badge>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className="p-3 bg-gradient-success text-center">
              <div className="text-2xl font-bold">{(accuracy * 100).toFixed(1)}%</div>
              <div className="text-sm text-success-foreground/80">Accuracy</div>
            </Card>
            <Card className="p-3 bg-gradient-card text-center border-border/50">
              <div className="text-2xl font-bold">{assessments.length}</div>
              <div className="text-sm text-muted-foreground">Total Attempts</div>
            </Card>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {assessments.map((assessment, index) => (
              <Card key={index} className="p-4 bg-muted/30 border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {assessment.correct === 1 ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="font-medium text-sm">
                      {assessment.resume.name}
                    </span>
                  </div>
                  <Badge variant={assessment.correct === 1 ? "default" : "destructive"}>
                    {assessment.correct === 1 ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Biased Persona: {assessment.persona}</div>
                  <div>Your Choice: Score {assessment.choice}</div>
                  <div>{assessment.timestamp}</div>
                  {assessment.explanation && (
                    <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                      "{assessment.explanation}"
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};