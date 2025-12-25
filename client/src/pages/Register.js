import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      // Calls your router.post('/register') in backend
      const { data } = await axios.post("/api/v1/users/register", values);
      setLoading(false);
      if (data.success) {
        message.success("Registration Successful!");
        navigate("/login");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      message.error("Registration failed. Check if server is running!");
    }
  };

  return (
    <div className="register-page d-flex flex-column justify-content-center align-items-center vh-100">
      {loading && <Spin size="large" />}
      <div className="text-center mb-4 d-flex align-items-center gap-3">
        <img src="/apple-touch-icon.png" alt="Artha Logo" style={{ height: "60px" }} />
        <div>
          <h2 className="artha-title m-0">ARTHA</h2>
          <h4 className="artha-subtitle m-0">Financial Management</h4>
        </div>
      </div>
      <div className="p-4 shadow-sm rounded border bg-white" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <div className="text-center">
            <Link to="/login" className="d-block mb-2">Already registered? Login</Link>
            <Button type="primary" htmlType="submit" className="w-100 mt-2">Register</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
