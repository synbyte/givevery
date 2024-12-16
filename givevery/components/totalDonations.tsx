import { stripe } from "@/utils/utils";
import type { Stripe } from "stripe";

// Props type definition for the component
type Props = {
  connectedAccountId: string | undefined;
};

type DonationStats = {
  donations: Array<{amount: number}>;
  numOfDonations: number;
  totalDonations: number;
  averageDonation: number;
}

type SubscriptionStats = {
  subscriptions: Array<{amount: number}>;
  numOfSubscriptions: number;
  totalSubscriptions: number;
  averageSubscription: number;
}

async function fetchDonations(account: string): Promise<DonationStats> {
  let allDonations: Array<{amount: number}> = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  // Fetch donations in batches until no more are available
  while (hasMore) {
    const charges: Stripe.Response<Stripe.ApiList<Stripe.Charge>> = await stripe.charges.list(
      {
        limit: 100,
        starting_after: startingAfter,
        // status is valid per Stripe API docs even if TypeScript doesn't recognize it
        // @ts-ignore
        status: 'succeeded' as any,
      },
      {
        stripeAccount: account,
      }
    );

    const donations = charges.data.map((charge: Stripe.Charge) => ({
      amount: charge.amount / 100,
    }));

    allDonations = [...allDonations, ...donations];
    hasMore = charges.has_more;
    if (hasMore && charges.data.length > 0) {
      startingAfter = charges.data[charges.data.length - 1].id;
    }
  }

  const total = allDonations.reduce(
    (sum: number, donation: { amount: number }) => sum + donation.amount,
    0
  );

  return {
    donations: allDonations,
    numOfDonations: allDonations.length,
    totalDonations: total,
    averageDonation: Number((total / allDonations.length || 0).toFixed(2))
  };
}

async function fetchSubscriptions(account: string): Promise<SubscriptionStats> {
  let allSubscriptions: Array<{amount: number}> = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  // Fetch subscriptions in batches until no more are available
  while (hasMore) {
    const subscriptions: Stripe.Response<Stripe.ApiList<Stripe.Subscription>> = await stripe.subscriptions.list(
      {
        limit: 100,
        starting_after: startingAfter,
        status: 'active',
      },
      {
        stripeAccount: account,
      }
    );

    const subscriptionData = subscriptions.data.map((sub: Stripe.Subscription) => ({
      amount: sub.items.data[0].price.unit_amount ? sub.items.data[0].price.unit_amount / 100 : 0,
    }));

    allSubscriptions = [...allSubscriptions, ...subscriptionData];
    hasMore = subscriptions.has_more;
    if (hasMore && subscriptions.data.length > 0) {
      startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
    }
  }

  const total = allSubscriptions.reduce(
    (sum: number, subscription: { amount: number }) => sum + subscription.amount,
    0
  );

  return {
    subscriptions: allSubscriptions,
    numOfSubscriptions: allSubscriptions.length,
    totalSubscriptions: total,
    averageSubscription: Number((total / allSubscriptions.length || 0).toFixed(2))
  };
}

export default async function TotalDonations({ connectedAccountId }: Props) {
  if (!connectedAccountId) {
    return (
      <div className="text-xl text-center font-bold">
        <p>No connected account found</p>
      </div>
    );
  }

  const donationStats = await fetchDonations(connectedAccountId);
  const subscriptionStats = await fetchSubscriptions(connectedAccountId);

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
          ${donationStats.totalDonations}
        </p>
        <p className="text-xs font-bold text-gray-400">
          {donationStats.numOfDonations} single donations
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
          ${donationStats.averageDonation}
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
          ${subscriptionStats.totalSubscriptions}
        </p>
        <p className="text-xs font-bold text-gray-400">
          {subscriptionStats.numOfSubscriptions} recurring monthly
        </p>
      </div>
    </div>
  );
}
