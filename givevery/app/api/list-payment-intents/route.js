// pages/api/list-payment-intents.js

import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';

export async function POST(req) {
  try {
    const { connectedAccountId } = await req.json();

    if (!connectedAccountId) {
      return NextResponse.json({ error: 'Connected account ID is required' }, { status: 400 });
    }

    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100, // Adjust the limit as needed
    }, {
      stripeAccount: connectedAccountId,
    });

    const donations = paymentIntents.data
    .filter(intent => intent.status === 'succeeded')
    .map(intent => ({
      id: intent.id,
      amount: intent.amount / 100,
      currency: intent.currency,
      createdAt: new Date(intent.created * 1000).toISOString(),
    }))

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error listing payment intents:', error.message);
    return NextResponse.json({ error: 'Error listing payment intents' }, { status: 500 });
  }
}