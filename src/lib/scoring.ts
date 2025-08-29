
export type ScoreLevel = 1 | 2 | 3 | 4;
export type Band = 'High' | 'Medium' | 'Low';
export type ProfileKey = 'Visionary' | 'Storyteller' | 'Builder' | 'Connector' | 'Reliable Partner' | 'Fundraising Ready' | 'Emerging';

export interface Bands {
  ProgramPlan: Band;
  Financial: Band;
  Evidence: Band;
  Relationships: Band;
}

export interface CategoryResult {
  name: string;
  percent: number;
  band: Band;
}

export interface AssessmentResult {
  categories: CategoryResult[];
  profile: ProfileKey;
  overallPercent: number;
}

// Question to category mapping
const CATEGORY_QUESTIONS = {
  ProgramPlan: [1, 2, 3],
  Financial: [4, 5],
  Evidence: [6, 7],
  Relationships: [8, 9, 10]
};

const CATEGORY_NAMES = {
  ProgramPlan: 'Clear Program Plan',
  Financial: 'Financial Readiness',
  Evidence: 'Evidence & Data',
  Relationships: 'Funding Relationships & Capacity'
};

export function scoreAnswer(level: ScoreLevel): number {
  return level;
}

export function categoryPercent(answers: Record<number, ScoreLevel>, questionIds: number[]): number {
  const sum = questionIds.reduce((total, id) => {
    return total + (answers[id] || 0);
  }, 0);
  
  return (sum / (questionIds.length * 4)) * 100;
}

export function bandFromPercent(percent: number): Band {
  if (percent >= 75) return 'High';
  if (percent >= 50) return 'Medium';
  return 'Low';
}

export function assignProfile(bands: Bands): ProfileKey {
  const { ProgramPlan, Financial, Evidence, Relationships } = bands;
  
  // Count highs and lows
  const highCount = Object.values(bands).filter(band => band === 'High').length;
  const lowCount = Object.values(bands).filter(band => band === 'Low').length;
  
  // Rule 1: High in ≥3 categories → Fundraising Ready
  if (highCount >= 3) return 'Fundraising Ready';
  
  // Rule 2: Low in ≥2 categories → Emerging
  if (lowCount >= 2) return 'Emerging';
  
  // Rule 3: ProgramPlan=High and (Financial=Low or Evidence=Low or Relationships=Low) → Visionary
  if (ProgramPlan === 'High' && (Financial === 'Low' || Evidence === 'Low' || Relationships === 'Low')) {
    return 'Visionary';
  }
  
  // Rule 4: Evidence=High and Financial=Low → Storyteller
  if (Evidence === 'High' && Financial === 'Low') return 'Storyteller';
  
  // Rule 5: Financial=High and ProgramPlan=Low → Builder
  if (Financial === 'High' && ProgramPlan === 'Low') return 'Builder';
  
  // Rule 6: Relationships=High and Evidence=Low → Connector
  if (Relationships === 'High' && Evidence === 'Low') return 'Connector';
  
  // Rule 7: All four are Medium → Reliable Partner
  if (Object.values(bands).every(band => band === 'Medium')) return 'Reliable Partner';
  
  // Rule 8: Fallback → Reliable Partner
  return 'Reliable Partner';
}

export function overallPercent(categoryPercents: number[]): number {
  return categoryPercents.reduce((sum, percent) => sum + percent, 0) / categoryPercents.length;
}

export function calculateResults(answers: Record<number, ScoreLevel>): AssessmentResult {
  const categories: CategoryResult[] = Object.entries(CATEGORY_QUESTIONS).map(([key, questionIds]) => {
    const percent = categoryPercent(answers, questionIds);
    const band = bandFromPercent(percent);
    
    return {
      name: CATEGORY_NAMES[key as keyof typeof CATEGORY_NAMES],
      percent: Math.round(percent * 10) / 10, // Round to 1 decimal
      band
    };
  });
  
  const bands: Bands = {
    ProgramPlan: categories[0].band,
    Financial: categories[1].band,
    Evidence: categories[2].band,
    Relationships: categories[3].band
  };
  
  const profile = assignProfile(bands);
  const categoryPercents = categories.map(c => c.percent);
  const overall = Math.round(overallPercent(categoryPercents) * 10) / 10;
  
  return {
    categories,
    profile,
    overallPercent: overall
  };
}
