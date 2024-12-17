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

type Step = 1 | 1.5 | 2 | 3;
type Recurrence = "once" | "monthly";

const DONATION_AMOUNTS = [50, 100, 150];
const TRANSACTION_FEE = 3.25;
const INITIAL_DONATION_AMOUNT = 100;

const DEFAULT_STRIPE_APPEARANCE = {
  theme: "stripe",
  variables: {
    colorPrimary: "#00C220",
    colorBackground: "#FFFFFF",
  },
} as const;

export default function DonationForm({ connectedAccountId }: DonationFormProps) {
  const [stripeOptions, setStripeOptions] = useState<StripeElementsOptions>();
  const [stripeDefaultOptions, setStripeDefaultOptions] = useState<StripeElementsOptions>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>();
  const [clientSecretDefault, setClientSecretDefault] = useState<string>();
  const [donationAmount, setDonationAmount] = useState<number>(INITIAL_DONATION_AMOUNT);
  const [customAmount, setCustomAmount] = useState<number>();
  const [coverFees, setCoverFees] = useState(false);
  const [error, setError] = useState<string>();
  const [step, setStep] = useState<Step>(1);
  const [recurrence, setRecurrence] = useState<Recurrence>("once");

  const stripePromiseMemo = useMemo(() => {
    if (!connectedAccountId) {
      const error = new Error("No connected account ID provided");
      setError(error.message);
      throw error;
    }

    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", {
      stripeAccount: connectedAccountId,
    });
  }, [connectedAccountId]);

  const getButtonClass = (isSelected: boolean) => {
    return `flex-1 ${
      isSelected
        ? "bg-gradient-to-tr from-green-500 to-green-400 text-white font-bold hover:bg-green-600 ring-2 ring-offset-0 ring-green-900"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300"
    } focus:outline-none transition-all duration-500 p-2 rounded-md border-green-500 border border-dotted`;
  };

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

  const handleDonateClick = async () => {
    try {
      if (totalAmount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const secret = await createPaymentIntent(totalAmount);
      setClientSecret(secret);
      setStep(recurrence === "once" ? 2 : 1.5);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Error creating payment intent");
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const validValue = isNaN(value) ? undefined : value;
    setCustomAmount(validValue);
    setDonationAmount(value);
  };

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const secret = await createPaymentIntent(INITIAL_DONATION_AMOUNT);
        setClientSecretDefault(secret);
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
        appearance: DEFAULT_STRIPE_APPEARANCE,
      });
    }
  }, [clientSecretDefault]);

  useEffect(() => {
    if (clientSecret) {
      setStripeOptions({
        clientSecret,
        appearance: DEFAULT_STRIPE_APPEARANCE,
      });
    }
  }, [clientSecret]);

  useEffect(() => {
    const baseAmount = Number(customAmount) || donationAmount || 0;
    const fee = coverFees ? TRANSACTION_FEE : 0;
    setTotalAmount(baseAmount + fee);
  }, [customAmount, donationAmount, coverFees]);

  return (
    <Card className="mx-auto max-w-md text-black bg-gradient-to-tl from-green-50 to-green-100">
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
                onClick={() => setRecurrence("once")}
                className={getButtonClass(recurrence === "once")}
              >
                Donate Once
              </button>
              <button
                onClick={() => setRecurrence("monthly")}
                className={getButtonClass(recurrence === "monthly")}              
              >
                Donate Monthly
              </button>
            </div>
            <div className="flex space-x-4">
              {DONATION_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setDonationAmount(amount);
                    setCustomAmount(amount);
                  }}
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
              <Elements stripe={stripePromiseMemo} options={stripeDefaultOptions}>
                <ExpressCheckoutElement 
                  options={{ 
                    buttonType: { googlePay: "donate" },
                    paymentMethodOrder: ["googlePay", "link"]
                  }} 
                  onConfirm={() => console.log("Confirmed")}
                />
              </Elements>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-500"
              onClick={handleDonateClick}
            >
              Donate ${totalAmount.toFixed(2)}{recurrence === "monthly" ? " Monthly" : ""}
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
        <CustomerForm 
          stripePromiseMemo={stripePromiseMemo}
          amount={totalAmount.toFixed(2)} 
          connectedAccountId={connectedAccountId} 
          onBack={setStep}
        />
      )}
      {step === 2 && clientSecret && stripeOptions && (
        <Elements stripe={stripePromiseMemo} options={stripeOptions}>
          <CheckoutForm onBack={() => setStep(1)}/>
        </Elements>
      )}
    </Card>
  );
}
