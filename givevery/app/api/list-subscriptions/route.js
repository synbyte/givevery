import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';

export async function POST(req) {
  try {
    const { connectedAccountId } = await req.json();

    if (!connectedAccountId) {
      return NextResponse.json({ error: 'Connected account ID is required' }, { status: 400 });
    }

    const paymentIntents = await stripe.subscriptions.list({
     limit: 10000, // Adjust the limit as needed
    }, {
      stripeAccount: connectedAccountId,
    });

    const subscriptions = paymentIntents.data
    .filter(subscription => subscription.status === 'active')
    .map(subscription => ({
      id: subscription.id,
      amount: subscription.plan.amount / 100,
      currency: subscription.plan.currency,
      createdAt: new Date(subscription.created * 1000).toISOString(),
    }));
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error listing payment intents:', error.message);
    return NextResponse.json({ error: 'Error listing payment intents' }, { status: 500 });
  }
}