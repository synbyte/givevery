"use client"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useStripeConnect } from '@/hooks/useStripeConnect'
import { useNonprofit } from "@/app/NonprofitContext"
import {
  ConnectPayments,
  ConnectComponentsProvider
} from "@stripe/react-connect-js"



export default function Page() {
  const [donations, setDonations] = useState()
  const [totalDonations, setTotalDonations] = useState<number>()
  const [averageDonation, setAverageDonation] = useState<number>() 
  const { nonprofitId, connectedAccountId } = useNonprofit();
  const stripeConnectInstance = useStripeConnect(connectedAccountId)
  const supabase = createClient()


  useEffect(() => {
    const fetchDonations = async (account:string) => {
      console.log("Fetching donations for: ", connectedAccountId)
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
        const total = data.reduce((sum: number, donation: {amount: number}) => sum + donation.amount, 0);
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

  }, [connectedAccountId])

  return (
    <div className="flex-1 flex flex-col w-full space-y-2">
      <div className="w-full border-b">
        <p className="text-2xl font-bold pb-3">Transactions</p>
      </div>
      <div className="w-full">
        {connectedAccountId && stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectPayments />
          </ConnectComponentsProvider>
        )}
      </div>
    </div>
  )
}