"use client";
import { useState, memo } from "react";
import DonationForm from "./donation-form";
import { useNonprofit } from "@/app/NonprofitContext";

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
  const {nonprofitId} = useNonprofit();
  const [buttonColor, setButtonColor] = useState("#61ffba");
  const [buttonTextColor, setButtonTextColor] = useState("#000000");

  return (
    <>
      <div className="flex flex-col gap-2 p-3 border">
        <p className="mx-auto text-xl font-bold border-b">Customize</p>
        <div className="flex gap-2 justify-between">
          <p className="text-sm">Button Color</p>
          <input
            className=""
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
    </div>
    </>
  );
}