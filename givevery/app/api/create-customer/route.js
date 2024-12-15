import { NextResponse } from "next/server";
import { stripe } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.connectedAccountId) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response("Invalid email format", { status: 400 });
    }

    const customer = await stripe.customers.create({
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: data.email.trim().toLowerCase(),
    }, {
      stripeAccount: data.connectedAccountId,
    });

    // Insert customer into Supabase. Handled in webhook. 
    // const supabase = createClient();
    // const { insert, error } = await supabase.from("donors").insert({
    //   donor_id: customer.id,
    //   email: data.email.trim().toLowerCase(),
    //   name: `${data.firstName.trim()} ${data.lastName.trim()}`,
    // });
    // if (error) {
    //   console.error("Error inserting customer into Supabase:", error);
    //   return new Response("Failed to create customer", { status: 500 });
    // }

    return NextResponse.json({ customerId: customer.id });

  } catch (error) {
    console.error("Customer creation error:", error.message);
    return new Response(error.message, { status: 500 });
  }
}
