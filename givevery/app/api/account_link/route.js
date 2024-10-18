
import { NextResponse } from 'next/server';
import { stripe } from '@/utils/utils';

export async function POST(request) {
  try {
    const { account } = await request.json();

    const accountLink = await stripe.accountLinks.create({
      account: account,
      refresh_url: `https://${request.headers.origin}/onboarding`,
      return_url: `https://${request.headers.origin}/onboarding`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('An error occurred when calling the Stripe API to create an account link:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
