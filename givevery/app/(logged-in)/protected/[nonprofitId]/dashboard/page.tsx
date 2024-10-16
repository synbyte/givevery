"use client"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useStripeConnect } from "@/hooks/useStripeConnect"
import { 
    ConnectPayments, 
    ConnectComponentsProvider } from "@stripe/react-connect-js"

export default function Page() {
    const [ connectedAccountId, setConnectedAccountId ] = useState()
    const stripeConnectInstance = useStripeConnect(connectedAccountId)
    const router = useParams()
    const { nonprofitId } = router;
    const supabase = createClient()

    // SET connectedAccountId from DB
  useEffect(() => {
    const fetchConnectedAccountId = async () => {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('connected_account_id')
        .eq('id', nonprofitId)
        .single();
  
      if (error) {
        console.error('Error fetching connected account ID:', error);
      } else {
        setConnectedAccountId(data.connected_account_id);
        console.log("Got Connected Account ID!", data.connected_account_id)
      }
    };
  
    fetchConnectedAccountId();
    
  }, [nonprofitId]);

  useEffect(() => {
    
  },[connectedAccountId])

    return (
        <div className="flex-1 flex flex-col w-full gap-12 space-y-6">
        <div className="w-full border-b">
            <p className="text-2xl font-bold">Transactions</p>
        </div>
        <div className="w-full">
            { connectedAccountId && stripeConnectInstance && (
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <ConnectPayments/>
                </ConnectComponentsProvider>
            )}
        </div>
        </div>
    )
}