'use client'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { useMemo } from "react";

interface DonationFormProps {
  connectedAccountId: string;
}

let stripePromise: Promise<Stripe | null>

export default function DonationForm({ connectedAccountId }: DonationFormProps) {

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

  const options = {
    mode: 'payment' as const,
    currency: 'usd',
    amount: 1000,
  };
   
  return (
    <Elements stripe={stripePromise} options={options}>
      <p>heyy {connectedAccountId}</p>
    </Elements>
  );
}
