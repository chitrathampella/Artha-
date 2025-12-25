import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/users/login", values);
      setLoading(false);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify({ ...data.user, password: "" }));
        message.success("Login Successful!");
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong with the server.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register-page d-flex flex-column justify-content-center align-items-center vh-100">
      {loading && <Spin size="large" />}
      <div className="text-center mb-4 d-flex align-items-center gap-3">
        <img src="/apple-touch-icon.png" alt="Artha Logo" style={{ height: "60px" }} />
        <h2 className="artha-title m-0">ARTHA</h2>
      </div>
      <div className="p-4 shadow-sm rounded border bg-white" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <div className="text-center">
            <Link to="/register" className="d-block mb-2">Not a user? Register</Link>
            <Button type="primary" htmlType="submit" className="w-100 mt-2">Login</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
