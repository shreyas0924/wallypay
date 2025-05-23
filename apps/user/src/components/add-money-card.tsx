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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Toaster } from "@repo/ui/components/ui/toaster";

export const AddMoney = () => {
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
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
        console.log("Fetched bankAccounts:", data);
      } catch (error) {
        console.error("Failed to fetch bank accounts", error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    console.log("Updated bankAccounts:", bankAccounts);
  }, [bankAccounts]);

  const handleAddMoney = async () => {
    if (value <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (!selectedAccountId) {
      toast({ title: "Please select a bank account", variant: "destructive" });
      return;
    }
    if (!provider) {
      toast({ title: "Please select a provider", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await createOnRampTransaction(provider, value, selectedAccountId);
      toast({ title: "Money added successfully" });
      router.refresh();
      setValue(0);
      setSelectedAccountId(null);
      setProvider("");
    } catch (error) {
      toast({ title: "Failed to add money", variant: "destructive" });
    } finally {
      setLoading(false);
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
          onChange={(val) => setValue(Number(val))}
          value={value === 0 ? "" : String(value)}
        />
      </CardContent>
      <CardContent>
        <div className="text-left">Bank Account</div>
        <Select
          defaultValue=""
          onValueChange={(value: string) => {
            console.log("onValueChange:", value);
            const account = bankAccounts.find((x) => x.id.toString() === value);
            console.log("Found account:", account);
            setSelectedAccountId(value);
            setProvider(account?.provider || "");
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Bank Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {bankAccounts.map((x) => (
                <SelectItem key={x.id} value={x.id.toString()}>
                  {x.provider} - {x.accountNumber.slice(-4)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
