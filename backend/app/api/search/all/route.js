/**
 * Comprehensive search across all money sources
 * @module app/api/search/all
 */

import { NextResponse } from 'next/server';
import { searchClassActions } from '@/lib/classActionService';
import { searchAllStates } from '@/lib/unclaimedPropertyService';
import { scanEmailsForMoney } from '@/lib/gmailService';
import { createServiceClient, getUserFromRequest } from '@/lib/supabase';

/**
 * Run comprehensive search across all sources
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

    const supabase = createServiceClient();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get user addresses
    const { data: addresses } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id);

    const userData = {
      ...profile,
      addresses: addresses || []
    };

    const results = {
      classActions: [],
      unclaimedProperty: [],
      emailOpportunities: [],
      totalFound: 0,
      estimatedValue: 0
    };

    const errors = [];

    // 1. Search Class Actions
    try {
      console.log('Searching class actions...');
      const classActionResults = await searchClassActions(userData);
      results.classActions = classActionResults;

      // Save to database
      if (classActionResults.length > 0) {
        const records = classActionResults
          .filter(r => r.matchScore > 50)
          .map(r => ({
            user_id: user.id,
            source_type: 'class_action',
            amount: r.estimatedPayout || 'Unknown',
            amount_numeric: parseFloat(r.estimatedPayout?.split('-')[1]?.replace(/[^0-9.]/g, '')) || null,
            company_name: r.company,
            description: r.title,
            eligibility_requirements: r.eligibility,
            claim_url: r.claimUrl,
            claim_deadline: r.deadline,
            status: 'unclaimed',
            metadata: r
          }));

        await supabase.from('money_found').insert(records);
      }
    } catch (error) {
      console.error('Class action search error:', error);
      errors.push('Class action search failed');
    }

    // 2. Search Unclaimed Property
    try {
      if (profile.first_name && profile.last_name) {
        console.log('Searching unclaimed property...');
        const propertyResults = await searchAllStates({
          firstName: profile.first_name,
          lastName: profile.last_name,
          addresses: addresses || []
        });
        results.unclaimedProperty = propertyResults;

        // Save to database
        if (propertyResults.length > 0) {
          const records = propertyResults.map(p => ({
            user_id: user.id,
            source_type: 'unclaimed_property',
            amount: p.amount,
            amount_numeric: parseFloat(p.amount?.replace(/[^0-9.]/g, '')) || null,
            company_name: p.reportedBy,
            description: `${p.type} - ${p.address}`,
            eligibility_requirements: `Property ID: ${p.propertyId}`,
            claim_url: p.claimUrl,
            status: 'unclaimed',
            metadata: p
          }));

          await supabase.from('money_found').insert(records);
        }
      }
    } catch (error) {
      console.error('Unclaimed property search error:', error);
      errors.push('Unclaimed property search failed');
    }

    // 3. Scan Gmail (if connected)
    try {
      if (profile.gmail_connected && profile.gmail_access_token) {
        console.log('Scanning Gmail...');
        const gmailResults = await scanEmailsForMoney(
          profile.gmail_access_token,
          user.id
        );
        results.emailOpportunities = gmailResults.opportunitiesFound || [];

        // Save to database
        if (gmailResults.opportunitiesFound?.length > 0) {
          const records = gmailResults.opportunitiesFound.map(o => ({
            user_id: user.id,
            source_type: 'email',
            amount: o.amount || 'Unknown',
            amount_numeric: parseFloat(o.amount?.replace(/[^0-9.]/g, '')) || null,
            company_name: o.company,
            description: o.description,
            eligibility_requirements: o.action_required,
            claim_deadline: o.deadline,
            status: 'unclaimed',
            metadata: o
          }));

          await supabase.from('money_found').insert(records);
        }
      }
    } catch (error) {
      console.error('Gmail scan error:', error);
      errors.push('Gmail scan failed');
    }

    // Calculate totals
    results.totalFound =
      results.classActions.length +
      results.unclaimedProperty.length +
      results.emailOpportunities.length;

    // Estimate total value
    let estimatedValue = 0;

    // Add class action estimates
    results.classActions.forEach(ca => {
      const maxAmount = parseFloat(ca.estimatedPayout?.split('-')[1]?.replace(/[^0-9.]/g, '')) || 0;
      estimatedValue += maxAmount;
    });

    // Add unclaimed property
    results.unclaimedProperty.forEach(prop => {
      const amount = parseFloat(prop.amount?.replace(/[^0-9.]/g, '')) || 100; // Default $100 for unknown
      estimatedValue += amount;
    });

    // Add email opportunities
    results.emailOpportunities.forEach(opp => {
      const amount = parseFloat(opp.amount?.replace(/[^0-9.]/g, '')) || 50; // Default $50 for unknown
      estimatedValue += amount;
    });

    results.estimatedValue = estimatedValue;

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Found ${results.totalFound} opportunities worth approximately $${estimatedValue.toFixed(2)}`
    });

  } catch (error) {
    console.error('Comprehensive search error:', error);
    return NextResponse.json(
      { error: 'Failed to complete comprehensive search' },
      { status: 500 }
    );
  }
}