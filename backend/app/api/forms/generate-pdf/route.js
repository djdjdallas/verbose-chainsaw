/**
 * PDF generation endpoint for claim forms
 * @module app/api/forms/generate-pdf
 */

import { NextResponse } from 'next/server';
import { generatePDF, uploadPDF, saveFormData } from '@/lib/formService';
import { createServiceClient, getUserFromRequest } from '@/lib/supabase';

/**
 * Generate PDF from form data
 */
export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { formData, moneyFoundId, claimInfo } = body;

    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      );
    }

    // Get claim information if moneyFoundId provided
    let claimDetails = claimInfo;
    if (moneyFoundId && !claimDetails) {
      const supabase = createServiceClient();
      const { data: moneyFound } = await supabase
        .from('money_found')
        .select('*')
        .eq('id', moneyFoundId)
        .eq('user_id', user.id)
        .single();

      if (moneyFound) {
        claimDetails = {
          id: moneyFound.id,
          company: moneyFound.company_name,
          title: moneyFound.description,
          amount: moneyFound.amount
        };
      }
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(formData, claimDetails);

    // Upload PDF to storage
    let pdfUrl = null;
    if (moneyFoundId) {
      try {
        pdfUrl = await uploadPDF(pdfBuffer, user.id, moneyFoundId);

        // Save form data and PDF URL to database
        await saveFormData(user.id, moneyFoundId, formData, pdfUrl);
      } catch (uploadError) {
        console.error('PDF upload error:', uploadError);
        // Continue without saving URL
      }
    }

    // Convert buffer to base64 for response
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      pdfBase64,
      pdfUrl,
      message: 'PDF generated successfully'
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

/**
 * Download PDF
 */
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get form data
    const { data: form, error } = await supabase
      .from('claim_forms')
      .select('*')
      .eq('id', formId)
      .eq('user_id', user.id)
      .single();

    if (error || !form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    if (!form.pdf_url) {
      return NextResponse.json(
        { error: 'PDF not generated for this form' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pdfUrl: form.pdf_url,
      formData: form.form_data
    });

  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve PDF' },
      { status: 500 }
    );
  }
}