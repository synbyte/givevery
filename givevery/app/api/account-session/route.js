import {stripe} from '@/utils/utils';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
    const body = await req.json();
      const accountSession = await stripe.accountSessions.create({
        account: body.account,
        components: {
          notification_banner: { enabled: true },
          account_onboarding: { enabled: true },
          account_management: { enabled: true,
            features: {
              external_account_collection: true
            },
           },
          payments: { 
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
            }
          },
          balances: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
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