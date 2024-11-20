import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NonprofitProvider } from "../NonprofitContext";
import Sidebar from "@/components/sidebar";

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



  return (
    <NonprofitProvider nonprofitId={nonprofitId} connectedAccountId={connectedAccount?.connected_account_id}>
      <div className="flex flex-1 min-h-screen w-full justify-end">
        <Sidebar/>
        <div className="flex-1 ml-64 py-8 justify-end ">
          {children}
        </div>
      </div>
    </NonprofitProvider>
  );
}