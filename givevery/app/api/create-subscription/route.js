import { NextResponse } from "next/server";
import { stripe } from "@/utils/utils";

export async function POST(request) {
  const { amount, connectedAccountId, customerId } = await request.json();

  const subscription = await stripe.subscriptions.create(
    {
      customer: customerId,
      items: [
        {
          price_data: {
            unit_amount: amount * 100,
            currency: "usd",
            product: "prod_RMfaDPUhhfH3eD",
            recurring: { interval: "month" },
          },
        },
      ],
    },
    {
      stripeAccount: connectedAccountId,
    }
  );
}
