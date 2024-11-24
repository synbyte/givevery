import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NonprofitProvider } from "../NonprofitContext";
import Sidebar from "@/components/sidebar";
import { cache } from 'react';

// Cache the auth check
const getUser = cache(async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: connectedAccount } = await supabase
    .from('nonprofits')
    .select('connected_account_id')
    .eq('id', user.id)
    .single();
    
  return { user, connectedAccount };
});

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUser();

  if (!userData?.user) {
    return redirect("/sign-in");
  }

  return (
    <NonprofitProvider 
      nonprofitId={userData.user.id} 
      connectedAccountId={userData.connectedAccount?.connected_account_id}
    >
      <div className="flex flex-1 justify-end w-full min-h-screen">
        <Sidebar/>
        <div className="flex-1 justify-end py-8 ml-64">
          {children}
        </div>
      </div>
    </NonprofitProvider>
  );
}