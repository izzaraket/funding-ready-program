import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import puppeteer from "npm:puppeteer@21.0.0";

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

    console.log('Generating PDF for:', userEmail);

    // Create enhanced HTML template for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Funding Readiness Assessment Results</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 40px;
              background-color: #f8fafc;
              color: #334155;
              line-height: 1.6;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              color: white;
              padding: 40px;
              text-align: center;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content {
              padding: 40px;
            }
            .summary {
              text-align: center;
              margin-bottom: 40px;
              padding: 30px;
              background: #f1f5f9;
              border-radius: 8px;
            }
            .score-circle {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: linear-gradient(135deg, #10b981, #059669);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              font-weight: bold;
              color: white;
              margin-bottom: 20px;
            }
            .profile-section {
              margin: 30px 0;
              padding: 25px;
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              border-radius: 0 8px 8px 0;
            }
            .categories {
              margin-top: 30px;
            }
            .category {
              margin-bottom: 25px;
              padding: 20px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              background: #ffffff;
            }
            .category h3 {
              margin: 0 0 10px 0;
              color: #1e293b;
              font-size: 18px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .category-score {
              font-weight: bold;
              color: #059669;
            }
            .progress-bar {
              width: 100%;
              height: 8px;
              background: #e2e8f0;
              border-radius: 4px;
              overflow: hidden;
              margin: 10px 0;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #10b981, #059669);
              transition: width 0.3s ease;
            }
            .footer {
              text-align: center;
              padding: 30px;
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
            }
            h2 {
              color: #1e293b;
              margin-bottom: 20px;
              font-size: 24px;
            }
            h3 {
              color: #1e293b;
              margin-bottom: 15px;
              font-size: 20px;
            }
            p {
              line-height: 1.6;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Funding Readiness Assessment</h1>
              <p>Personalized Results for ${userEmail}</p>
            </div>
            
            <div class="content">
              <div class="summary">
                <div class="score-circle">
                  ${results.overallPercent}%
                </div>
                <h2>Overall Readiness Score</h2>
                <p>Based on your responses across all key areas</p>
              </div>

              <div class="profile-section">
                <h3>Your Profile: ${results.profile}</h3>
                <p>This profile reflects your current stage in the funding readiness journey.</p>
              </div>

              <div class="categories">
                <h2>Category Breakdown</h2>
                ${results.categories.map(category => `
                  <div class="category">
                    <h3>
                      ${category.name}
                      <span class="category-score">${category.percent}%</span>
                    </h3>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${category.percent}%"></div>
                    </div>
                    <p><strong>${category.band}</strong> readiness level</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="footer">
              <p>Generated on ${new Date().toLocaleDateString()}</p>
              <p>Want to improve your funding readiness? Contact us for personalized guidance.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      console.log('Launching browser...');
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      console.log('Generating PDF...');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();
      console.log('PDF generated successfully');

      // Convert PDF buffer to base64
      const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

      return new Response(
        JSON.stringify({
          pdfData: pdfBase64,
          message: "PDF generated successfully"
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }

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