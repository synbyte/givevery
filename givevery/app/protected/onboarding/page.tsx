"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useNonprofit } from "@/app/NonprofitContext";

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<
    string | undefined
  >();
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const supabase = createClient();
  const { nonprofitId, connectedAccountId } = useNonprofit();

  // Check if connected account exists
  useEffect(() => {
    if (connectedAccountId) {
      setConnectedAccount(connectedAccountId);
    }
  });

  // Create and add connected account to db
  useEffect(() => {
    async function addConnectedAccount(account: any) {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        setError(true);
        return;
      }

      const { error: updateError } = await supabase
        .from("nonprofits")
        .update({ connected_account_id: account })
        .eq("id", userData.user.id);
      console.log("Added connectedAccountId to nonprofit: ", connectedAccount);

      if (updateError) {
        console.error("Error updating nonprofit record:", updateError);
        setError(true);
      }
      if (error) {
        setError(true);
      }
    }
    if (connectedAccount) {
      console.log("Got connected account.");
      addConnectedAccount(connectedAccount);
    }
  }, [connectedAccount]);

  return (
    <div className="flex-1 flex flex-col w-full items-center space-y-6">
      <div className="w-full border-b">
        <p className="text-3xl font-bold pb-3">Onboarding</p>
      </div>
      <div className="content flex flex-col space-y-5  max-w-5xl ">
        {!connectedAccount && (
          <>
            <p className="text-2xl text-center py-3">
              <b>Welcome & thank you</b> for picking Givevery to handle your
              donations!
            </p>
            <p>
              First things first. Givevery partners with Stripe on the back end
              for all transactions. This is to ensure secure and efficiant
              transactions, streamlining the payment process for both you and
              your donors.
            </p>
            <p>
              In order to start accepting donations, you need connect your
              stripe account to the platform. If you do not already have a
              Stripe account, you will be able to create one. Don't worry this
              is a very simple one-time process that will allow us to get to
              know you better and allow you to start accepting donations right
              away!
            </p>
            <p>
              The first step is creating the Givevery connected account, click
              the button below to do so!
            </p>
          </>
        )}
        {connectedAccount && (
          <>
            <p className="text-xl">
              Great, your Givevery account was succesfully created!
            </p>
            <p>
              The next step is to connect your Stripe account to the Givevery
              platform. If you don't already have a Stripe account, you'll be
              able to create one.
            </p>
            <p>
              To complete this step, you will need to have clear understanding
              of your organizations legal structure, and authority to sign legal
              documents on behalf of your nonprofit.{" "}
            </p>
            <p>
              To make this quick and frictionless, you should have a few things
              ready:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <b>Business information:</b> Name, address, tax ID numbers.
              </li>
              <li>
                <b>Personal information:</b> Name, DOB, address, email, phone,
                and SSN.
              </li>
              <li>
                <b>Proof of Address:</b>A document verifying your business
                address like bill or bank statement.
              </li>
              <li>
                <b>Merchant category code(MCC):</b>This helps identify the type
                of business.
              </li>
              <li>
                <b>Bank account:</b> Information for the bank account you would
                like donations deposited to.
              </li>
            </ul>
            <p>
              Click the button below when you are ready to begin. A new window
              will open, when are finished you will be redirected back here.
            </p>
          </>
        )}
        {!accountCreatePending && !connectedAccount && (
          <Button
            className="bg-green-500 font-bold ring-2 ring-offset-1 ring-green-700"
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
            Create Givevery Connected Account!
          </Button>
        )}
        {connectedAccount && !accountLinkCreatePending && (
          <Button
            className="bg-green-500 font-bold ring-2 ring-offset-1 ring-green-700"
            onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
              fetch("/api/account_link", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  account: connectedAccount,
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
        {(connectedAccount ||
          accountCreatePending ||
          accountLinkCreatePending) && (
          <div className="dev-callout">
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
      </div>
    </div>
  );
}
