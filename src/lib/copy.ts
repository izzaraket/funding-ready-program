
import { ProfileKey } from './scoring';

export interface ProfileInfo {
  tagline: string;
  nextStep: string;
  details: string[];
}

export const PROFILE_COPY: Record<ProfileKey, ProfileInfo> = {
  'Visionary': {
    tagline: 'High Program Plan, lower in Financial/Evidence/Relationships.',
    nextStep: 'Build monitoring systems, link budgets to outcomes, and nurture funder relationships.',
    details: [
      'Your vision is clear and well-planned',
      'Focus on developing robust data collection',
      'Strengthen financial systems and budgeting',
      'Invest time in building funder relationships'
    ]
  },
  'Storyteller': {
    tagline: 'High Evidence & Data, lower Financial.',
    nextStep: 'Pair strong evidence with fully loaded budgets and grant systems.',
    details: [
      'You excel at measuring and communicating impact',
      'Develop comprehensive program budgets',
      'Create cost-per-outcome metrics',
      'Build systems for grant management'
    ]
  },
  'Builder': {
    tagline: 'High Financial, lower Program Plan.',
    nextStep: 'Develop a logic model and 3-year roadmap.',
    details: [
      'Your financial systems are well-developed',
      'Create a clear program theory of change',
      'Develop outcome-focused planning',
      'Set measurable milestones and assumptions'
    ]
  },
  'Connector': {
    tagline: 'High Relationships, lower Evidence.',
    nextStep: 'Invest in M&E to back trusted partnerships.',
    details: [
      'You have strong funder relationships',
      'Develop systematic data collection',
      'Create compelling impact stories',
      'Build evidence to support your network'
    ]
  },
  'Reliable Partner': {
    tagline: 'Balanced Medium across categories.',
    nextStep: 'Elevate one area to High so you stand out.',
    details: [
      'You have solid foundations across all areas',
      'Choose one strength to develop further',
      'Consider your unique competitive advantage',
      'Build on existing momentum'
    ]
  },
  'Fundraising Ready': {
    tagline: 'High in 3+ categories.',
    nextStep: 'Polish a reusable case and scale relationships.',
    details: [
      'You are well-prepared for major funding',
      'Create templates for grant applications',
      'Expand your funder network strategically',
      'Consider capacity for larger grants'
    ]
  },
  'Emerging': {
    tagline: 'Low in 2+ categories.',
    nextStep: 'Start with basics: logic model, simple budgets, 1-2 indicators.',
    details: [
      'Focus on foundational elements first',
      'Create a simple program logic model',
      'Develop basic budget templates',
      'Choose 2-3 key indicators to track'
    ]
  }
};

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "How clear is your program's theory of change or logic model?",
    options: [
      "Just Starting - We're still figuring out how our activities lead to outcomes",
      "Figuring It Out - We have a rough idea but it's not documented clearly",
      "Solid Foundation - We have a clear, documented theory that guides our work",
      "Confident & Strong - Our logic model is sophisticated and regularly updated"
    ]
  },
  {
    id: 2,
    question: "How well-defined are your program goals and measurable outcomes?",
    options: [
      "Just Starting - Our goals are general and mostly activity-focused",
      "Figuring It Out - We have some outcome goals but they're not all measurable",
      "Solid Foundation - We have clear, measurable outcomes with realistic targets",
      "Confident & Strong - Our outcomes are SMART, regularly reviewed, and aligned with impact"
    ]
  },
  {
    id: 3,
    question: "How developed is your program planning and strategy?",
    options: [
      "Just Starting - We plan year to year with basic activity lists",
      "Figuring It Out - We have 2-3 year plans but they're not detailed",
      "Solid Foundation - We have detailed multi-year plans with clear milestones",
      "Confident & Strong - We have strategic plans with scenarios, assumptions, and regular updates"
    ]
  },
  {
    id: 4,
    question: "How comprehensive and accurate are your program budgets?",
    options: [
      "Just Starting - We have basic budgets that cover obvious costs",
      "Figuring It Out - Our budgets are detailed but miss some indirect costs",
      "Solid Foundation - We have fully-loaded budgets including all true costs",
      "Confident & Strong - Our budgets include scenarios, cost-per-outcome metrics, and variance tracking"
    ]
  },
  {
    id: 5,
    question: "How strong are your financial systems and grant management?",
    options: [
      "Just Starting - We track expenses basically and manage grants manually",
      "Figuring It Out - We have some systems but they're not fully integrated",
      "Solid Foundation - We have good financial tracking and grant management systems",
      "Confident & Strong - We have sophisticated systems with real-time reporting and compliance"
    ]
  },
  {
    id: 6,
    question: "How robust is your data collection and outcome measurement?",
    options: [
      "Just Starting - We collect basic data but it's not systematic",
      "Figuring It Out - We have some outcome data but collection is inconsistent",
      "Solid Foundation - We systematically collect outcome data with clear indicators",
      "Confident & Strong - We have comprehensive M&E systems with quality controls"
    ]
  },
  {
    id: 7,
    question: "How compelling are your impact stories and evidence?",
    options: [
      "Just Starting - We have anecdotes but limited systematic evidence",
      "Figuring It Out - We have some good stories but they're not data-backed",
      "Solid Foundation - We regularly create compelling stories backed by data",
      "Confident & Strong - We have sophisticated impact narratives with multiple types of evidence"
    ]
  },
  {
    id: 8,
    question: "How developed are your relationships with potential funders?",
    options: [
      "Just Starting - We know a few funders but relationships are limited",
      "Figuring It Out - We have some relationships but they're mostly transactional",
      "Solid Foundation - We have genuine relationships with several aligned funders",
      "Confident & Strong - We have a strategic network of funders who trust and support us"
    ]
  },
  {
    id: 9,
    question: "How strong is your grant writing and proposal development capacity?",
    options: [
      "Just Starting - We write proposals but they're often rushed or basic",
      "Figuring It Out - We write decent proposals but they could be stronger",
      "Solid Foundation - We consistently write strong, compelling proposals",
      "Confident & Strong - We have templates, processes, and a track record of success"
    ]
  },
  {
    id: 10,
    question: "How well do you steward and communicate with current funders?",
    options: [
      "Just Starting - We send required reports but limited other communication",
      "Figuring It Out - We communicate regularly but it's mostly one-way updates",
      "Solid Foundation - We have genuine two-way relationships with regular meaningful contact",
      "Confident & Strong - We have strategic stewardship systems that deepen partnerships"
    ]
  }
];

export const IN_A_NUTSHELL = [
  "Start with clarity: Your theory of change guides everything else",
  "Budget fully: Include all true costs, not just the obvious ones",
  "Measure what matters: Choose 3-5 key indicators and track them consistently",
  "Build relationships: Funders invest in people and organizations they trust"
];
