"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useMemo, useState } from "react";

interface DonationFormProps {
  connectedAccountId: string;
}

let stripePromise: Promise<Stripe | null>;

export default function DonationForm({
  connectedAccountId,
}: DonationFormProps) {

  const [stripeOptions, setStripeOptions] = useState<StripeElementsOptions | undefined>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string | undefined>();

  const stripePromiseMemo = useMemo(() => {
    if (connectedAccountId) {
      stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
        {
          stripeAccount: connectedAccountId,
        }
      );
    }
    return stripePromise;
  }, [connectedAccountId]);

  const handleDonateClick = async () => {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount,
        connectedAccountId,
      }),
    })
    const data = await response.json();
    setClientSecret(data.clientSecret);
    console.log("Client Secret: ", data.clientSecret);
  }


  return (
    <>
      <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />
      <button onClick={handleDonateClick}>donate ${totalAmount}</button>
    <Elements
      stripe={stripePromiseMemo}
      options={stripeOptions}
    >
      <p></p>
    </Elements>
    </>
  );
}
