"use client";
import { useState } from "react";
import axios from "axios";
import { Button, Input } from "@/components/ui";
import ExpensesChart from "@/components/ExpensesChart";

const TransactionForm = ({ transactions, setTransactions }) => {
  const [form, setForm] = useState({ amount: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const formattedData = {
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
        description: form.description.trim(),
      };
  
      let res;
      if (editingId) {
        res = await axios.put("/api/transactions", { ...formattedData, id: editingId });
        setEditingId(null);
        setTransactions((prev) => 
          prev.map((tx) => (tx._id === editingId ? { ...tx, ...formattedData } : tx))
        );
      } else {
        res = await axios.post("/api/transactions", formattedData);
        const newTransaction = { _id: res.data._id, ...formattedData };

        // ✅ Instantly update UI
        setTransactions((prev) => 
          [...prev, newTransaction].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      }
  
      setForm({ amount: "", date: "", description: "" });
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

  // ✅ Fix: Add handleDelete function
  const handleDelete = async (id) => {
    setTransactions((prev) => prev.filter((tx) => tx._id !== id));

    try {
      await axios.delete("/api/transactions", { data: { id } });
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  // ✅ Fix: Add handleEdit function
  const handleEdit = (tx) => {
    setForm({
      amount: tx.amount.toString(),
      date: tx.date.split("T")[0], 
      description: tx.description,
    });
    setEditingId(tx._id);
  };

  return (
    <div className="p-6 flex flex-col w-full lg:flex-row gap-6 items-start border-2 border-black rounded-lg">
      {/* Left Section: Form */}
      <div className="w-full sm:w-full lg:w-1/4 bg-white p-4 shadow-md rounded-lg">
        <h1 className="font-bold text-lg mb-3">Personal Finance Visualizer</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
          <Input type="date" name="date" value={form.date} onChange={handleChange} required />
          <Input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <Button type="submit">{editingId ? "Update Transaction" : "Add Transaction"}</Button>
        </form>
      </div>

      {/* Middle Section: Transactions List */}
      <div className="w-full sm:w-full lg:w-1/2 bg-white p-4 shadow-md rounded-lg">
        <h2 className="font-bold text-lg mb-3">Transactions</h2>
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx._id} className="flex flex-col sm:flex-row justify-between bg-gray-100 p-2 rounded">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                <span>
                  {new Date(tx.date).toLocaleDateString("en-US")} - {tx.description} - ₹{tx.amount}
                </span>
                <div className="flex flex-row items-center mt-2 sm:mt-0">
                  <Button onClick={() => handleEdit(tx)} className="ml-2 mr-2">Edit</Button>
                  <Button onClick={() => handleDelete(tx._id)} className="bg-red-500">Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section: Chart */}
      <div className="w-full sm:w-full lg:w-1/3 bg-white p-4 shadow-md rounded-lg">
        <ExpensesChart transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionForm;
