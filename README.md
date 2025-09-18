# Funding Readiness Assessment Tool

A comprehensive web application that helps startups assess their readiness for fundraising through a detailed questionnaire and provides personalized feedback based on their responses.

## Features

- **Interactive Assessment**: Multi-step questionnaire covering key areas of fundraising readiness
- **Personalized Profiles**: Get categorized as Visionary, Storyteller, Builder, or Strategist based on your responses
- **Detailed Results**: Comprehensive scoring across different categories with actionable insights
- **PDF Report Generation**: Download a detailed assessment report
- **Email Capture**: Optional workshop signup for further guidance
- **Privacy-Focused**: Transparent data handling with user consent

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Backend**: Supabase (database, authentication, edge functions)
- **PDF Generation**: jsPDF
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd funding-readiness-assessment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BandChip.tsx    # Score visualization component
│   ├── BarMeter.tsx    # Progress bar component
│   ├── ProfileCard.tsx # Profile display component
│   └── ...
├── pages/              # Main application pages
│   ├── Index.tsx       # Landing page
│   ├── Checklist.tsx   # Assessment questionnaire
│   ├── Results.tsx     # Results and scoring page
│   ├── EmailCapture.tsx # Workshop signup
│   └── ...
├── lib/                # Utility functions and data
│   ├── copy.ts         # Content and assessment questions
│   ├── scoring.ts      # Scoring logic
│   └── utils.ts        # Helper functions
└── integrations/       # External service integrations
    └── supabase/       # Supabase client and types
```

## Assessment Flow

1. **Landing Page** (`/`) - Introduction and call-to-action
2. **Assessment** (`/checklist`) - Multi-step questionnaire
3. **Results** (`/results`) - Personalized scoring and profile
4. **Email Capture** (`/email-capture`) - Optional workshop signup
5. **Workshop Signup** (`/workshop-signup`) - Confirmation page

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Deployment

This application can be deployed to various platforms:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect via Git
- **Static Hosting**: Upload the `dist/` folder to any web server

### Environment Variables for Production

Make sure to set the following environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Database Setup

The application uses Supabase for data storage. The main table is `assessment_results` which stores:
- User email and consent preferences
- Assessment scores and categories
- Generated PDF data
- User responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.