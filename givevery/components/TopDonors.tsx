export const revalidate = 3600; // Revalidate every hour (3600 seconds)

import { stripe } from '@/utils/utils';
import type { Stripe } from 'stripe';

interface Donor {
    customer: string;
    name: string;
    email: string;
    totalDonated: number;
}

interface TopDonorsProps {
    connectedAccountId: string;
}

async function TopDonors({ connectedAccountId }: TopDonorsProps) {
    const donorsMap: Record<string, {name: string, totalDonated: number, email: string}> = {};
    let hasMore = true;
    let startingAfter = undefined;

    // Paginate through all payment intents
    while (hasMore) {
        const paymentIntents: Stripe.Response<Stripe.ApiList<Stripe.PaymentIntent>> = await stripe.paymentIntents.list({
            limit: 100,
            starting_after: startingAfter,
        }, {
            stripeAccount: connectedAccountId,
        });

        // Process the payment data to find top donors
        for (const intent of paymentIntents.data) {
            const { amount, customer } = intent;
            if (customer !== null && typeof customer === 'string') {
                if (!donorsMap[customer]) {
                    // Fetch customer details
                    const customerDetails = await stripe.customers.retrieve(customer, {
                        stripeAccount: connectedAccountId,
                    });
                    donorsMap[customer] = {
                        name: customerDetails.deleted ? 'Anonymous' : customerDetails.name || 'Anonymous',
                        totalDonated: 0,
                        email: customerDetails.deleted ? 'No email' : customerDetails.email || 'No email',
                    };
                }
                donorsMap[customer].totalDonated += amount / 100; // Convert from cents to dollars
            }
        }

        hasMore = paymentIntents.has_more;
        if (hasMore && paymentIntents.data.length > 0) {
            startingAfter = paymentIntents.data[paymentIntents.data.length - 1].id;
        }
    }

    // Convert the map to an array and sort by totalDonated
    const donors = Object.entries(donorsMap)
        .map(([customer, data]) => ({ customer, ...data }))
        .sort((a, b) => b.totalDonated - a.totalDonated)
        .slice(0, 5); // Get top 5 donors

    return (
        <div className='w-1/3'>
            <p className='text-2xl pb-3'>Top Supporters</p>
            <ul className='flex flex-col gap-2'>
                {donors.map((donor) => (
                    <li key={donor.customer}>
                        <div className="flex justify-between">
                            <div className="flex-col">
                                <p className="font-bold">{donor.name}</p>   
                                <p className='text-sm'>{donor.email}</p>
                            </div>
                            <div className="flex-col">
                                <p>${donor.totalDonated.toFixed(2)}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopDonors;