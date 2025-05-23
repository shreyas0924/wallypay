"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { formatCurrency } from "../../../lib/utils";
import { format } from "date-fns";
import { Badge } from "@repo/ui/components/ui/badge";

type TransactionType = "all" | "onRamp" | "incoming" | "outgoing";

export function TransactionsClient({ transactions }: any) {
  const [activeTab, setActiveTab] = useState<TransactionType>("all");

  // Combine and sort all transactions
  const allTransactions = [
    ...transactions.onRamp.map((t: any) => ({
      ...t,
      type: "onRamp",
      timestamp: t.startTime,
    })),
    ...transactions.incoming.map((t: any) => ({
      ...t,
      type: "incoming",
    })),
    ...transactions.outgoing.map((t: any) => ({
      ...t,
      type: "outgoing",
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredTransactions = activeTab === "all" 
    ? allTransactions
    : allTransactions.filter(t => t.type === activeTab);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(v) => setActiveTab(v as TransactionType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="onRamp">Added Money</TabsTrigger>
              <TabsTrigger value="incoming">Received</TabsTrigger>
              <TabsTrigger value="outgoing">Sent</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: any) => (
                    <TableRow key={`${transaction.type}-${transaction.id}`}>
                      <TableCell>
                        {format(new Date(transaction.timestamp), "PPp")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.type === "incoming" ? "secondary" :
                          transaction.type === "outgoing" ? "destructive" : "default"
                        }>
                          {transaction.type === "onRamp" ? "Added Money" :
                           transaction.type === "incoming" ? "Received" : "Sent"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.type === "onRamp" ? (
                          <span>Via {transaction.bankAccount?.provider || "Bank"}</span>
                        ) : transaction.type === "incoming" ? (
                          <span>From {transaction.fromUser?.name || transaction.fromUser?.number}</span>
                        ) : (
                          <span>To {transaction.toUser?.name || transaction.toUser?.number}</span>
                        )}
                      </TableCell>
                      <TableCell className={
                        transaction.type === "outgoing" ? "text-red-500" : "text-green-500"
                      }>
                        {transaction.type === "outgoing" ? "- " : "+ "}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === "Success" ? "secondary" :
                          transaction.status === "Failure" ? "destructive" : "default"
                        }>
                          {transaction.status || "Completed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}