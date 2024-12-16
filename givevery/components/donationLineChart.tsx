"use client";

import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DonationLineChart({ connectedAccountId }: { connectedAccountId: string }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/fetch-chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ connectedAccountId }),
        });
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    }

    loadData();
  }, [connectedAccountId]);

  const chartConfig = {
    donations: {
      label: "Donations",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className='w-4/5'>
    <Card>
      <CardHeader>
        <CardTitle>Donations Over the Last Month</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 30,
              top: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)} // Display only month and day
            />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="donations"
              type="natural"
              stroke="var(--color-donations)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month 
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total donations for the last month
        </div>
      </CardFooter>
      </Card>
      </div>
  );
}