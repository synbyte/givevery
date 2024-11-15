"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Router from "next/router";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useNonprofit } from "@/app/NonprofitContext";

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState();
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const router = Router
  const supabase = createClient();
  const { nonprofitId, connectedAccountId } = useNonprofit();

 /*  useEffect(() => {
    
        async function checkConnectedAccountId() {
          try {
            const { data, error } = await supabase
              .from('nonprofits')
              .select('connected_account_id')
              .eq('id', nonprofitId)
              .single();
    
            if (error) {
              console.error("Error checking connected_account_id:", error);
              setError(true);
              return false;
            }
    
            if (data && data.connected_account_id) {
              setConnectedAccountId(data.connected_account_id);
              return true;
            }
    
            return false;
          } catch (err) {
            console.error("Unexpected error:", err);
            setError(true);
            return false;
          }
        }
    
        checkConnectedAccountId();
    
  }) */


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
    console.log("Added connectedAccountId to nonprofit: ", connectedAccount)
    addConnectedAccount(connectedAccount);
  },[connectedAccount])
 
  return (
    <div className="flex-1 flex flex-col w-full space-y-2">
      <div className="w-full border-b">
        <p className="text-2xl font-bold">Welcome to Givevery</p>
      </div>
      <div className="content">
        {!connectedAccountId && <p className="text-xl">First things first!</p>}
        {!connectedAccountId && <p>In order to accept donations, you need connect your stripe account to the platform.</p>}
        {connectedAccountId && <h2>Add information to start accepting money</h2>}
        {connectedAccountId && <p>Matt's Mats partners with Stripe to help you receive payments while keeping your personal and bank details secure.</p>}
        {!accountCreatePending && !connectedAccountId && (
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
                    setConnectedAccount(account);
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            Create an account!
          </Button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <Button
            onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
              fetch("/api/account_link", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  account: connectedAccountId,
                }),
              })
                .then((response) => response.json())
                .then((json) => {
                  setAccountLinkCreatePending(false);

                  const { url, error } = json;
                  if (url) {
                    window.location.href = url;
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            Add information
          </Button>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || accountLinkCreatePending) && (
          <div className="dev-callout">
            {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
        <div className="info-callout">
          <p>
          This is a sample app for Stripe-hosted Connect onboarding. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted" target="_blank" rel="noopener noreferrer">View docs</a>
          </p>
        </div>
      </div>
    </div>
  );
}