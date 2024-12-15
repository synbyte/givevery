// app/api/list-charges/route.js
import { NextResponse } from "next/server";
import { stripe } from "@/utils/utils";

export async function POST(req) {
  try {
    const { connectedAccountId, startingAfter } = await req.json();

    if (!connectedAccountId) {
      return NextResponse.json(
        { error: "Connected account ID is required" },
        { status: 400 }
      );
    }

    const charges = await stripe.charges.list(
      {
        limit: 100,
        starting_after: startingAfter,
        // Only get successful charges
        status: 'succeeded',
      },
      {
        stripeAccount: connectedAccountId,
      }
    );

    const donations = charges.data.map((charge) => ({
      id: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency,
      createdAt: new Date(charge.created * 1000).toISOString(),
      metadata: charge.metadata,
      // Check if this is part of a subscription
      recurring: charge.invoice ? true : false,
      customer: charge.customer,
      receipt_email: charge.receipt_email,
      description: charge.description
    }));

    return NextResponse.json({
      donations,
      hasMore: charges.has_more,
      lastId: charges.data[charges.data.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error listing charges:", error.message);
    return NextResponse.json(
      { error: "Error listing charges" },
      { status: 500 }
    );
  }
}