// app/api/list-subscriptions/route.js
import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';

export async function POST(req) {
  try {
    const { connectedAccountId, startingAfter } = await req.json();

    if (!connectedAccountId) {
      return NextResponse.json({ error: 'Connected account ID is required' }, { status: 400 });
    }

    const subscriptionsList = await stripe.subscriptions.list({
      limit: 100,
      starting_after: startingAfter,
      status: 'active', // Only get active subscriptions
    }, {
      stripeAccount: connectedAccountId,
    });

    const subscriptions = subscriptionsList.data.map(subscription => ({
      id: subscription.id,
      amount: subscription.plan.amount / 100,
      currency: subscription.plan.currency,
      createdAt: new Date(subscription.created * 1000).toISOString(),
      customer: subscription.customer,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      metadata: subscription.metadata
    }));

    return NextResponse.json({
      subscriptions,
      hasMore: subscriptionsList.has_more,
      lastId: subscriptionsList.data[subscriptionsList.data.length - 1]?.id,
    });
  } catch (error) {
    console.error('Error listing subscriptions:', error.message);
    return NextResponse.json({ error: 'Error listing subscriptions' }, { status: 500 });
  }
}