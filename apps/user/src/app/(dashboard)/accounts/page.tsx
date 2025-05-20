"use client";
import { useEffect, useState } from "react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/bank-account")
      .then((res) => res.json())
      .then(setAccounts);
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
      setAccounts(await (await fetch("/api/bank-account")).json());
      setProvider("");
      setAccountNumber("");
      setIfsc("");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Bank Accounts</h1>
      <form onSubmit={addAccount} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Bank Name"
          value={provider}
          onChange={e => setProvider(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Account Number"
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="IFSC Code"
          value={ifsc}
          onChange={e => setIfsc(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Account"}
        </button>
      </form>
      <ul>
        {accounts.map(acc => (
          <li key={acc.id} className="border-b py-2">
            <b>{acc.provider}</b> — {acc.accountNumber} ({acc.ifsc})
          </li>
        ))}
      </ul>
    </div>
  );
}
