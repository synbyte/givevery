import { redirect } from "next/navigation";
import TotalDonations from "@/components/totalDonations";
import Balance from "@/components/balance";
import { Suspense } from "react";
import fetchNonprofitData from "./actions";

// Server-side function to fetch nonprofit data

export default async function ProtectedPage() {
  const data = await fetchNonprofitData();
  const connectedAccountId = data?.connectedAccount?.connected_account_id;
  const nonprofitId = data?.user?.id;

  // If no profile or onboarding not completed, redirect to onboarding
  if (!connectedAccountId) {
    console.log("No connected account, redirecting to onboarding!");
    redirect("/protected/onboarding");
  }

  return (
    <div className="flex flex-col flex-1 gap-12 w-full">
      <div className="w-full border-b">
        <p className="pb-3 text-3xl font-bold">Your Overview</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TotalDonations connectedAccountId={connectedAccountId} />
      </Suspense>
      <p>Connected Account ID: {connectedAccountId}</p>
      <p>Nonprofit ID: {nonprofitId}</p>
    </div>
  );
}
