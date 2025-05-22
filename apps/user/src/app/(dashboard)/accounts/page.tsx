"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Toaster } from "@repo/ui/components/ui/toaster";
import {useToast}  from "@repo/ui/components/ui/use-toast";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
const { toast } = useToast()
  // Fetch bank accounts from API
  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    const res = await fetch("/api/bank-account");
    const data = await res.json();
    setAccounts(data);
    setLoadingAccounts(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function addAccount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/bank-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, accountNumber, ifsc }),
    });
    if (res.ok) {
      await fetchAccounts();
      setProvider("");
      setAccountNumber("");
      setIfsc("");
      toast({ title: "Bank Account is added successfully" });
      setModalOpen(false);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between  items-center">
        <h2 className="text-3xl font-bold">Your Bank Accounts</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>Add Bank Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={addAccount} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <label htmlFor="provider" className="text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <Input
                  id="provider"
                  placeholder="Bank Name"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <Input
                  id="accountNumber"
                  placeholder="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="ifsc" className="text-sm font-medium text-gray-700">
                  IFSC Code
                </label>
                <Input
                  id="ifsc"
                  placeholder="IFSC Code"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Account"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingAccounts ? (
        <div className="flex justify-center items-center h-40">
          <span>Loading accounts...</span>
        </div>
      ) : (
        accounts.map((acc) => (
          <Card key={acc.id} className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl">{acc.provider}</CardTitle>
              <CardDescription className="text-lg">
                Account Number: {acc.accountNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl">IFSC Code: {acc.ifsc}</div>
            </CardContent>
          </Card>
        ))
      )}
      <Toaster />
    </div>
  );
}