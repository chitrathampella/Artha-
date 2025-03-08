import { Progress, Card } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React from "react";
import TrendGraph from "./TrendGraph";

const Analytics = ({ allTransactions = [] }) => {
  const totalTransactions = allTransactions.length;
  
  const totalIncomeTransaction = allTransactions.filter((t) => String(t.type).toLowerCase() === "income");
  const totalExpenseTransaction = allTransactions.filter((t) => String(t.type).toLowerCase() === "expense");

  const totalIncome = totalIncomeTransaction.reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);
  const totalExpense = totalExpenseTransaction.reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);

  const totalIncomePercentage = totalTransactions > 0 ? ((totalIncomeTransaction.length / totalTransactions) * 100).toFixed(2) : 0;
  const totalExpensePercentage = totalTransactions > 0 ? ((totalExpenseTransaction.length / totalTransactions) * 100).toFixed(2) : 0;

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];
  const COLORS = ["#28a745", "#dc3545"];

  const incomeCategories = {};
  totalIncomeTransaction.forEach(txn => {
    incomeCategories[txn.category] = (incomeCategories[txn.category] || 0) + parseFloat(txn.amount || 0);
  });

  const expenseCategories = {};
  totalExpenseTransaction.forEach(txn => {
    expenseCategories[txn.category] = (expenseCategories[txn.category] || 0) + parseFloat(txn.amount || 0);
  });

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>

      {/* Trend Graph */}
      <TrendGraph data={allTransactions} />

      {/* Transactions Overview */}
      <Card className="transactions-card">
        <h4>Total Transactions: {totalTransactions}</h4>
        <p>Income: {totalIncomeTransaction.length} ({totalIncomePercentage}%)</p>
        <p>Expense: {totalExpenseTransaction.length} ({totalExpensePercentage}%)</p>

        <div className="progress-flex">
          <div className="progress-item">
            <Progress type="circle" strokeColor="green" percent={totalIncomePercentage} size={80} />
            <span>Income</span>
          </div>
          <div className="progress-item">
            <Progress type="circle" strokeColor="red" percent={totalExpensePercentage} size={80} />
            <span>Expense</span>
          </div>
        </div>
      </Card>

      {/* Income & Expense Category Breakdown */}
      <div className="category-breakdown">
        <Card className="category-card">
          <h4 style={{ color: "green" }}>Income Categories</h4>
          {Object.entries(incomeCategories).length > 0 ? (
            Object.entries(incomeCategories).map(([category, amount]) => (
              <div key={category} className="progress-item">
                <span>{category}</span>
                <Progress percent={Math.round((amount / totalIncome) * 100)} strokeColor="green" strokeWidth={12} />
              </div>
            ))
          ) : (
            <p style={{ color: "gray" }}>No income data</p>
          )}
        </Card>

        <Card className="category-card">
          <h4 style={{ color: "red" }}>Expense Categories</h4>
          {Object.entries(expenseCategories).length > 0 ? (
            Object.entries(expenseCategories).map(([category, amount]) => (
              <div key={category} className="progress-item">
                <span>{category}</span>
                <Progress percent={Math.round((amount / totalExpense) * 100)} strokeColor="red" strokeWidth={12} />
              </div>
            ))
          ) : (
            <p style={{ color: "gray" }}>No expense data</p>
          )}
        </Card>
      </div>

      {/* Income vs Expense Pie Chart */}
      <div style={{ marginBottom: "30px" }}>
        {totalIncome > 0 || totalExpense > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>No transactions yet! Add one.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
