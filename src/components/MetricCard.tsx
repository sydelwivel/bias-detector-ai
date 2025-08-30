import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}

const variantStyles = {
  default: "bg-gradient-card border-border",
  success: "bg-gradient-success border-success/30",
  warning: "bg-gradient-primary border-warning/30",
  accent: "bg-gradient-accent border-accent/30"
};

export const MetricCard = ({ title, value, subtitle, variant = "default", className }: MetricCardProps) => {
  return (
    <Card className={cn(
      "metric-card p-6 animate-slide-up",
      variantStyles[variant],
      className
    )}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};