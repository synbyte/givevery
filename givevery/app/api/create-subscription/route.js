import { NextResponse } from "next/server";
import { stripe } from "@/utils/utils";


export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.amount || !body.connectedAccountId || !body.customerId) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (body.amount <= 0) {
      return new Response("Amount must be greater than 0", { status: 400 }); 
    }

    const subscription = await stripe.subscriptions.create(
      {
        customer: body.customerId,
        items: [
          {
            price_data: {
              unit_amount: Math.round(body.amount * 100),
              currency: "usd", 
              product: "prod_RMfaDPUhhfH3eD",
              recurring: { interval: "month" },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        application_fee_percent:4,
      },
      {
        stripeAccount: body.connectedAccountId,
      }
    );

    return NextResponse.json(subscription);

  } catch (error) {
    console.error("Subscription creation error:", error);
    return new Response(error.message, { status: 500 });
  }
}
