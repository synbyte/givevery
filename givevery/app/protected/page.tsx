 // Start of Selection
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TotalDonations from "@/components/totalDonations";
import DonationLineChart from "@/components/donationLineChart";
import TopDonors from "@/components/TopDonors";
import fetchNonprofitData from "./actions";

export default async function ProtectedPage() {
  const data = await fetchNonprofitData();
  const connectedAccountId = data?.connectedAccount?.connected_account_id;
  const nonprofitId = data?.user?.id;

  // Redirect to onboarding if no connected account
  if (!connectedAccountId) {
    redirect("/protected/onboarding");
    return null;
  }

  return (
    <div className="flex flex-col flex-1 gap-12 w-full">
      <header className="w-full border-b">
        <h1 className="pb-3 text-3xl font-bold">Your Overview</h1>
      </header>
      
      <Suspense fallback={
           
            <div className="flex flex-col justify-center items-center">
              <p className="mb-2">Loading Donations...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-600"></div>
            </div>
      }>
        <TotalDonations connectedAccountId={connectedAccountId} />
      </Suspense>
      
      <DonationLineChart connectedAccountId={connectedAccountId} />
      
      <Suspense fallback={
            // Start of Selection
            <div className="flex flex-col justify-center items-center">
              <p className="mb-2">Loading Donations...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-600"></div>
            </div>
      }>
        <TopDonors connectedAccountId={connectedAccountId} />
      </Suspense>
      
      <section>
        <p>Connected Account ID: {connectedAccountId}</p>
        <p>Nonprofit ID: {nonprofitId}</p>
      </section>
    </div>
  );
}
