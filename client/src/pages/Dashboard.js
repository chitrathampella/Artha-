import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`);
        setTransactions(res.data); // Assuming the backend returns an array
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
    fetchTransactions();
  }, []);

  const chartData = transactions.map((t, index) => ({
    name: `Txn ${index + 1}`,
    amount: t.amount
  }));

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Expense Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
