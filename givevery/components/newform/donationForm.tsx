"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CheckoutForm from "./checkoutForm";


interface DonationFormProps {
  connectedAccountId: string;
}

type Step = 1 | 2 | 3;
type Recurrence = "once" | "monthly";


let stripePromise: Promise<Stripe | null>;

export default function DonationForm({
  connectedAccountId,
}: DonationFormProps) {

  const [stripeOptions, setStripeOptions] = useState<StripeElementsOptions>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<number>();
  const [coverFees, setCoverFees] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [step, setStep] = useState<Step>(1);
  const [recurrence, setRecurrence] = useState<Recurrence>("once");
  const TRANSACTION_FEE = 3.25;


  const stripePromiseMemo = useMemo(() => {
    if (!connectedAccountId) {
      const error = new Error("No connected account ID provided");
      setError(error.message);
      throw error;
    }
    
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      {
        stripeAccount: connectedAccountId,
      }
    );
    return stripePromise;
  }, [connectedAccountId]);

  const getButtonClass = (isSelected: boolean) => {
    return `flex-1 ${
      isSelected
        ? "bg-gradient-to-tr from-green-500 to-green-400 text-white font-bold hover:bg-green-600 ring-2 ring-offset-0 ring-green-900"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300"
    } focus:outline-none transition-all duration-200 p-2 rounded-md border-green-500 border border-dashed`;
  };

  const handleDonateClick = async () => {
    try {
      if (totalAmount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          connectedAccountId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment intent creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error("No client secret received from server");
      }

      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Error creating payment intent");
    }
  }

  const handleRecurrenceChange = (type: Recurrence) => {
    setRecurrence(type);
  };

  const handleDonationAmountChange = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount(undefined);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCustomAmount(isNaN(value) ? undefined : value);
  };

  useEffect(() => {
    if (clientSecret) {  // Add this check
      setStripeOptions({
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#00C220",
            colorBackground: "#FFFFFF",
          },
        },
      });
      console.log("Stripe Options set with client secret!");
    }
  }, [clientSecret]);

  useEffect(() => {
    const baseAmount = Number(customAmount) || donationAmount || 0;
    const fee = coverFees ? TRANSACTION_FEE : 0;
    const newTotalAmount = baseAmount + fee;
    setTotalAmount(newTotalAmount);
  }, [customAmount, donationAmount, coverFees]);

  return (
    <Card className="mx-auto w-full max-w-md text-black bg-gradient-to-tl from-green-50 to-green-100">
   
        {step === 1 && (
        <>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>
              Monthly giving goes a long way to support our cause!
            </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="flex mb-10 space-x-1 bg-gray-100">
              <button
                onClick={() => handleRecurrenceChange("once")}
                className={getButtonClass(recurrence === "once")}
              >
                Donate Once
              </button>
              <button
                onClick={() => handleRecurrenceChange("monthly")}
                className={getButtonClass(recurrence === "monthly")}
              >
                Donate Monthly
              </button>
            </div>
            <div className="flex space-x-4">
              {[50, 100, 150].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonationAmountChange(amount)}
                  className={getButtonClass(donationAmount === amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full bg-white"
              />
            </div>
            <div className="flex justify-between items-center space-x-2">
              <Checkbox
                id="cover-fees"
                checked={coverFees}
                onCheckedChange={(checked) => setCoverFees(checked as boolean)}
                className="ring-1 ring-green-500"
              />
              <Label htmlFor="cover-fees">
                Cover transaction fees (${TRANSACTION_FEE.toFixed(2)})
              </Label>
            </div>
            </CardContent>
            <CardFooter>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-500"
              onClick={handleDonateClick}
            >
              Donate ${totalAmount.toFixed(2)}{" "}
              {recurrence === "monthly" ? "Monthly" : ""}
            </Button>
          {error && <p onClick={() => setError(undefined)} className="border border-red-500 bg-red-100 text-red-700 px-4 py-3 rounded inline-flex" role="alert">{error}</p>}
          </CardFooter>
          </>
      )}
      {step === 2 && (
        <>
      {clientSecret && stripeOptions && (
        <Elements
          stripe={stripePromiseMemo}
          options={stripeOptions}
        >
          <CheckoutForm />
          </Elements>
      )}
      </>
      )}
    </Card>
  );
}
