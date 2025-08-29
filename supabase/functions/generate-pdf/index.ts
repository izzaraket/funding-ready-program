import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { jsPDF } from "npm:jspdf@3.0.2";

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

    try {
      console.log('Generating PDF with jsPDF...');
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font and colors
      doc.setFont('helvetica');
      
      // Header section with gradient-like effect
      doc.setFillColor(99, 102, 241); // Primary color
      doc.rect(0, 0, 210, 60, 'F');
      
      // Header text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Funding Readiness Assessment', 105, 25, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Personalized Results for ${userEmail}`, 105, 40, { align: 'center' });

      // Overall score section
      let yPos = 80;
      
      // Score circle background
      doc.setFillColor(16, 185, 129); // Green color
      doc.circle(105, yPos, 20, 'F');
      
      // Score text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(`${results.overallPercent}%`, 105, yPos + 5, { align: 'center' });
      
      yPos += 35;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(18);
      doc.text('Overall Readiness Score', 105, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Based on your responses across all key areas', 105, yPos, { align: 'center' });

      // Profile section
      yPos += 25;
      doc.setFillColor(254, 243, 199); // Light yellow background
      doc.rect(10, yPos - 5, 190, 20, 'F');
      
      doc.setFillColor(245, 158, 11); // Orange border
      doc.rect(10, yPos - 5, 4, 20, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Your Profile: ${results.profile}`, 20, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('This profile reflects your current stage in the funding readiness journey.', 20, yPos + 12);

      // Categories section
      yPos += 35;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Category Breakdown', 20, yPos);

      yPos += 15;

      // Draw each category
      results.categories.forEach((category, index) => {
        if (yPos > 250) { // Add new page if needed
          doc.addPage();
          yPos = 30;
        }

        // Category box
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.rect(20, yPos - 5, 170, 25, 'FD');

        // Category name and score
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(category.name, 25, yPos + 3);
        
        doc.setTextColor(5, 150, 105);
        doc.text(`${category.percent}%`, 180, yPos + 3, { align: 'right' });

        // Progress bar background
        doc.setFillColor(226, 232, 240);
        doc.rect(25, yPos + 6, 140, 3, 'F');

        // Progress bar fill
        const fillWidth = (category.percent / 100) * 140;
        doc.setFillColor(16, 185, 129);
        doc.rect(25, yPos + 6, fillWidth, 3, 'F');

        // Band text
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${category.band}`, 25, yPos + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(' readiness level', 25 + doc.getTextWidth(category.band), yPos + 15);

        yPos += 35;
      });

      // Footer
      if (yPos > 230) {
        doc.addPage();
        yPos = 30;
      }

      yPos = 270; // Bottom of page
      doc.setFillColor(248, 250, 252);
      doc.rect(0, yPos - 10, 210, 30, 'F');
      
      doc.setDrawColor(226, 232, 240);
      doc.line(0, yPos - 10, 210, yPos - 10);
      
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      doc.text('Want to improve your funding readiness? Contact us for personalized guidance.', 105, yPos + 7, { align: 'center' });

      // Generate PDF as base64
      const pdfData = doc.output('datauristring').split(',')[1];
      console.log('PDF generated successfully with jsPDF');

      return new Response(
        JSON.stringify({
          pdfData,
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