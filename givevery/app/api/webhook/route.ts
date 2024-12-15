import { stripe } from "@/utils/utils";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    return new NextResponse("Webhook Error: " + error, { status: 400 });
  }

  const dataObject = event.data.object;
  const supabase = createClient();
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = dataObject as Stripe.PaymentIntent;

      const paymentDetails = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        customer: paymentIntent.customer,
        nonprofit: paymentIntent.metadata.nonprofit,
      };

      const { error } = await supabase.from("donations").insert({
        stripe_pid: paymentDetails.id,
        amount: paymentDetails.amount,
        nonprofit_id: paymentDetails.nonprofit,
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        created_at: new Date(paymentDetails.created * 1000).toISOString(),
        donor_id: paymentDetails.customer,
      });

      if (error) {
        console.error("Error inserting donation into Supabase:", error);
        return new NextResponse("Failed to create donation", { status: 500 });
      }

      console.log("WEBHOOK PAYMENT INTENT SUCCEEDED", paymentDetails);
      break;
    }

    case "customer.created": {
      const customer = dataObject as Stripe.Customer;

      const customerDetails = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: customer.created,
      };

      // Insert customer into Supabase

      const { error } = await supabase.from("donors").insert({
        donor_id: customerDetails.id,
        email: customerDetails.email,
        name: customerDetails.name,
        created_at: new Date(customerDetails.created * 1000).toISOString(),
      });

      if (error) {
        console.error("Error inserting customer into Supabase:", error);
        return new NextResponse("Failed to create customer", { status: 500 });
      }
      console.log("WEBHOOK CUSTOMER CREATED", customerDetails);
      break;
    }
  }
  return new NextResponse("GOTIT");
}
