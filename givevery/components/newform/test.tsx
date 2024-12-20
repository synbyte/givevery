"use client"

import { Elements } from "@stripe/react-stripe-js";
import { ExpressCheckoutElement, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
type Props = {
    connectedAccountId: string;
}

function Test({ connectedAccountId }: Props) {
    const [amount, setAmount] = useState(50);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", {
      stripeAccount: connectedAccountId,
    });
    

    
  return (
      <div className="flex-col justify-center items-center w-full border-2 bg-red-100">
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: amount * 100,
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