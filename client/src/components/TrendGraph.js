import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import dayjs from "dayjs";

const TrendGraph = ({ data }) => {
  // Transform transactions into daily totals
  const groupedData = data.reduce((acc, txn) => {
    const date = dayjs(txn.date).format("YYYY-MM-DD"); // Ensure consistent date format
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }
    if (txn.type.toLowerCase() === "income") {
      acc[date].income += parseFloat(txn.amount || 0);
    } else if (txn.type.toLowerCase() === "expense") {
      acc[date].expense += parseFloat(txn.amount || 0);
    }
    return acc;
  }, {});

  // Convert object to array and sort by date
  const chartData = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ width: "100%", height: 300, background: "#fff", padding: 20, borderRadius: 8 }}>
      <h3 style={{ textAlign: "center", marginBottom: 10 }}>Income vs Expense Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" tickFormatter={(date) => dayjs(date).format("MM-DD")} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="green" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="red" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendGraph;
