"use client"

import { Elements } from "@stripe/react-stripe-js";
import { ExpressCheckoutElement, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
type Props = {
    connectedAccountId: string;
}

function Test({ connectedAccountId }: Props) {
    const [amount, setAmount] = useState(1000);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", {
      stripeAccount: connectedAccountId,
    });
    
    const createPaymentIntent = async (amount: number) => {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, connectedAccountId }),
        });
    
        if (!response.ok) {
          throw new Error(`Payment intent creation failed: ${response.statusText}`);
        }
    
        const data = await response.json();
        if (!data.clientSecret) {
          throw new Error("No client secret received from server");
        }
    
        return data.clientSecret;
      };
    
  return (
      <div className="flex-col justify-center items-center w-full border-2 bg-red-100">
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: amount,
            currency: "usd",
          }}
      >
      <PaymentElement />
      <ExpressCheckoutElement onConfirm={() => {console.log("Confirmed")}} />
    </Elements>
    </div>
  )
}

export default Test