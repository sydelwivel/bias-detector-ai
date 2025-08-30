import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-gradient-card animate-fade-in">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative z-10 p-12 text-center space-y-6">
        <div className="hero-gradient bg-clip-text text-transparent inline-block">
          <h1 className="text-5xl font-bold mb-4 animate-float">
            Reverse Turing Test
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Evaluate your ability to identify biased AI scoring models. 
          Your assessments help improve fairness in AI-driven hiring processes.
        </p>
        <div className="pt-4">
          <Button 
            variant="hero" 
            size="xl"
            onClick={onGetStarted}
            className="animate-glow"
          >
            Begin Assessment
          </Button>
        </div>
      </div>
    </Card>
  );
};