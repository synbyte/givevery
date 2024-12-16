import { stripe } from '@/utils/utils';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { connectedAccountId } = await req.json();

        if (!connectedAccountId) {
            return NextResponse.json(
                { error: "Connected account ID is required" },
                { status: 400 }
            );
        }

        const donorsMap = {};
        let hasMore = true;
        let startingAfter = undefined;

        // Paginate through all payment intents with expanded customer data
        while (hasMore) {
            const paymentIntents = await stripe.paymentIntents.list(
                {
                    limit: 100,
                    starting_after: startingAfter,
                    expand: ['data.customer'],
                },
                {
                    stripeAccount: connectedAccountId,
                }
            );

            // Process the payment data to find top donors
            for (const intent of paymentIntents.data) {
                const { amount, customer } = intent;
                if (customer) {
                    const customerId = customer.id;
                    if (!donorsMap[customerId]) {
                        donorsMap[customerId] = {
                            name: customer.name || 'Anonymous',
                            totalDonated: 0,
                            email: customer.email || 'No email',
                        };
                    }
                    donorsMap[customerId].totalDonated += amount / 100; // Convert from cents to dollars
                }
            }

            hasMore = paymentIntents.has_more;
            if (hasMore && paymentIntents.data.length > 0) {
                startingAfter = paymentIntents.data[paymentIntents.data.length - 1].id;
            }
        }

        // Convert the map to an array and sort by totalDonated
        const topDonors = Object.entries(donorsMap)
            .map(([customer, data]) => ({ customer, ...data }))
            .sort((a, b) => b.totalDonated - a.totalDonated)
            .slice(0, 5); // Get top 5 donors

        return NextResponse.json(topDonors);
    } catch (error) {
        console.error('Error fetching top donors:', error);
        return NextResponse.json(
            { error: 'Failed to fetch top donors' },
            { status: 500 }
        );
    }
}