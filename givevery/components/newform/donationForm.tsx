"use client";
import { Elements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CheckoutForm from "./checkoutForm";
import CustomerForm from "./customerForm";

interface DonationFormProps {
  connectedAccountId: string;
}
type Step = 1 | 1.5 |2 | 3;
type Recurrence = "once" | "monthly";

let stripePromise: Promise<Stripe | null>;

export default function DonationForm({
  connectedAccountId,
}: DonationFormProps) {
  const [stripeOptions, setStripeOptions] = useState<StripeElementsOptions>();
  const [stripeDefaultOptions, setStripeDefaultOptions] = useState<StripeElementsOptions>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [clientSecretDefault, setClientSecretDefault] = useState<string | undefined>();
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<number>();
  const [coverFees, setCoverFees] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [step, setStep] = useState<Step>(1);
  const [recurrence, setRecurrence] = useState<Recurrence>("once");
  const TRANSACTION_FEE = 3.25;
  // Memoized Stripe promise to avoid recreating on every render
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

  // Helper function to generate button class names based on selection state
  const getButtonClass = (isSelected: boolean) => {
    return `flex-1 ${
      isSelected
        ? "bg-gradient-to-tr from-green-500 to-green-400 text-white font-bold hover:bg-green-600 ring-2 ring-offset-0 ring-green-900"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300"
    } focus:outline-none transition-all duration-500 p-2 rounded-md border-green-500 border border-dotted`;
  };

  // Handle donation button click - creates payment intent and moves to next step
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
        throw new Error(
          `Payment intent creation failed: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error("No client secret received from server");
      }

      setClientSecret(data.clientSecret);
      // Move to appropriate step based on recurrence type
      if (recurrence === "once") {
        setStep(2);
      } else {
        setStep(1.5);
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Error creating payment intent");
    }
  };

  // Update recurrence type (one-time vs monthly)
  const handleRecurrenceChange = (type: Recurrence) => {
    setRecurrence(type);
  };

  // Handle preset donation amount selection
  const handleDonationAmountChange = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount(amount);
  };

  // Handle custom donation amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCustomAmount(isNaN(value) ? undefined : value);
    setDonationAmount(value);
  };

  // Initialize Stripe with default amount on page load
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 100,
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

        setClientSecretDefault(data.clientSecret);
       

      } catch (error) {
        console.error("Error initializing Stripe:", error);
        setError("Error initializing payment form");
      }
    };

    initializeStripe();
  }, [connectedAccountId]); 

  useEffect(() => {
    if (clientSecretDefault) {
      setStripeDefaultOptions({
        clientSecret: clientSecretDefault,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#00C220", 
            colorBackground: "#FFFFFF",
          },
        },
      });
    }
    console.log(stripeDefaultOptions)
  }, [clientSecretDefault]);

  // Set up Stripe Elements options when client secret is available
  useEffect(() => {
    if (clientSecret) {
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

  // Calculate total amount including optional transaction fee
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
          <CardContent className="space-y-5">
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
            {clientSecretDefault && stripeDefaultOptions && recurrence === "once" && (
            <Elements
            stripe={stripePromiseMemo}
            options={stripeDefaultOptions}
            >
                <ExpressCheckoutElement options={{ buttonType: { googlePay: "donate" } , paymentMethodOrder: ["googlePay","link"] }} onConfirm={() => {console.log("Confirmed")}}/>
            </Elements>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-500"
              onClick={handleDonateClick}
            >
              Donate ${totalAmount.toFixed(2)}{" "}
              {recurrence === "monthly" ? "Monthly" : ""}
            </Button>
            {error && (
              <p
                onClick={() => setError(undefined)}
                className="border border-red-500 bg-red-100 text-red-700 px-4 py-3 rounded inline-flex"
                role="alert"
              >
                {error}
              </p>
            )}
          </CardFooter>
        </>
      )}
      {step === 1.5 && (
        
        <CustomerForm stripePromiseMemo={stripePromiseMemo}  amount={totalAmount.toFixed(2)} connectedAccountId={connectedAccountId} onBack={setStep}  />
        
      )}
      {step === 2 && (
        <>
        {clientSecret && stripeOptions && (
          <Elements
            stripe={stripePromiseMemo}
            options={stripeOptions}
          >
              <CheckoutForm onBack={() => setStep(1)}/>
            </Elements>
          )}
        </>
      )}
    </Card>
  );
}
