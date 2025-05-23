"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { calculateDateRange, formatCurrency } from "../../../lib/utils";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function DashboardClient({ data }: { data: any }) {
  // Calculate total net worth
  const netWorth = (data.balance?.amount || 0) + (data.balance?.locked || 0);

  // Calculate metrics
  const totalSent = data.p2pTransfers
    .filter((t: any) => t.fromUserId === data.balance.userId)
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const totalReceived = data.p2pTransfers
    .filter((t: any) => t.toUserId === data.balance.userId)
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const onRampTotal = data.onRampTxns
    .filter((t: any) => t.status === "Success")
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const pieChartData = {
    labels: ["Sent", "Received", "Added"],
    datasets: [
      {
        data: [totalSent / 100, totalReceived / 100, onRampTotal / 100],
        backgroundColor: [
          "rgb(239, 68, 68)", // Red for sent
          "rgb(34, 197, 94)", // Green for received
          "rgb(59, 130, 246)", // Blue for added
        ],
      },
    ],
  };

  // Prepare monthly trends data
  const monthlyData = data.p2pTransfers.reduce((acc: any, transfer: any) => {
    const month = new Date(transfer.timestamp).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) {
      acc[month] = { sent: 0, received: 0 };
    }
    if (transfer.fromUserId === data.balance.userId) {
      acc[month].sent += transfer.amount / 100;
    } else {
      acc[month].received += transfer.amount / 100;
    }
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Sent",
        data: Object.values(monthlyData).map((m: any) => m.sent),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
      {
        label: "Received",
        data: Object.values(monthlyData).map((m: any) => m.received),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };
  return (
    <div className="w-full p-8 space-y-8">
      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Net Worth"
          value={formatCurrency(netWorth)}
          description="Total balance + locked amount"
        />
        <MetricCard
          title="Total Sent"
          value={formatCurrency(totalSent)}
          description="P2P transfers sent"
        />
        <MetricCard
          title="Total Received"
          value={formatCurrency(totalReceived)}
          description="P2P transfers received"
        />
        <MetricCard
          title="OnRamp Total"
          value={formatCurrency(onRampTotal)}
          description="Successfully added funds"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Distribution</CardTitle>
            <CardDescription>Overview of money flow</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-center w-full h-80">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Transaction volume by month</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-center w-full h-80 px-6">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
