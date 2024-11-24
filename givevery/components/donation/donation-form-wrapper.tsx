"use client";
import { useState, memo } from "react";
import DonationForm from "./donation-form";

const PreviewButton = memo(({ buttonColor, buttonTextColor }: { 
  buttonColor: string; 
  buttonTextColor: string; 
}) => (
  <button
    style={{
      backgroundColor: buttonColor,
      color: buttonTextColor,
      padding: 5,
      borderRadius: "5px",
    }}
  >
    Hello!
  </button>
));

export default function DonationFormWrapper() {
  const [buttonColor, setButtonColor] = useState("#123fff");
  const [buttonTextColor, setButtonTextColor] = useState("#000000");

  return (
    <>
      <div className="flex flex-col p-3 border">
        <p className="mx-auto mb-3 text-xl font-bold border-b">Customize</p>
        <div className="flex gap-2 justify-between">
          <p className="text-sm">Button Color</p>
          <input
            type="color"
            value={buttonColor}
            onChange={(e) => setButtonColor(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-between">
          <p className="text-sm">Button Text</p>
          <input
            type="color"
            value={buttonTextColor}
            onChange={(e) => setButtonTextColor(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 p-3 border">
        <PreviewButton buttonColor={buttonColor} buttonTextColor={buttonTextColor} />
        <DonationForm />
      </div>
    </>
  );
}