"use client";
import { useEffect, useState } from "react";

// Props type definition for the component
type Props = {
  connectedAccountId: string | undefined;
};

export default function TotalDonations({ connectedAccountId }: Props) {
  // State for one-time donations
  const [donations, setDonations] = useState<any[]>([]);
  const [numOfDonations, setNumOfDonations] = useState<number>();
  const [totalDonations, setTotalDonations] = useState<number>();
  const [averageDonation, setAverageDonation] = useState<number>();

  // State for recurring subscriptions  
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [numOfSubscriptions, setNumOfSubscriptions] = useState<number>();
  const [totalSubscriptions, setTotalSubscriptions] = useState<number>();
  const [averageSubscription, setAverageSubscription] = useState<number>();

  // Effect hook to fetch one-time donations
  useEffect(() => {
    let isMounted = true;
    const fetchDonations = async (account: string) => {
      let allDonations: any[] = [];
      let hasMore = true;
      let startingAfter = undefined;
    
      // Fetch donations in batches until no more are available
      while (hasMore && isMounted) {
        const response: Response = await fetch("/api/list-charges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            connectedAccountId: account,
            startingAfter,
          }),
        });
        const data = await response.json();
        
        // Validate response data format
        if (!data.donations || !Array.isArray(data.donations)) {
          console.error("Invalid data format:", data);
          break;
        }
    
        allDonations = [...allDonations, ...data.donations];
        hasMore = data.hasMore;
        startingAfter = data.lastId;
      }
    
      // Don't update state if component unmounted
      if (!isMounted) return;
    
      // Calculate total donation amount
      const total = allDonations.reduce(
        (sum: number, donation: { amount: number }) => sum + donation.amount,
        0
      );
    
      // Update donation-related state
      setDonations(allDonations);
      setNumOfDonations(allDonations.length);
      setTotalDonations(total);
      setAverageDonation(Number((total / allDonations.length || 0).toFixed(2)));
    };

    if (connectedAccountId !== undefined) {
      fetchDonations(connectedAccountId);
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [connectedAccountId]);

  // Effect hook to fetch recurring subscriptions
  useEffect(() => {
    let isMounted = true;
    const fetchSubscriptions = async (account: string) => {
      let allSubscriptions: any[] = [];
      let hasMore = true;
      let startingAfter = undefined;
  
      // Fetch subscriptions in batches until no more are available
      while (hasMore && isMounted) {
        const response: Response = await fetch("/api/list-subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            connectedAccountId: account,
            startingAfter,
          }),
        });
        
        const data = await response.json();
        
        // Validate response data format
        if (!data.subscriptions || !Array.isArray(data.subscriptions)) {
          console.error("Invalid subscription data format:", data);
          break;
        }
  
        allSubscriptions = [...allSubscriptions, ...data.subscriptions];
        hasMore = data.hasMore;
        startingAfter = data.lastId;
      }
  
      // Don't update state if component unmounted
      if (!isMounted) return;
  
      // Calculate total subscription amount
      const total = allSubscriptions.reduce(
        (sum: number, subscription: { amount: number }) => sum + subscription.amount,
        0
      );
  
      // Update subscription-related state
      setSubscriptions(allSubscriptions);
      setNumOfSubscriptions(allSubscriptions.length);
      setTotalSubscriptions(total);
      setAverageSubscription(Number((total / allSubscriptions.length || 0).toFixed(2)));
    };
  
    if (connectedAccountId !== undefined) {
      fetchSubscriptions(connectedAccountId);
    }
  
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [connectedAccountId]);
 

  // Show loading state while data is being fetched
  if (!totalDonations || !totalSubscriptions) {
    return (
      <div className="text-xl animate-bounce text-center font-bold">
        <p>Loading...</p>
      </div>
    );
  }

  // Render donation statistics
  return (
    <div className="flex gap-10">
      {/* One-time donations section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-lime-600">One-time</p>
          <div className="relative">
            <span className="text-gray-400 text-xs cursor-help border rounded-full px-1" title="This is the total amount recieved without taking fees into account">?</span>
          </div>
        </div>
        <p className="text-3xl font-bold">
          {totalDonations === undefined ? "-" : `$${totalDonations}`}
        </p>
        <p className="text-xs font-bold text-gray-400">
          {numOfDonations === undefined
            ? "-"
            : `${numOfDonations} single donations`}
        </p>
      </div>

      {/* Average donation section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-lime-600">Average Donation</p>
          <div className="relative">
            <span className="text-gray-400 text-xs cursor-help border rounded-full px-1" title="This is the average amount recieved per donation.">?</span>
          </div>
        </div>
        <p className="text-3xl font-bold">
          {averageDonation === undefined ? "-" : `$${averageDonation}`}
        </p>
        <p className="text-xs font-bold text-gray-400">&nbsp;</p>
      </div>

      {/* Recurring subscriptions section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-lime-600">Recurring</p>
          <div className="relative">
            <span className="text-gray-400 text-xs cursor-help border rounded-full px-1" title="This is the amount recieved every month.">?</span>
          </div>
        </div>
        <p className="text-3xl font-bold">
          {totalSubscriptions === undefined ? "-" : `$${totalSubscriptions}`}
        </p>
        <p className="text-xs font-bold text-gray-400">
          {numOfSubscriptions === undefined
            ? "-"
            : `${numOfSubscriptions} recurring monthly`}
        </p>
      </div>
    </div>
  );
}
