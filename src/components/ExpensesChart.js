"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const ExpensesChart = ({ transactions }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (transactions.length === 0){
      setData([]);
      return;
    }
      

    const monthlyData = transactions.reduce((acc, tx) => {
      const month = tx.date.slice(0, 7); // Extract YYYY-MM
      acc[month] = (acc[month] || 0) + tx.amount;
      return acc;
    }, {});

    // Convert month format to abbreviated "MMM YYYY" (e.g., "Jan 2025") and sort
    const formattedData = Object.keys(monthlyData)
      .sort((a, b) => new Date(`${a}-01`) - new Date(`${b}-01`)) // Sort months chronologically
      .map((month) => {
        const date = new Date(`${month}-01`);
        return {
          month: date.toLocaleString("en-US", { month: "short", year: "numeric" }), // "Jan 2025"
          amount: monthlyData[month],
        };
      });

    setData(formattedData);
  }, [transactions]); // Recalculate when transactions change

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ bottom: 30 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            angle={-45} 
            textAnchor="end" 
            interval={0} 
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesChart;
