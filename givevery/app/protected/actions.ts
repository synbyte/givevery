import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/utils";

export default async function fetchNonprofitData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: connectedAccount } = await supabase
    .from('nonprofits')
    .select('connected_account_id')
    .eq('id', user.id)
    .single();
    
  return { user, connectedAccount };
}
