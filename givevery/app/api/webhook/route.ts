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
      if (paymentIntent.metadata.recurring === undefined) {
        console.log("Skipping recurring payment in payment_intent.suceeded");
        break;
      }

      const paymentDetails = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        paymentMethod: paymentIntent.payment_method,
        customer: paymentIntent.customer,
        nonprofit: paymentIntent.metadata.nonprofit,
        recurring: paymentIntent.metadata.recurring,
        metadata: paymentIntent.metadata,
      };

      const { error } = await supabase.from("donations").insert({
        stripe_pid: paymentDetails.id,
        amount: paymentDetails.amount,
        nonprofit_id: paymentDetails.nonprofit,
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        created_at: new Date(paymentDetails.created * 1000).toISOString(),
        donor_id: paymentDetails.customer,
        recurring: paymentDetails.recurring,
        payment_method: paymentDetails.paymentMethod,
      });

      if (error) {
        console.error("Error inserting donation into Supabase:", error);
        return new NextResponse("Failed to create donation", { status: 500 });
      }

      console.log("WEBHOOK PAYMENT INTENT SUCCEEDED", paymentDetails);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = dataObject as Stripe.Invoice;
    
          const connectedAccountId = invoice.subscription_details?.metadata?.nonprofit;

          const paymentDetails = {
        id: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status,
        created: new Date(invoice.created * 1000).toISOString(),
        customer: invoice.customer,
        nonprofit: invoice.subscription_details?.metadata?.nonprofit,
        recurring: invoice.subscription_details?.metadata?.recurring,
        metadata: invoice.metadata,
          };
          
          const { error } = await supabase.from("donations").insert({
            stripe_pid: paymentDetails.id,
            amount: paymentDetails.amount,
            nonprofit_id: paymentDetails.nonprofit,
            currency: paymentDetails.currency,
            status: paymentDetails.status,
            created_at: paymentDetails.created,
            donor_id: paymentDetails.customer,
            recurring: paymentDetails.recurring,
          });
    
          if (error) {
            console.error("Error inserting donation into Supabase:", error);
            return new NextResponse("Failed to create donation", { status: 500 });
          }

      console.log("WEBHOOK INVOICE PAYMENT SUCCEEDED", paymentDetails);
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
