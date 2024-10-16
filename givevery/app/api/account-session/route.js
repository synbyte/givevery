import {stripe} from '@/utils/utils';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
    const body = await req.json();
      const accountSession = await stripe.accountSessions.create({
        account: body.account,
        components: {
          account_onboarding: { enabled: true },
          payments: { 
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
            }
          }
        }
      });

      return NextResponse.json({
        client_secret: accountSession.client_secret,
      });
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account session",
        error
      );
      return NextResponse.json({error: error.message}, {status: 500});
  }
}