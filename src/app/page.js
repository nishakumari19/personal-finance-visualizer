"use client";
import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import ExpensesChart from "@/components/ExpensesChart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Utility for conditional classes

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to Transactions
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar open state

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar after selecting an option
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar for Large Screens */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Finance Tracker</h2>
        <nav className="space-y-2">
          <button
            className={cn(
              "text-lg w-full text-left px-4 py-2 rounded hover:bg-gray-700",
              activeTab === "dashboard" && "bg-gray-700"
            )}
            onClick={() => handleTabChange("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={cn(
              "text-lg w-full text-left px-4 py-2 rounded hover:bg-gray-700",
              activeTab === "transactions" && "bg-gray-700"
            )}
            onClick={() => handleTabChange("transactions")}
          >
            Transactions
          </button>
          <button
            className={cn(
              "text-lg w-full text-left px-4 py-2 rounded hover:bg-gray-700",
              activeTab === "expenses" && "bg-gray-700"
            )}
            onClick={() => handleTabChange("expenses")}
          >
            Monthly Expenses
          </button>
        </nav>
      </aside>

      {/* Sidebar for Small Screens */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden fixed top-4 left-4 z-50" onClick={() => setIsSidebarOpen(true)}>
            ☰ Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-900 text-white">
          <nav className="space-y-4 p-4">
            <button
              className="text-lg w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => handleTabChange("dashboard")}
            >
              Dashboard
            </button>
            <button
              className="text-lg w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => handleTabChange("transactions")}
            >
              Transactions
            </button>
            <button
              className="text-lg w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => handleTabChange("expenses")}
            >
              Monthly Expenses
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content (Now stacked on small screens) */}
      <main className="flex-1 flex flex-col sm:flex-col lg:flex-row items-center justify-center p-4">
        <div className="w-full sm:w-auto lg:border-1 rounded-lg flex flex-col sm:flex-col items-center justify-center lg:border-black p-4">
          {activeTab === "dashboard" && <TransactionForm onTransactionAdded={fetchTransactions} />}
          {activeTab === "transactions" && <TransactionList transactions={transactions} />}
          {activeTab === "expenses" && <ExpensesChart transactions={transactions} />}
        </div>
      </main>
    </div>
  );
}
