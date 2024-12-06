import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {

  const { amount, connectedAccountId } = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      application_fee_amount: amount * 100 * 0.04,
    },{
      stripeAccount: connectedAccountId,
    });
    

    console.log('payment succeeded!')
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}