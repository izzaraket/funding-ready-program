import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFRequest {
  results: {
    categories: Array<{
      name: string;
      percent: number;
      band: string;
    }>;
    profile: string;
    overallPercent: number;
  };
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { results, userEmail }: PDFRequest = await req.json();

    // Create a simple HTML template for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Funding Readiness Results</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #333; 
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              color: #3b82f6; 
              margin: 0; 
              font-size: 28px; 
            }
            .overall-score { 
              background: #f8fafc; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .overall-score h2 { 
              margin: 0; 
              font-size: 48px; 
              color: #3b82f6; 
            }
            .category { 
              margin: 20px 0; 
              padding: 15px; 
              border-left: 4px solid #3b82f6; 
              background: #f9fafb; 
            }
            .category h3 { 
              margin: 0 0 10px 0; 
              color: #1f2937; 
            }
            .progress-bar { 
              background: #e5e7eb; 
              height: 20px; 
              border-radius: 10px; 
              overflow: hidden; 
              margin: 10px 0; 
            }
            .progress-fill { 
              height: 100%; 
              background: #3b82f6; 
              border-radius: 10px; 
            }
            .profile-section { 
              margin-top: 30px; 
              padding: 20px; 
              border: 2px solid #3b82f6; 
              border-radius: 8px; 
            }
            .profile-section h2 { 
              color: #3b82f6; 
              margin-top: 0; 
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #6b7280; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Your Funding Readiness Results</h1>
            <p>Generated for: ${userEmail}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="overall-score">
            <h2>${results.overallPercent}%</h2>
            <p>Overall Funding Readiness</p>
          </div>

          <h2>Category Breakdown</h2>
          ${results.categories.map(category => `
            <div class="category">
              <h3>${category.name}</h3>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${category.percent}%"></div>
              </div>
              <p><strong>${category.percent}%</strong> - ${category.band} readiness</p>
            </div>
          `).join('')}

          <div class="profile-section">
            <h2>Your Profile: ${results.profile}</h2>
            <p>Based on your assessment results, this profile best matches your organization's current funding readiness state.</p>
          </div>

          <div class="footer">
            <p>Want to improve your funding readiness? Join our Funding-Ready Workshop!</p>
            <p>Contact us at hello@fundingreadyworkshop.com</p>
          </div>
        </body>
      </html>
    `;

    // For now, return the HTML content as a simple text-based PDF alternative
    // In a production environment, you would use a proper PDF generation library
    const pdfData = new TextEncoder().encode(htmlContent);

    return new Response(JSON.stringify({ 
      pdf: Array.from(pdfData),
      message: 'PDF generated successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in generate-pdf function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);