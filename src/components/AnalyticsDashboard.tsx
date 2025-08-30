import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, TrendingUp, Download, AlertCircle } from "lucide-react";
import { Assessment, PerformanceStats, BiasMetrics } from "@/types";
import { MetricCard } from "./MetricCard";
import { binomialTest, klDivergence, jsDivergence, earthMoversDistance } from "@/utils/mockData";

interface AnalyticsDashboardProps {
  assessments: Assessment[];
  onRunReport: () => void;
  reportReady: boolean;
}

export const AnalyticsDashboard = ({ assessments, onRunReport, reportReady }: AnalyticsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("performance");

  if (assessments.length === 0) {
    return (
      <Card className="glass p-8 text-center animate-slide-up">
        <div className="space-y-4">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold">Fairness Analytics</h3>
          <p className="text-muted-foreground">
            Complete a few assessments to view comprehensive analytics
          </p>
          <Button variant="outline" disabled>
            <AlertCircle className="h-4 w-4 mr-2" />
            No Data Available
          </Button>
        </div>
      </Card>
    );
  }

  const performanceStats: PerformanceStats = {
    correct: assessments.filter(a => a.correct === 1).length,
    total: assessments.length,
    accuracy: assessments.filter(a => a.correct === 1).length / assessments.length,
    p_value: binomialTest(assessments.filter(a => a.correct === 1).length, assessments.length, 0.5)
  };

  const aiScores = assessments.map(a => a.ai_score);
  const personaScores = assessments.map(a => a.persona_score);

  const biasMetrics: BiasMetrics = {
    kl_divergence: klDivergence(aiScores, personaScores),
    js_divergence: jsDivergence(aiScores, personaScores),
    earth_movers_distance: earthMoversDistance(aiScores, personaScores)
  };

  return (
    <Card className="glass p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Fairness Analytics</h3>
        </div>
        <Button 
          onClick={onRunReport}
          variant={reportReady ? "success" : "default"}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Run Report
        </Button>
      </div>

      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Submit several assessments, then click Run Report to view comprehensive analysis.
        </AlertDescription>
      </Alert>

      {reportReady && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <h4 className="text-lg font-semibold">Performance Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="Correctly Identified"
                value={`${performanceStats.correct}/${performanceStats.total}`}
                subtitle="Biased scores detected"
                variant="success"
              />
              <MetricCard
                title="Identification Rate"
                value={`${(performanceStats.accuracy * 100).toFixed(1)}%`}
                subtitle="Overall accuracy"
                variant="accent"
              />
              <MetricCard
                title="Statistical Significance"
                value={performanceStats.p_value.toFixed(4)}
                subtitle="p-value (lower is better)"
                variant={performanceStats.p_value < 0.05 ? "success" : "default"}
              />
            </div>
            <Alert className="border-accent/20 bg-accent/5">
              <AlertDescription>
                A p-value below 0.05 suggests your performance is statistically significant.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="bias" className="space-y-4">
            <h4 className="text-lg font-semibold">Scoring Discrepancies</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="KL Divergence"
                value={biasMetrics.kl_divergence.toFixed(4)}
                subtitle="Information divergence"
              />
              <MetricCard
                title="JS Divergence"
                value={biasMetrics.js_divergence.toFixed(4)}
                subtitle="Jensen-Shannon divergence"
              />
              <MetricCard
                title="Earth Mover's Distance"
                value={biasMetrics.earth_movers_distance.toFixed(4)}
                subtitle="Distribution distance"
              />
            </div>
            <Alert className="border-warning/20 bg-warning/5">
              <AlertDescription>
                Higher values indicate greater differences in scoring patterns between AI and biased systems.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <h4 className="text-lg font-semibold">Score Distribution Analysis</h4>
            <Card className="p-6 bg-gradient-card">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">AI Scores</h5>
                    <div className="text-2xl font-bold text-primary">
                      {aiScores.length > 0 ? (aiScores.reduce((a, b) => a + b, 0) / aiScores.length).toFixed(3) : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Biased Persona Scores</h5>
                    <div className="text-2xl font-bold text-secondary">
                      {personaScores.length > 0 ? (personaScores.reduce((a, b) => a + b, 0) / personaScores.length).toFixed(3) : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    Score distributions show the difference between unbiased AI and biased persona scoring patterns.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="mitigation" className="space-y-4">
            <h4 className="text-lg font-semibold">Bias Mitigation</h4>
            <Card className="p-6 bg-gradient-card">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Our system can apply mitigation techniques to adjust scores and enhance fairness.
                </p>
                <MetricCard
                  title="Adjusted Average Score"
                  value={
                    aiScores.length > 0 
                      ? ((aiScores.reduce((a, b) => a + b, 0) + personaScores.reduce((a, b) => a + b, 0)) / (aiScores.length + personaScores.length)).toFixed(3)
                      : "N/A"
                  }
                  subtitle="Reweighted scoring"
                  variant="success"
                />
                <div className="pt-4">
                  <Button variant="accent" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Compliance Report
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
};