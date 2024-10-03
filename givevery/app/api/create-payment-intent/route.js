import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  const supabase = createClient()
  const { amount, nonprofitId } = await request.json();
  const { data, error } = await supabase
    .from('nonprofits')
    .select('connected_account_id')
    .eq('id', nonprofitId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Nonprofit not found' }, { status: 404 });
  }

  const connectedAccountId = data.connected_account_id;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'cad',
      automatic_payment_methods: {
        enabled: true,
      },
      application_fee_amount: amount * 0.04,
    },{
      stripeAccount: connectedAccountId,
    });

    console.log('payment succeeded!')
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
