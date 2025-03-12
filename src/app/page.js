"use client";
import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";


export default function Home() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Header */}
      <header className="bg-gray-900 text-white text-center p-4 text-2xl font-bold">
        Personal Finance Visualizer
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-6 p-4">
        <TransactionForm onTransactionAdded={fetchTransactions} />
      </main>
    </div>
  );
}
