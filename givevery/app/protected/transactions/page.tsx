"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { useStripeConnect } from '@/hooks/useStripeConnect'
import { useNonprofit } from "@/app/NonprofitContext"
import {
  ConnectPayments,
  ConnectComponentsProvider,
  ConnectNotificationBanner,
  ConnectAccountManagement
} from "@stripe/react-connect-js"


export default function Page() {

  const { nonprofitId, connectedAccountId } = useNonprofit();
  const stripeConnectInstance = useStripeConnect(connectedAccountId)




  return (
    <div className="flex flex-col flex-1 space-y-2 w-full">
      <div className="w-full border-b">
        <p className="pb-3 text-3xl font-bold">Transactions</p>
      </div>
      <div className="w-full">
        {connectedAccountId && stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectNotificationBanner
              collectionOptions={{
                fields: 'eventually_due',
                futureRequirements: 'include',
            }}/>
            
            <ConnectPayments />
            <ConnectAccountManagement
            onLoadError={(e) => {
              console.log(e.error)
            }}/>
          </ConnectComponentsProvider>
        )}
      </div>
    </div>
  )
}