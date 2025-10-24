
import { ProfileKey } from './scoring';

export interface ProfileInfo {
  tagline: string;
  nextStep: string;
  details: string[];
  description: string;
  funderPerspective: string;
  detailedFeedback: string;
  resources?: string[];
}

export const PROFILE_COPY: Record<ProfileKey, ProfileInfo> = {
  'Visionary': {
    tagline: 'High Program Plan, lower in others',
    nextStep: 'Focus on building monitoring systems, linking budgets to outcomes and building funder relationships',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(High Program Plan, lower in others)',
    funderPerspective: 'You have a strong plan and theory of change, but need to strengthen data, financial, or relationships. Funders love your clarity of purpose, but may ask: "Can they deliver and measure it?"',
    detailedFeedback: `Your program shines when it comes to planning. You have a strong logic model, a clear theory of change, and a sense of where your program is headed. Funders can see that you know where you want to go, and that's a powerful strength. But being visionary is only the first step. To move from vision to sustained funding, you need to show how your outcomes, indicators, budgets, and activities all connect. This is considered a best practice in program management: when funders see that every dollar is linked to activities and measurable outcomes, they view your work as credible, accountable, and sustainable.

You can start small: track 2–3 outcome indicators and build an evidence base that supports your plan. In parallel, link your outcome data to your budget. You need to be able to justify the cost of impact (e.g., $500 per participant trained). This transforms vision into investable numbers.

Another area to strengthen is funding relationships. A great program plan alone won't open doors. Building relationships with potential funders before you apply increases trust and positions you as a partner, not just an applicant. Start small:
• Identify 3–5 funders aligned with your mission.
• Reach out to share your work and listen to them.
• Provide updates, stories, or data points that connect your program's vision with funder priorities.`,
    resources: [
      'W.K. Kellogg Foundation Logic Model Development Guide (PDF)',
      'Theory of Change Center: https://www.theoryofchange.org/',
      'BetterEvaluation - tools and resources: https://www.betterevaluation.org/tools-resources',
      'Nonprofit Finance Fund – Financial Self-Assessment: https://nff.org/fundamental/financial-self-assessment-worksheet-know-your-strengths-and-weaknesses'
    ]
  },
  'Storyteller': {
    tagline: 'High Evidence & Data, lower Financial',
    nextStep: 'Build stronger budgeting tools and grant management capacity.',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories.',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(High Evidence & Data, lower Financial)',
    funderPerspective: 'You\'re good at collecting and sharing impact, but less confident in connecting it to costs or managing finances. Funders may believe in your impact, but hesitate about your financial systems.',
    detailedFeedback: `Your program shines when it comes to sharing your impact. You know how to bring your work to life with stories, participant voices, and outcome data that go beyond counting activities or attendance. This is a tremendous strength: funders want to understand not only what you do, but why it matters and what changes because of it. Your storytelling skills are one of your strongest assets for building interest and emotional connection.

But being a Storyteller also comes with gaps. The main challenge is linking your strong impact stories with your financial needs. Funders often ask: "This sounds inspiring, but how much does it cost, and what will my investment achieve?" Without connecting outcomes to dollars, your story feels incomplete. To grow from Storyteller to fully funding-ready, you need to pair your evidence with financial clarity. For example, instead of saying you served 100 participants, you'd confidently explain that for $50,000, we can run this program for 100 youth, and we know 80% will graduate high school on time. This turns an inspiring narrative into an investable case for support.

You should also use your storytelling strengths to deepen donor relationships. Share regular updates, small wins, and impact stories with funders even when you're not asking for money. This keeps your work top-of-mind and builds trust. Building relationships with potential funders before you apply increases trust and positions you as a partner, not just an applicant. Start small:
• Identify 3–5 funders aligned with your mission.
• Reach out to share your work and listen to them.
• Provide updates, stories, or data points that connect your program's vision with funder priorities.`
  },
  'Builder': {
    tagline: 'High Financial, lower Program Plan',
    nextStep: 'Develop a clear logic model and 3-year program roadmap.',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories.',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(High Financial, lower Program Plan)',
    funderPerspective: 'You have strong budgets and systems, but your program design needs more clarity and evidence. Funders see you as transparent/accountable, but may not fully grasp your impact strategy.',
    detailedFeedback: `Your program shines when it comes to financial management. You likely have clear budgets, strong financial controls, and reliable systems for tracking and reporting. Funders appreciate this kind of rigor because it signals accountability and transparency. You already demonstrate that you can handle resources responsibly. This makes you a safe investment.

While you are strong on financial readiness, your program plan and longer-term vision may not be as fully developed. Funders don't just want to see strong management: they want to invest in a clear and compelling path to change. Without a strong logic model, a program strategy or a simple theory of change, proposals can feel too focused on activity-level results and not enough on mission/impact. To strengthen your position, build out a program framework that shows how your resources connect to outcomes. This is the missing piece that will make your financial discipline even more fundable.

Another area to probably strengthen is funding relationships. Building relationships with potential funders even before you apply increases trust and positions you as a partner, not just an applicant. After you have built clear program plans and stories, you can focus more on building genuine relationships. Start small:
• Identify 3–5 funders aligned with your mission.
• Reach out to share your work and listen to them.
• Provide updates, stories, or data points that connect your program's vision with funder priorities.`
  },
  'Connector': {
    tagline: 'High Relationships, lower Evidence/Data',
    nextStep: 'Invest in monitoring and evaluation to back up your strong partnerships.',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories.',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(High Relationships, lower Evidence/Data)',
    funderPerspective: 'You excel at fundraising relationships and can secure support, but you struggle to show outcomes with data. Funders may continue supporting you, but bigger grants will require stronger evidence.',
    detailedFeedback: `Your program shines when it comes to relationships. You know how to connect with funders, build trust, and maintain positive communication. This is a major strength because many funders say they fund people as much as programs. By nurturing relationships, you've already built a foundation of credibility and goodwill that others may lack.

You may be relying too much on trust and rapport without enough program clarity, evidence and data to back it up. Strong funder relationships can open doors, but they won't guarantee sustained or larger-scale funding unless you can demonstrate measurable outcomes. If your monitoring systems focus mostly on activities rather than results, this is the moment to strengthen your program design and evaluation practices. Funders may like you but still ask: "Where is this heading in three years?" Develop or update your logic model, theory of change, or roadmap to make your vision as clear as your relationships. Then start with 2–3 outcome indicators that clearly show the difference your work makes. Pair those with compelling stories to maintain the relational strength you already have.

Financial readiness is also an area to watch: ensure that your budgets are transparent, realistic, and linked to outcomes. When you can show that every dollar contributes to measurable change, you'll amplify the trust you've already built. You need to pair your evidence with financial clarity. For example, instead of saying you served 100 participants, you'd confidently explain that for $50,000, we can run this program for 100 youth, and we know 80% will graduate high school on time. This turns an inspiring narrative into an investable case for support.`
  },
  'Reliable Partner': {
    tagline: 'Balanced across categories, medium scores',
    nextStep: 'Elevate your program design and financial clarity. This will allow you to become outstanding and better shine through.',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories.',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(Balanced across categories, medium scores)',
    funderPerspective: 'You\'re solid across the board, but not yet excellent in any single area. Funders see you as reliable, but you may blend into the crowd.',
    detailedFeedback: `Your program is balanced across the board. You have a clear program plan, some systems for financial management, ways of collecting and sharing data, and relationships with funders that are steady if not extraordinary. This makes you reliable; funders can see that you're competent and consistent, which is already a strong position.

But being well-rounded also means you may not yet stand out. If your scores sit mostly in the "medium" range, funders might view you as safe but not especially compelling. To move further, you'll want to elevate at least one area of your work to a true strength. That could mean sharpening your program clarity with a stronger logic model, investing in evaluation so your data tells a more powerful story, or strengthening your financial readiness by linking budgets directly to outcomes. Alternatively, you may choose to invest more heavily in relationships, turning funders into long-term champions.

The good news is that you're not starting from scratch in any area; you already have solid foundations. Your next step is about focus and intentional growth: choose one area to go deeper in, and make it your signature strength. Funders notice programs that not only do things well but also excel in a way that demonstrates leadership.`
  },
  'Fundraising Ready': {
    tagline: 'High in 3 or 4 categories',
    nextStep: 'Focus on polishing your case for support and scaling relationships.',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories.',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(High in 3 or 4 categories)',
    funderPerspective: 'You\'re in strong shape and ready to pursue significant grants. Funders will see you as a low-risk, high-potential partner.',
    detailedFeedback: `Your program is strong across the board. You have a clear program plan that shows intentionality and direction, you monitor and share your outcomes with confidence, your budgets are transparent and linked to impact, and you maintain solid relationships with funders. This makes you highly fundable: you're the type of program that funders see as a low-risk, high-potential partner.

Being Fundraising Ready means you've already done the hard work of building systems and clarity. You can show how activities connect to outcomes, how outcomes connect to budgets, and how all of this ties back to your theory of change. You're telling a good story and you're backing it up with evidence and numbers that prove you can deliver. On top of that, your existing relationships with funders help you maintain trust and open doors for larger or multi-year commitments.

The key for you now is to scale and sustain. Look for opportunities to standardize your case for support so you can replicate success across new funders. Consider how to package your story into tailored pitches for different audiences, or how to deepen partnerships so funders see themselves as long-term allies, not one-time donors. You should also start looking ahead: what will it take to sustain or expand your funding readiness three to five years from now?`
  },
  'Emerging': {
    tagline: 'Low scores across the board',
    nextStep: 'Start with basics — a program plan, simple budgets, and outcome tracking.',
    details: [
      'Clear Program Plan: Funders need to see intentionality and strategy.',
      'Evidence & Data: You gain support when you can track and share your impact stories.',
      'Financial Readiness: Linking impact data to budgets demonstrates transparency and sustainability.',
      'Relationships: Funding is built on trust, not just strong proposals.'
    ],
    description: '(Low scores across the board)',
    funderPerspective: 'You\'re at the early stage of funding readiness. Funders may see potential, but you\'ll need to strengthen multiple areas before pursuing larger grants.',
    detailedFeedback: `Your program is in the early stages of funding readiness. You may have passion, a strong mission, and important work happening on the ground, but your systems, plans, and relationships are still developing. This is completely normal; every successful program has been here. The fact that you're reflecting on your readiness now is a big step toward building a sustainable funding strategy.

As an Emerging program, your program plan may be incomplete or informal. Perhaps you don't yet have a logic model or a long-term roadmap. This can make it harder for funders to see your strategy. A first step is to draft a simple logic model that connects your activities to outcomes; even if it's just a few lines. Over time, you can expand it into a full theory of change and program roadmap.

When it comes to evidence and data, you may mostly track outputs (such as number of participants) without much outcome data. That's a fine starting point, but funders increasingly want to know the difference your work makes. Begin by identifying 1–2 key outcomes you can measure and report consistently.

On financial readiness, you may be working with basic budgets or tracking expenses informally. Funders want to see budgets that are clear, realistic, and aligned with program goals. Start with a simple budget that shows how resources are spent and work toward linking those numbers to program outcomes.

Link it together! To be fully funding-ready, you need to pair your evidence with financial clarity. For example, instead of saying you served 100 participants, you'd confidently explain that for $50,000, we can run this program for 100 youth, and we know 80% will graduate high school on time. This turns an inspiring narrative into an investable case for support.

Finally, relationships are still being built. You may not yet have strong funder connections or a history of successful grants. Focus first on cultivating relationships locally: with community partners, smaller funders, or family foundations. As you grow your systems and results, these early supporters can become your strongest champions. Building relationships with potential funders before you apply increases trust and positions you as a partner, not just an applicant. Start small:
• Identify 3–5 funders aligned with your mission.
• Reach out to share your work and listen to them.
• Provide updates, stories, or data points that connect your program's vision with funder priorities.`
  }
};

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "How clear is your program's theory of change or logic model?",
    options: [
      "We're still figuring out how our activities lead to outcomes",
      "We have a rough idea but it's not documented clearly",
      "We have a clear, documented theory that guides our work",
      "Our logic model is sophisticated and regularly updated"
    ]
  },
  {
    id: 2,
    question: "How well-defined are your program goals and measurable outcomes?",
    options: [
      "Our goals are general and mostly activity-focused",
      "We have some outcome goals but they're not all measurable",
      "We have clear, measurable outcomes with realistic targets",
      "Our outcomes are SMART, regularly reviewed, and aligned with impact"
    ]
  },
  {
    id: 3,
    question: "How developed is your program planning and strategy?",
    options: [
      "We plan year to year with basic activity lists",
      "We have 2-3 year plans but they're not detailed",
      "We have detailed multi-year plans with clear milestones",
      "We have strategic plans with scenarios, assumptions, and regular updates"
    ]
  },
  {
    id: 4,
    question: "How comprehensive and accurate are your program budgets?",
    options: [
      "We have basic budgets that cover obvious costs",
      "Our budgets are detailed but miss some indirect costs",
      "We have fully-loaded budgets including all true costs",
      "Our budgets include scenarios, cost-per-outcome metrics, and variance tracking"
    ]
  },
  {
    id: 5,
    question: "How strong are your financial systems and grant management?",
    options: [
      "We track expenses basically and manage grants manually",
      "We have some systems but they're not fully integrated",
      "We have good financial tracking and grant management systems",
      "We have sophisticated systems with real-time reporting and compliance"
    ]
  },
  {
    id: 6,
    question: "How robust is your data collection and outcome measurement?",
    options: [
      "We collect basic data but it's not systematic",
      "We have some outcome data but collection is inconsistent",
      "We systematically collect outcome data with clear indicators",
      "We have comprehensive M&E systems with quality controls"
    ]
  },
  {
    id: 7,
    question: "How compelling are your impact stories and evidence?",
    options: [
      "We have anecdotes but limited systematic evidence",
      "We have some good stories but they're not data-backed",
      "We regularly create compelling stories backed by data",
      "We have sophisticated impact narratives with multiple types of evidence"
    ]
  },
  {
    id: 8,
    question: "How developed are your relationships with potential funders?",
    options: [
      "We know a few funders but relationships are limited",
      "We have some relationships but they're mostly transactional",
      "We have genuine relationships with several aligned funders",
      "We have a strategic network of funders who trust and support us"
    ]
  },
  {
    id: 9,
    question: "How strong is your grant writing and proposal development capacity?",
    options: [
      "We write proposals but they're often rushed or basic",
      "We write decent proposals but they could be stronger",
      "We consistently write strong, compelling proposals",
      "We have templates, processes, and a track record of success"
    ]
  },
  {
    id: 10,
    question: "How well do you steward and communicate with current funders?",
    options: [
      "We send required reports but limited other communication",
      "We communicate regularly but it's mostly one-way updates",
      "We have genuine two-way relationships with regular meaningful contact",
      "We have strategic stewardship systems that deepen partnerships"
    ]
  }
];

export const IN_A_NUTSHELL = [
  "Start with clarity: Your theory of change guides everything else",
  "Budget fully: Include all true costs, not just the obvious ones",
  "Measure what matters: Choose 3-5 key indicators and track them consistently",
  "Build relationships: Funders invest in people and organizations they trust"
];
