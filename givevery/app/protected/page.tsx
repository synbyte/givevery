'use client'
import { useNonprofit } from "../NonprofitContext";
import { useRouter } from "next/navigation";

export default async function ProtectedPage() {
  const r = useRouter();
  
  const {nonprofitId, connectedAccountId} = useNonprofit();
  
    // If no profile or onboarding not completed, redirect to onboarding
    if (!connectedAccountId) {
      console.log("No connected account, redirecting to onboarding!")
      return r.push("/protected/onboarding");
    }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full border-b">
        <p className="text-3xl font-bold pb-3">Your Overview</p>
      </div>
    </div>
  );
}
