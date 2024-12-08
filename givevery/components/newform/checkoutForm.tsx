import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
   
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const {error} = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
                return_url: "http://localhost:3000/success",
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
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button type="submit" disabled={isLoading || isSuccess}>
                {isLoading ? "Processing..." : isSuccess ? "Donation Successful!" : "Submit"}
            </Button>
            {error && <p className="border border-red-500 bg-red-100 text-red-700 px-4 py-3 rounded inline-flex" role="alert">{error}</p>}
        </form>
    );
}