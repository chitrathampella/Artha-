import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";


const Login = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      navigate("/home"); // Ensure user has _id before redirecting
    }
  }, [navigate]);

  // Handle login form submission
  const submitHandler = (values) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((user) => user.email === values.email);

    if (!foundUser) {
      message.error("❌ User not found. Please register.");
      return;
    }

    if (foundUser.password !== values.password) {
      message.error("❌ Wrong password!");
      return;
    }

    console.log("Found user before storing: ", foundUser);

    // ✅ Store user info including `_id`
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: foundUser._id || "guest", // Ensure _id is stored
        email: foundUser.email,
        name: foundUser.name,
      })
    );

    message.success("✅ Login successful!");
    navigate("/home");
  };

  return (
    <div className="register-page d-flex flex-column justify-content-center align-items-center vh-100">
  <div className="text-center mb-4 d-flex align-items-center gap-3">
    <img src="/apple-touch-icon.png" alt="Artha Logo" style={{ height: "60px" }} />
    <div>
      <h2 className="artha-title m-0">ARTHA</h2>
      <h4 className="artha-subtitle m-0">Financial Management</h4>
    </div>
  </div>


      <div className="p-4 shadow-sm rounded border bg-white" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login Page</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
  <Input.Password
    placeholder="Enter your password"
    iconRender={(visible) =>
      visible ? <EyeInvisibleOutlined style={{ cursor: "pointer" }} /> : <EyeOutlined style={{ cursor: "pointer" }} />
    }
  />
</Form.Item>
          <Form.Item>
            <div className="text-center">
              <Link to="/register" className="d-block mb-2">
                Not a user? Register
              </Link>
              <Button type="primary" htmlType="submit" className="w-100 mt-2">
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
