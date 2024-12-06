"use client";
import { useEffect } from "react";
import { useNonprofit } from "../NonprofitContext";
import { useRouter } from "next/navigation";


export default function ProtectedPage() {
  const r = useRouter();

  const { nonprofitId, connectedAccountId } = useNonprofit();

  // If no profile or onboarding not completed, redirect to onboarding
  useEffect(() => {
    if (!connectedAccountId) {
      console.log("No connected account, redirecting to onboarding!")
      r.push("/protected/onboarding");
    }
  }, [connectedAccountId, r])
  
  if (!connectedAccountId) {
      return null
  }

  return (
    <div className="flex flex-col flex-1 gap-12 w-full">
      <div className="w-full border-b">
        <p className="pb-3 text-3xl font-bold">Your Overview</p>
      </div>
      <p>Connected Account ID: {connectedAccountId}</p>
      <p>Nonprofit ID: {nonprofitId}</p>
    </div>
  );
}
