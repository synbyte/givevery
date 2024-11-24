const StepIndicator = ({ step }: { step: "form" | "payment" | "success" }) => {
    return (
      <div className="flex justify-end items-center space-x-2">
        <span className={`w-2 h-3 rounded-full ${step === "form" ? "bg-green-500" : "bg-gray-300"}`}></span>
        <span className={`w-2 h-3 rounded-full ${step === "payment"  ? "bg-green-500" : "bg-gray-300"}`}></span>
        <span className={`w-2 h-3 rounded-full ${step === "success" ? "bg-green-500" : "bg-gray-300"}`}></span>
    </div>
    );
  };

  export default StepIndicator;