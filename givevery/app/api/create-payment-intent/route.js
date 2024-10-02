import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';


export async function POST(request) {
  const { amount } = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'cad',
      automatic_payment_methods: {
        enabled: true,
      },
      application_fee_amount: amount * 0.04,
    });

    console.log('payment succeeded!')
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
