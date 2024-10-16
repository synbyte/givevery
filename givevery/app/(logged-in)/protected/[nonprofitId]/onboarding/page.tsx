"use client";

import React, { useState, useEffect } from "react";
import { useStripeConnect } from "@/hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { Button } from "@/components/ui/button";
import Router from "next/router";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const stripeConnectInstance = useStripeConnect(connectedAccountId);
  const router = Router
  const supabase = createClient();


  useEffect(() => {
    async function addConnectedAccount(account:any){
      const { data: userData, error: userError } = await supabase.auth.getUser();
                    if (userError) {
                      console.error("Error fetching user:", userError);
                      setError(true);
                      return;
                    }

                    const { error: updateError } = await supabase
                      .from('nonprofits')
                      .update({ connected_account_id: account })
                      .eq('id', userData.user.id);

                    if (updateError) {
                      console.error("Error updating nonprofit record:", updateError);
                      setError(true);
                    }
                  if(error){setError(true)}
    }
    console.log("Added connectedAccountId to nonprofit!")
    addConnectedAccount(connectedAccountId);
  },[connectedAccountId])

  return (
    <div className="flex flex-col items-center bg-red-100">
      <div className="text-2xl font-bold">
        <p>Givevery</p>
      </div>
      <div className="content">
        {!connectedAccountId && <h2>Get ready for take off</h2>}
        {connectedAccountId && !stripeConnectInstance && <h2>Add information to start accepting money</h2>}
        {!connectedAccountId && <p>Rocket Rides is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>}
        {!accountCreatePending && !connectedAccountId && (
          <div>
            <Button
              onClick={async () => {
                setAccountCreatePending(true);
                setError(false);
                fetch("/api/account", {
                  method: "POST",
                })
                  .then((response) => response.json())
                  .then((json) => {
                    setAccountCreatePending(false);
                    const { account, error } = json;

                    if (account) {
                      setConnectedAccountId(account);
                    }

                    if (error) {
                      setError(true);
                    }
                  });
              }}
            >
              Sign up
            </Button>
          </div>
        )}
        {stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
              onExit={() => {setOnboardingExited(true); router.push('./dashboard') }}
            />
          </ConnectComponentsProvider>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || onboardingExited) && (
          <div className="dev-callout">
            {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {onboardingExited && <p>The Account Onboarding component has exited</p>}
          </div>
        )}
        <div className="info-callout">
          <p>
            This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
          </p>
        </div>
      </div>
    </div>
  );
}