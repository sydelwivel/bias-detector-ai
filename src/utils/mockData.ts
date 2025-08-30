import { Resume } from "@/types";

// Mock resume data for demonstration
export const mockResumes: Resume[] = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "(555) 123-4567",
    education: "Stanford University - Computer Science, B.S.",
    experience: "Software Engineer at Google, 3 years",
    skills: ["JavaScript", "Python", "React", "Machine Learning"],
    location: "San Francisco, CA"
  },
  {
    name: "Marcus Johnson",
    email: "marcus.j@email.com", 
    phone: "(555) 987-6543",
    education: "MIT - Electrical Engineering, M.S.",
    experience: "Senior Developer at Microsoft, 5 years",
    skills: ["C++", "Python", "Azure", "Deep Learning"],
    location: "Seattle, WA"
  },
  {
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "(555) 456-7890",
    education: "UC Berkeley - Data Science, B.S.",
    experience: "Data Scientist at Netflix, 2 years",
    skills: ["Python", "R", "SQL", "TensorFlow"],
    location: "Los Angeles, CA"
  },
  {
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    phone: "(555) 321-0987",
    education: "Carnegie Mellon - AI/ML, Ph.D.",
    experience: "Research Engineer at OpenAI, 4 years",
    skills: ["Python", "PyTorch", "NLP", "Computer Vision"],
    location: "Pittsburgh, PA"
  }
];

// Mock bias personas that create unfair scoring
export const biasPersonas = {
  "Gender Biased Judge": (resume: Resume) => {
    const baseScore = Math.random() * 0.4 + 0.3; // 0.3-0.7
    // Bias against female names
    const femaleNames = ["Sarah", "Priya", "Jessica", "Emma", "Olivia"];
    const isFemale = femaleNames.some(name => resume.name.includes(name));
    return isFemale ? baseScore * 0.7 : baseScore * 1.2;
  },
  
  "Experience Biased Judge": (resume: Resume) => {
    const baseScore = Math.random() * 0.4 + 0.3;
    // Extreme bias for experience
    const hasHighExperience = resume.experience.includes("Senior") || 
                              resume.experience.includes("5 years") ||
                              resume.experience.includes("4 years");
    return hasHighExperience ? Math.min(0.95, baseScore * 1.8) : baseScore * 0.5;
  },
  
  "Education Biased Judge": (resume: Resume) => {
    const baseScore = Math.random() * 0.4 + 0.3;
    // Strong bias for prestigious universities
    const prestigiousSchools = ["Stanford", "MIT", "Harvard", "Berkeley"];
    const hasPrestigiousEducation = prestigiousSchools.some(school => 
      resume.education.includes(school)
    );
    return hasPrestigiousEducation ? Math.min(0.98, baseScore * 1.7) : baseScore * 0.6;
  },
  
  "Location Biased Judge": (resume: Resume) => {
    const baseScore = Math.random() * 0.4 + 0.3;
    // Bias for tech hubs
    const techHubs = ["San Francisco", "Seattle", "Austin", "Boston"];
    const inTechHub = techHubs.some(city => resume.location.includes(city));
    return inTechHub ? Math.min(0.92, baseScore * 1.5) : baseScore * 0.7;
  }
};

// AI mock scoring (unbiased)
export const aiMockScore = (resume: Resume): number => {
  // Simple scoring based on multiple factors
  let score = 0.5; // base score
  
  // Education factor
  if (resume.education.includes("Ph.D.")) score += 0.15;
  else if (resume.education.includes("M.S.")) score += 0.1;
  else if (resume.education.includes("B.S.")) score += 0.05;
  
  // Experience factor
  const expMatch = resume.experience.match(/(\d+)\s+years?/);
  if (expMatch) {
    const years = parseInt(expMatch[1]);
    score += Math.min(0.2, years * 0.04);
  }
  
  // Skills factor
  score += Math.min(0.15, resume.skills.length * 0.03);
  
  // Add some randomness
  score += (Math.random() - 0.5) * 0.1;
  
  return Math.max(0.1, Math.min(0.95, score));
};

// Statistical functions for analysis
export const binomialTest = (successes: number, trials: number, p0: number = 0.5): number => {
  if (trials === 0) return 1;
  // Simplified p-value calculation
  const observed = successes / trials;
  const expected = p0;
  const variance = (p0 * (1 - p0)) / trials;
  const z = (observed - expected) / Math.sqrt(variance);
  return 2 * (1 - normalCDF(Math.abs(z)));
};

const normalCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

const erf = (x: number): number => {
  // Approximation of error function
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

export const klDivergence = (p: number[], q: number[]): number => {
  if (p.length !== q.length) return NaN;
  
  let kl = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] > 0 && q[i] > 0) {
      kl += p[i] * Math.log(p[i] / q[i]);
    }
  }
  return kl;
};

export const jsDivergence = (p: number[], q: number[]): number => {
  const m = p.map((val, i) => (val + q[i]) / 2);
  return 0.5 * klDivergence(p, m) + 0.5 * klDivergence(q, m);
};

export const earthMoversDistance = (p: number[], q: number[]): number => {
  // Simplified EMD calculation
  let distance = 0;
  for (let i = 0; i < p.length; i++) {
    distance += Math.abs(p[i] - q[i]);
  }
  return distance / p.length;
};