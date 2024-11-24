import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";


const SuccessPage = ({totalAmount}:{totalAmount: number}) => {
    return (
      <Card className="mx-auto w-full max-w-md text-black bg-gradient-to-tl from-green-50 to-green-100">
        <CardHeader>
            <StepIndicator step='success'/>
            <CardTitle>Thank you!</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Your donation of <span className="text-2xl font-bold">${totalAmount}</span> has been received. Thank you for your support!</p>
        </CardContent>
        
        </Card>
    );
  };


export default SuccessPage;