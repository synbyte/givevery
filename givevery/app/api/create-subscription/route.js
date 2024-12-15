import { NextResponse } from "next/server";
import { stripe } from "@/utils/utils";


export async function POST(request) {
  try {
    const {amount, connectedAccountId, customerId} = await request.json();
    
    if (!amount || !connectedAccountId || !customerId) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (amount <= 0) {
      return new Response("Amount must be greater than 0", { status: 400 }); 
    }

    const subscription = await stripe.subscriptions.create(
      {
        customer: customerId,
        items: [
          {
            price_data: {
              unit_amount: Math.round(amount * 100),
              currency: "usd", 
              product: "prod_RMfaDPUhhfH3eD",
              recurring: { interval: "month" },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        application_fee_percent: 4,
        metadata: {
          nonprofit: connectedAccountId,
        },
      },
      {
        stripeAccount: connectedAccountId,
      }
    );

    return NextResponse.json(subscription);

  } catch (error) {
    console.error("Subscription creation error:", error);
    return new Response(error.message, { status: 500 });
  }
}
