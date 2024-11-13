import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NonprofitProvider } from "../NonprofitContext";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nonprofitId = user?.id


  if (!user) {
    return redirect("/sign-in");
  }


  // Check if user has completed onboarding
  const { data: connectedAccount } = await supabase
    .from('nonprofits')
    .select('connected_account_id')
    .eq('id',user.id)
    .single()

  // If no profile or onboarding not completed, redirect to onboarding
  if (!connectedAccount) {
    console.log("No connected account, redirecting to onboarding!")
    return redirect("/protected/onboarding");
  }

  return (
    <NonprofitProvider nonprofitId={nonprofitId} connectedAccountId={connectedAccount.connected_account_id}>
      <div className="flex h-screen">
        <div className="bg-red-300 w-36 h-screen fixed top-0 left-0"></div>
        <main className="flex-1 ml-36 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </NonprofitProvider>
  );
}