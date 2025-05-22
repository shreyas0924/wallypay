"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { TextInput } from "@repo/ui/components/ui/TextInput";
import { createOnRampTransaction } from "../lib/actions/createOnRampTxn";
import { toast } from "@repo/ui/components/ui/use-toast";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectShad,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select-shad";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { Input } from "@repo/ui/components/ui/input";

export const AddMoney = () => {
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [provider, setProvider] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch("/api/bank-account");
        const data = await res.json();
        setBankAccounts(data);
        if (data && data.length > 0) {
          setSelectedAccountId(data[0].id.toString());
          setProvider(data[0].provider);
        }
      } catch (error) {
        console.error("Failed to fetch bank accounts", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddMoney = async () => {
    if (value <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (!selectedAccountId) {
      toast({ title: "Please select a bank account", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Call API to add money; wait until DB update completes.
      await createOnRampTransaction(provider, value, selectedAccountId);
      toast({ title: "Money added successfully" });
      // Force a revalidation of your transactions by refreshing the route.
      router.refresh();
      // Clear input value after money is added.
      setValue(0);
    } catch (error) {
      toast({ title: "Failed to add money", variant: "destructive" });
    } finally {
      setLoading(false);
      // Clear input value in finally block too
      setValue(0);
    }
  };

  return (
    <Card title="Add Money">
      <CardHeader>
        <CardTitle>Add Money to Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          type="number"
          onChange={(val) => {
            setValue(Number(val));
          }}
          value={value === 0 ? "" : String(value)}
        />
      </CardContent>
      <CardContent>
        <div className="text-left">Bank Account</div>
        <SelectShad>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Bank Account" />
          </SelectTrigger>
          <SelectContent
            onSelect={(value: any) => {
              const account = bankAccounts.find(
                (x) => x.id.toString() === value
              );
              setSelectedAccountId(value);
              setProvider(account?.provider || "");
            }}
          >
            <SelectGroup>
              {bankAccounts.map((x) => (
                <SelectItem key={x.id} value={x.id.toString()}>
                  {x.provider} - {x.accountNumber.slice(-4)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectShad>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddMoney} disabled={loading}>
          {loading ? "Adding Money..." : "Add Money"}
        </Button>
      </CardFooter>
      <Toaster />
    </Card>
  );
};