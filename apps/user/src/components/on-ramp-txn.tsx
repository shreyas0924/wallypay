import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
type StatusType = "Success" | "Failure" | "Processing";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: StatusType;
    provider: string;
  }[];
}) => {
  // Sort transactions by time by latest first
  transactions.sort((a, b) => {
    return a.time.getTime() - b.time.getTime();
  });
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <CardHeader>Recent Transactions</CardHeader>
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          {transactions
            .slice(-3)
            .reverse()
            .map((t) => (
              <Card className="py-3 my-2">
                <CardContent className="flex ">
                  <div className="text-lg">Credited</div>
                  <Badge
                    className="ml-4 justify-start"
                    variant={
                      t.status === "Success"
                        ? "default"
                        : t.status === "Failure"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {t.status}
                  </Badge>
                  <div className=" ml-auto ">+ ₹ {t.amount / 100}</div>
                </CardContent>
                <div className="ml-5 text-slate-600 text-md">
                  {t.time.toDateString()}
                </div>
              </Card>
            ))}
          <Link href="/transactions">
            <Button className="bg-transparent hover:bg-transparent border text-black dark:text-white w-full">
              All Transactions <MoveUpRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
