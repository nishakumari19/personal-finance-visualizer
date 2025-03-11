"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await axios.get("/api/transactions");
    setTransactions(data);
  };

  return (
    <div className="p-4 ">
      <h2 className="text-xl font-bold mb-3">Transactions</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx._id} className="border p-2 mb-2">
            {tx.date.slice(0, 10)} - {tx.description} - ₹{tx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
