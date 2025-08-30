import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, AlertTriangle, CheckCircle } from "lucide-react";

interface AssessmentPanelProps {
  scores: [string, number][];
  onSubmit: (choice: number, explanation: string) => void;
  isSubmitting?: boolean;
}

export const AssessmentPanel = ({ scores, onSubmit, isSubmitting }: AssessmentPanelProps) => {
  const [choice, setChoice] = useState<string>("");
  const [explanation, setExplanation] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = () => {
    if (!choice) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    onSubmit(parseInt(choice), explanation);
    setChoice("");
    setExplanation("");
  };

  return (
    <Card className="glass p-6 space-y-6 animate-slide-up">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Review and Assess</h3>
      </div>

      <div className="space-y-4">
        <Alert className="border-primary/20 bg-primary/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Two systems scored this candidate. One is biased, one is fair. 
            Can you identify the biased score?
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-4">
          {scores.map((score, index) => (
            <Card key={index} className="p-4 bg-gradient-card border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {score[1].toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Score {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">
            Which score do you believe is from the biased judge?
          </Label>
          
          <RadioGroup value={choice} onValueChange={setChoice}>
            <div className="space-y-3">
              {[1, 2].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={option.toString()} 
                    id={`choice-${option}`}
                    className="border-primary text-primary" 
                  />
                  <Label 
                    htmlFor={`choice-${option}`} 
                    className="text-sm font-medium cursor-pointer flex-1 p-3 border border-border/50 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    Score {option} ({scores[option - 1][1].toFixed(2)}) is the biased score
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {showWarning && (
            <Alert className="border-warning/50 bg-warning/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please make a selection before submitting.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="explanation" className="text-sm font-medium">
            Provide your reasoning (optional)
          </Label>
          <Textarea
            id="explanation"
            placeholder="Explain why you think this score is biased..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="default"
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Assessment
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};