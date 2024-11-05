"use client"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useStripeConnect } from "@/hooks/useStripeConnect"
import { 
    ConnectPayments, 
    ConnectComponentsProvider } from "@stripe/react-connect-js"

export default function Page() {
  const [ donations, setDonations ] = useState()
  const [ totalDonations, setTotalDonations ] = useState<number>()
  const [ averageDonation, setAverageDonation ] = useState<number>()
    const [ connectedAccountId, setConnectedAccountId ] = useState<string>()
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
    const fetchDonations = async (account: string) => {
      const response = await fetch('/api/list-payment-intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectedAccountId: account,
        })
      })
      const data = await response.json();
      console.log(data)
      setDonations(data)
      
      if (Array.isArray(data)) {
        const total = data.reduce((sum: number, donation: { amount: number }) => sum + donation.amount, 0);
        setTotalDonations(total);
        setAverageDonation(total / data.length || 0);
      } else {
        console.error('Data is not an array:', data);
        setTotalDonations(0);
        setAverageDonation(0);
      }


  }
  if (connectedAccountId) {
  fetchDonations(connectedAccountId);
  }
    
  },[connectedAccountId])

    return (
        <div className="flex-1 flex flex-col w-full gap-12 space-y-6">
        <div className="w-full border-b">
            <p className="text-2xl font-bold">Your Overview</p>
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