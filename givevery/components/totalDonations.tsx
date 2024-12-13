"use client";
import { useEffect, useState } from "react";

type Props = {
  connectedAccountId: string | undefined;
};

export default function TotalDonations({ connectedAccountId }: Props) {
  const [donations, setDonations] = useState<any[]>([]);
  const [numOfDonations, setNumOfDonations] = useState<number>();
  const [totalDonations, setTotalDonations] = useState<number>();
  const [averageDonation, setAverageDonation] = useState<number>();
  const [subscriptions, setSubscriptions] = useState();
  const [numOfSubscriptions, setNumOfSubscriptions] = useState<number>();
  const [totalSubscriptions, setTotalSubscriptions] = useState<number>();
  const [averageSubscription, setAverageSubscription] = useState<number>();

  useEffect(() => {
    let isMounted = true;
    const fetchDonations = async (account: string) => {
      console.log("Fetching donations for: ", connectedAccountId);
      const response = await fetch("/api/list-payment-intents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectedAccountId: account,
        }),
        next: {
          revalidate: 3600,
        },
      });
      const data = await response.json();
      console.log("data", data)
      if (!isMounted) return;

      if (Array.isArray(data)) {
        const total = data.reduce(
          (sum: number, donation: { amount: number }) => sum + donation.amount,
          0
        );
        // Batch state updates
        const updates = {
          donations: data,
          numOfDonations: data.length,
          totalDonations: total,
          averageDonation: Number((total / data.length || 0).toFixed(2)),
        };
        setDonations(updates.donations);
        setNumOfDonations(updates.numOfDonations);
        setTotalDonations(updates.totalDonations);
        setAverageDonation(updates.averageDonation);
      } else {
        console.error("Data is not an array:", data);
        setDonations([]);
        setNumOfDonations(0);
        setTotalDonations(0);
        setAverageDonation(0);
      }
    };

    if (connectedAccountId !== undefined) {
      fetchDonations(connectedAccountId);
    }
    return () => {
      isMounted = false;
    };
  }, [connectedAccountId]);
  useEffect(() => {
    let isMounted = true;
    const fetchSubscriptions = async (account: string) => {
      const response = await fetch("/api/list-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectedAccountId: account,
        }),
        next: {
          revalidate: 3600,
        },
      });
      const data = await response.json();
      const total = data.reduce(
        (sum: number, donation: { amount: number }) => sum + donation.amount,
        0
      );
      const updates = {
        subscriptions: data,
        numOfSubscriptions: data.length,
        totalSubscriptions: total,
        averageSubscription: Number((total / data.length || 0).toFixed(2)),
      };

      setSubscriptions(updates.subscriptions);
      setNumOfSubscriptions(updates.numOfSubscriptions);
      setTotalSubscriptions(updates.totalSubscriptions);
      setAverageSubscription(updates.averageSubscription);
      console.log("subs", data);
    };
    if (connectedAccountId !== undefined) {
      fetchSubscriptions(connectedAccountId);
    }
    return () => {
      isMounted = false;
    };
  }, [connectedAccountId]);
  console.log("MOUNTED");
  if (!totalDonations || !totalSubscriptions) {
    return <div className="text-xl animate-bounce text-center font-bold"><p>Loading...</p></div>
  }
  return (
    <div className="flex gap-10">
      <div className="flex flex-col">
        <p className="text-sm font-bold text-lime-600">One-time</p>
        <p className="text-3xl font-bold">
          {totalDonations === undefined ? "-" : `$${totalDonations}`}
        </p>
        <p className="text-xs font-bold text-gray-400">
          {numOfDonations === undefined ? "-" : `${numOfDonations} single donations`}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-bold text-lime-600">Average Donation</p>
        <p className="text-3xl font-bold">
          {averageDonation === undefined ? "-" : `$${averageDonation}`}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-bold text-lime-600">Recurring</p>
        <p className="text-3xl font-bold">
          {totalSubscriptions === undefined ? "-" : `$${totalSubscriptions}`}
        </p>
        <p className="text-xs font-bold text-gray-400">
          {numOfSubscriptions === undefined ? "-" : `${numOfSubscriptions} recurring monthly`}
        </p>
      </div>
    </div>
  );
}
