import { useStripe, useElements, CardElement, ExpressCheckoutElement, PaymentElement } from "@stripe/react-stripe-js";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../ui/card";
import StepIndicator from "./StepIndicator";

const CheckoutForm = ({ totalAmount, onBack, setPaymentSuccess, connectedAccountId }:{ totalAmount: number, setPaymentSuccess: any, connectedAccountId: any, onBack: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event: any) => {
      event.preventDefault();
  
      
  
      if (!stripe || !elements) {
        console.log("Stripe or elements hasnt been loaded!")
        return;
      }
  
      const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:'http://localhost:3000/donate/fcdd2caf-8b16-48f0-9248-eb845eb9daab',
        },
      });
  
      if (error) {
        console.error(error.message);
      } else {
        
          console.log('Payment succeeded!');
          setPaymentSuccess(true);
        
      }
    };
  
    return (
      <Card className="mx-auto w-full max-w-md text-black bg-gradient-to-tl from-green-50 to-green-100">
        <CardHeader>
          <StepIndicator step='payment'/>
          <CardTitle>Enter Payment Details</CardTitle>
          <CardDescription>Complete your donation by providing your payment information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Label htmlFor="card-element">Pay with card</Label>
          <div id="card-element" className="p-2 rounded-md border border-dashed">
            <form><PaymentElement  /><button>submit</button></form>
          </div>
          <Label htmlFor="expressPayment">Quick pay options</Label>
          <div id="expressPayment" className="p-2 rounded-md border border-dashed">
            
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