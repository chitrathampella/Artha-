import React, { useEffect, useState, useCallback } from "react";
import { Modal, Select, Form, Input, message, DatePicker, Table, Button, Spin } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import Analytics from "../components/Analytics";
import dayjs from "dayjs";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [form] = Form.useForm();
  const [frequency, setFrequency] = useState("30");
  const [type, setType] = useState("all");
  const [editable, setEditable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState("table");

  // ✅ Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      setLoading(true);
      const { data } = await axios.post("http://localhost:5001/api/transactions/get-transactions", {
        userId: user._id,
        frequency,
        type,
      });

      // ✅ Sort transactions by date (newest first)
      const sortedTransactions = data
        .filter((txn) => txn.date) // Remove invalid dates
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(sortedTransactions);
      localStorage.setItem("transactions", JSON.stringify(sortedTransactions));
    } catch (error) {
      message.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [frequency, type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ✅ Process Data for Trend Graph
  const processTrendData = (transactions) => {
    const groupedData = {};

    transactions.forEach((txn) => {
      const date = moment(txn.date).format("YYYY-MM-DD");
      if (!groupedData[date]) {
        groupedData[date] = { date, income: 0, expense: 0 };
      }
      groupedData[date][txn.type] += txn.amount;
    });

    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };


  // ✅ Handle Edit Transaction
  const handleEdit = (record) => {
    setEditable(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setShowModal(true);
  };

  // ✅ Handle Delete Transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.post("http://localhost:5001/api/transactions/delete-transaction", { transactionId });
      message.success("Transaction Deleted Successfully");
      fetchTransactions();
    } catch (error) {
      message.error("Error deleting transaction.");
    }
  };

  // ✅ Handle Submit (Add/Edit Transaction)
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        message.error("User ID is missing! Please log in again.");
        return;
      }

      setLoading(true);
      const transactionData = {
        ...values,
        userId: user._id,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editable) {
        await axios.post("http://localhost:5001/api/transactions/edit", {
          ...transactionData,
          transactionId: editable._id,
        });
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("http://localhost:5001/api/transactions/add", transactionData);
        message.success("Transaction Added Successfully");
      }

      setShowModal(false);
      setEditable(null);
      form.resetFields();
      fetchTransactions();
    } catch (error) {
      message.error("Failed to process transaction.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Restrict Future Dates in DatePicker
  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  // ✅ Table Columns
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <b style={{ color: text === "income" ? "green" : "red" }}>{text?.toUpperCase() || "N/A"}</b>,
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Date", dataIndex: "date", key: "date", render: (text) => moment(text).format("YYYY-MM-DD") },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <EditOutlined style={{ color: "blue", marginRight: 10, cursor: "pointer" }} onClick={() => handleEdit(record)} />
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => handleDeleteTransaction(record._id)} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto", background: "#f9f9f9", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: "600", color: "#333" }}>Financial Overview</h2>

      {/* Filters & View Switcher */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <Select value={frequency} onChange={setFrequency} style={{ width: 180 }}>
          <Select.Option value="7">Last 1 week</Select.Option>
          <Select.Option value="30">Last 1 month</Select.Option>
          <Select.Option value="365">Last 1 year</Select.Option>
        </Select>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <UnorderedListOutlined style={{ fontSize: "20px", cursor: "pointer", color: viewData === "table" ? "#1890ff" : "#bbb" }} onClick={() => setViewData("table")} />
          <AreaChartOutlined style={{ fontSize: "20px", cursor: "pointer", color: viewData === "analytics" ? "#1890ff" : "#bbb" }} onClick={() => setViewData("analytics")} />
        </div>

        <Select value={type} onChange={setType} style={{ width: 180 }}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
      </div>

      {loading ? <Spin size="large" /> : viewData === "analytics" ? <Analytics allTransactions={transactions} /> : <Table dataSource={transactions} columns={columns} rowKey="_id" bordered size="middle" pagination={{ pageSize: 5 }} />}
      <div className="button-container">
      <Button type="primary" shape="round" size="large" onClick={() => setShowModal(true)}>Add New</Button>
      </div>
      <Modal title={editable ? "Edit Transaction" : "Add Transaction"} open={showModal} onCancel={() => { setShowModal(false); setEditable(null); form.resetFields(); }} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} disabledDate={disabledDate} /></Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: "Please select type!" }]}>
  <Select onChange={(value) => setType(value)}>  {/* ✅ Update type state */}
    <Select.Option value="income">Income</Select.Option>
    <Select.Option value="expense">Expense</Select.Option>
  </Select>
</Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select category!" }]}>
  <Select>
    {type === "income"
      ? ["Salary", "Freelance", "Investments", "Business"].map((cat) => (
          <Select.Option key={cat} value={cat.toLowerCase()}>{cat}</Select.Option>
        ))
      : ["Bills", "Food", "Shopping", "Entertainment", "Travel", "Taxes"].map((cat) => (
          <Select.Option key={cat} value={cat.toLowerCase()}>{cat}</Select.Option>
        ))}
  </Select>
</Form.Item>
<Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <div className="button-container">
  <button className="primary">Submit</button>
</div>

        </Form>
      </Modal>
    </div>
  );
};

export default HomePage;
