"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/components/donation/CheckoutForm";
import SuccessPage from "@/components/donation/SuccessPage";
import StepIndicator from "@/components/donation/StepIndicator";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY||'');


export default function DonationForm() {
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [coverFees, setCoverFees] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeOptions, setStripeOptions] = useState(null);
  const TRANSACTION_FEE = 3.25;

 
  
  

  const handleDonationTypeChange = (type: "once" | "monthly") => {
    setDonationType(type);
  };

  const handleDonationAmountChange = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setDonationAmount(null);
  };

  const getButtonClass = (isSelected: boolean) => {
    return `flex-1 ${
      isSelected
        ? "bg-gradient-to-tr from-green-500 to-green-400 text-white font-bold hover:bg-green-600 ring-2 ring-offset-0 ring-green-900"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300"
    } focus:outline-none transition-all duration-200 p-2 rounded-md border-green-500 border border-dashed`;
  };

  useEffect(() => {
    const baseAmount = Number(customAmount) || donationAmount || 0;
    const fee = coverFees ? TRANSACTION_FEE : 0;
    const newTotalAmount = baseAmount + fee;
    setTotalAmount(newTotalAmount);

    if (newTotalAmount > 0) {
      setStripeOptions({
        mode: "payment",
        amount: newTotalAmount * 100,
        currency: "usd",
        
      });
    }
  }, [customAmount, donationAmount, coverFees]);

  const handleDonateClick = () => {
    if (Number(customAmount) || donationAmount > 0) {
    setStep("payment");
  } else {
    alert("Please enter a valid donation amount.");
  }
};

  const handleBackClick = () => {
    setStep("form");
  };

  return (
    
      <Card className="w-full max-w-md mx-auto bg-gradient-to-tl from-green-50 to-green-100 text-black">
        {paymentSuccess ? (
            <SuccessPage totalAmount={totalAmount} /> 
        ) : step === "form" ? (
          <>
            <CardHeader>
            <StepIndicator step='form'/>
              <CardTitle>Make a Donation </CardTitle>         
              <CardDescription>Monthly giving goes a long way to support our cause!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex bg-gray-100 space-x-1 mb-10">
                <button
                  onClick={() => handleDonationTypeChange("once")}
                  className={getButtonClass(donationType === "once")}
                >
                  Donate Once
                </button>
                <button
                  onClick={() => handleDonationTypeChange("monthly")}
                  className={getButtonClass(donationType === "monthly")}
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
              <div className="flex items-center justify-between space-x-2">
                <Checkbox
                  id="cover-fees"
                  checked={coverFees}
                  onCheckedChange={(checked) => setCoverFees(checked as boolean)}
                  className='ring-1 ring-green-500'
                />
                <Label htmlFor="cover-fees">
                  Cover transaction fees (${TRANSACTION_FEE.toFixed(2)})
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-500" onClick={handleDonateClick}>
                Donate ${totalAmount.toFixed(2)} {donationType === "monthly" ? "Monthly" : ""}
              </Button>
            </CardFooter>
          </>
        ) : step === "payment" && stripeOptions && (
          <Elements stripe={stripePromise} options={stripeOptions}>
          <CheckoutForm setPaymentSuccess={setPaymentSuccess} totalAmount={totalAmount} onBack={handleBackClick} />
          </Elements>
        )}
      </Card>
    
  );
}
