import { PaymentElement, ExpressCheckoutElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";


export default function CheckoutForm({onBack, amount,connectedAccountId}: {onBack: () => void, amount: number, connectedAccountId: string}) {
    const stripe = useStripe();
    const elements = useElements();
  
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const createPaymentIntent = async (amount: number, connectedAccountId: string) => {
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setIsLoading(false);
            return;
        }

        const clientSecret = await createPaymentIntent(amount,connectedAccountId);
       

        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            redirect: "if_required",
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setIsSuccess(true);
        }

        setIsLoading(false);
    }
    
    if (!stripe) {
        return <div>Loading payment form...</div>;
    }
    
    return (
        <form className="p-4" onSubmit={handleSubmit}>
            {amount}
            <PaymentElement options={{layout:{type:"accordion",radios:false}}} />
            <Button type="submit" disabled={isLoading || isSuccess}>
                {isLoading ? "Processing..." : isSuccess ? "Donation Successful!" : "Submit"}
            </Button>
            <Button type="button" onClick={onBack}>Back</Button>
            {error && <p className="border border-red-500 bg-red-100 text-red-700 px-4 py-3 rounded inline-flex" role="alert">{error}</p>}
        </form>
    );
}