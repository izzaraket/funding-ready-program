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
  profileDetails: {
    description: string;
    funderPerspective: string;
    detailedFeedback: string;
    nextStep: string;
    resources?: Array<{ name: string; url: string }>;
  };
  userEmail: string;
  saveToDatabase?: boolean;
  answers?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { results, profileDetails, userEmail, saveToDatabase, answers }: PDFRequest = await req.json();

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
      doc.rect(10, yPos - 5, 190, 30, 'F');
      
      doc.setFillColor(245, 158, 11); // Orange border
      doc.rect(10, yPos - 5, 4, 30, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Your Profile: ${results.profile}`, 20, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(profileDetails.description, 20, yPos + 12, { maxWidth: 170 });
      
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text(`Funder Perspective: ${profileDetails.funderPerspective}`, 20, yPos + 22, { maxWidth: 170 });

      // Next Steps section
      yPos += 45;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Next Steps', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(profileDetails.nextStep, 20, yPos, { maxWidth: 170 });

      // Categories section
      yPos += 25;
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

      // Detailed Feedback section
      if (yPos > 200) {
        doc.addPage();
        yPos = 30;
      }
      
      yPos += 20;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Detailed Feedback', 20, yPos);
      
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Split detailed feedback into paragraphs and handle page breaks
      const feedbackParagraphs = profileDetails.detailedFeedback.split('\n').filter(p => p.trim());
      for (const paragraph of feedbackParagraphs) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        const lines = doc.splitTextToSize(paragraph, 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 5 + 3;
      }
      
      // Resources section (if available)
      if (profileDetails.resources && profileDetails.resources.length > 0) {
        if (yPos > 220) {
          doc.addPage();
          yPos = 30;
        }
        
        yPos += 15;
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Resources to Explore', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        for (const resource of profileDetails.resources) {
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
          }
          doc.setTextColor(30, 41, 59);
          doc.text(`• ${resource.name}`, 25, yPos);
          yPos += 6;
          doc.setTextColor(59, 130, 246);
          doc.text(resource.url, 25, yPos);
          yPos += 10;
        }
      }

      // Footer
      doc.addPage();
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

      // Save to database if requested
      if (saveToDatabase && answers) {
        try {
          const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
          const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
          );

          // Ensure integer for overall_percent and reflect consent
          const overallPercentInt = Math.round(Number(results.overallPercent ?? 0));
          const payload = {
            email: userEmail,
            profile: results.profile,
            overall_percent: isNaN(overallPercentInt) ? 0 : overallPercentInt,
            category_scores: results.categories,
            answers: answers,
            pdf_data: pdfData,
            data_storage_consent: !!saveToDatabase,
          };

          const { error: insertError } = await supabase
            .from('assessment_results')
            .insert(payload);

          if (insertError) {
            console.error('Error saving assessment results:', insertError);
          } else {
            console.log('Assessment results saved successfully');
          }
        } catch (error) {
          console.error('Error connecting to database:', error);
        }
      }

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