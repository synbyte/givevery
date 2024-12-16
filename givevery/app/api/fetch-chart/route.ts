import { NextResponse } from "next/server";
import { stripe } from "@/utils/utils";

export async function POST(req: Request) {
  try {
    const { connectedAccountId } = await req.json();

    if (!connectedAccountId) {
      return NextResponse.json(
        { error: "Connected account ID is required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    // Initialize daily totals for each day in the past month
    const dailyTotals: { [key: string]: number } = {};
    for (let d = new Date(lastMonth); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyTotals[dateStr] = 0;
    }

    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const charges: any = await stripe.charges.list({
        limit: 100,
        starting_after: startingAfter,
        created: {
          gte: Math.floor(lastMonth.getTime() / 1000),
          lte: Math.floor(now.getTime() / 1000),
        },

      }, {
        stripeAccount: connectedAccountId,
      });

      // Aggregate donations by day
      charges.data.forEach((charge: any) => {
        const date = new Date(charge.created * 1000).toISOString().split('T')[0];
        if (dailyTotals[date] !== undefined) {
          dailyTotals[date] += charge.amount / 100; // Convert from cents to dollars
        }
      });

      hasMore = charges.has_more;
      if (hasMore) {
        startingAfter = charges.data[charges.data.length - 1].id;
      }
    }

    // Transform the dailyTotals object into an array of objects
    const chartData = Object.entries(dailyTotals).map(([day, donations]) => ({
      day,
      donations,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}