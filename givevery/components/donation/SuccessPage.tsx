import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";


const SuccessPage = ({totalAmount}) => {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-tl from-green-50 to-green-100 text-black">
        <CardHeader>
            <StepIndicator step='success'/>
            <CardTitle>Thank you!</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Your donation of <span className="font-bold text-2xl">${totalAmount}</span> has been received. Thank you for your support!</p>
        </CardContent>
        
        </Card>
    );
  };


export default SuccessPage;