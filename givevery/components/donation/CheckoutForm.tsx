import { useStripe, useElements, CardElement, ExpressCheckoutElement, PaymentElement } from "@stripe/react-stripe-js";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../ui/card";
import StepIndicator from "./StepIndicator";

const CheckoutForm = ({ totalAmount, onBack, setPaymentSuccess, nonprofitId }:{ totalAmount: number, setPaymentSuccess: any, nonprofitId: any, onBack: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount, nonprofitId: nonprofitId }),
      });
  
      const { clientSecret } = await res.json();
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded!');
          setPaymentSuccess(true);
        }
      }
    };
  
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-tl from-green-50 to-green-100 text-black">
        <CardHeader>
          <StepIndicator step='payment'/>
          <CardTitle>Enter Payment Details</CardTitle>
          <CardDescription>Complete your donation by providing your payment information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Label htmlFor="card-element">Pay with card</Label>
          <div id="card-element" className="p-2 border border-dashed rounded-md">
            <form><PaymentElement  /><button>submit</button></form>
          </div>
          <Label htmlFor="expressPayment">Quick pay options</Label>
          <div id="expressPayment" className="p-2 border border-dashed rounded-md">
            
          </div>
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Button type="button" onClick={onBack} className="bg-gray-500 hover:bg-gray-600 focus:ring-gray-500">
            Back
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 focus:ring-green-500">
            Pay ${totalAmount.toFixed(2)}
          </Button>
        </CardFooter>
        <div>Or pay with wallet.</div>
      </Card>
    );
  };

  export default CheckoutForm;