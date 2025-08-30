import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Code } from "lucide-react";
import { Resume } from "@/types";

interface CandidateProfileProps {
  resume: Resume;
  onGenerate: () => void;
}

export const CandidateProfile = ({ resume, onGenerate }: CandidateProfileProps) => {
  return (
    <Card className="glass p-6 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Candidate Profile
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onGenerate}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Generate New
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-4">
          <h4 className="font-semibold text-lg">{resume.name}</h4>
          <div className="space-y-2 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {resume.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {resume.phone}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {resume.location}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="font-medium">Education</span>
            </div>
            <p className="text-sm text-muted-foreground">{resume.education}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-secondary" />
              <span className="font-medium">Experience</span>
            </div>
            <p className="text-sm text-muted-foreground">{resume.experience}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-accent" />
              <span className="font-medium">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {resume.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};