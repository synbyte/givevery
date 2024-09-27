import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/utils/utils';


export async function POST(request) {
  const { amount } = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      }
    });

    console.log('payment succeeded!')
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
