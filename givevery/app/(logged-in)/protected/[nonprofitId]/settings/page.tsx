"use client"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useStripeConnect } from "@/hooks/useStripeConnect"
import {
  ConnectAccountManagement,
  ConnectNotificationBanner,
  ConnectComponentsProvider
} from "@stripe/react-connect-js"





export default function Page() {
  const [missingReqs, setMissingReqs] = useState()
  const [connectedAccountId, setConnectedAccountId] = useState()
  const stripeConnectInstance = useStripeConnect(connectedAccountId)
  const router = useParams()
  const { nonprofitId } = router;
  const supabase = createClient()
  

  // SET connectedAccountId from DB
  useEffect(() => {


    const fetchConnectedAccountId = async () => {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('*')
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



  return (
    <div className="flex-1 flex flex-col w-full space-y-2">
      <div className="w-full border-b">
        <p className="text-2xl font-bold">Settings</p>
      </div>
      <div className="w-full">
        {connectedAccountId && stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectNotificationBanner/>
            <ConnectAccountManagement collectionOptions={{
              fields: 'currently_due',
              futureRequirements: 'include',
            }} />
          </ConnectComponentsProvider>
        )}
      </div>
    </div>
  )
}