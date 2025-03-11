"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input } from "@/components/ui";
import ExpensesChart from "@/components/ExpensesChart";

const TransactionForm = () => {
  const [form, setForm] = useState({ amount: "", date: "", description: "" });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions");
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description) {
      alert("All fields are required!");
      return;
    }

    try {
      const formattedData = {
        id: editingId, // Send ID for updates
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
        description: form.description.trim(),
      };

      let res;
      if (editingId) {
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === editingId ? { ...tx, ...formattedData } : tx))
        );
        res = await axios.put("/api/transactions", formattedData);
        setEditingId(null);
      } else {
        res = await axios.post("/api/transactions", formattedData);
        setTransactions((prev) => [{ _id: res.data._id, ...formattedData }, ...prev]);
      }

      setForm({ amount: "", date: "", description: "" });
      setError("");
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
      setError("Failed to save transaction");
    }
  };

  const handleEdit = (tx) => {
    setForm({
      amount: tx.amount.toString(),
      date: tx.date.split("T")[0], // Extract YYYY-MM-DD
      description: tx.description,
    });
    setEditingId(tx._id);
  };

  const handleDelete = async (id) => {
    setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    try {
      await axios.delete("/api/transactions", { data: { id } });
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      setError("Failed to delete transaction");
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6 items-start">
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
