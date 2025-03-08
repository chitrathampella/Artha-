import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
//import { v4 as uuidv4 } from "uuid";  // Import UUID to generate unique user IDs
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";


const Register = () => {
  const navigate = useNavigate();

  // Redirect logged-in users to home
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) navigate("/home");
  }, [navigate]);

  // Handle registration form submission
  const submitHandler = (values) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if the email is already registered
      const userExists = users.some((user) => user.email === values.email);
      if (userExists) {
        message.error("❌ User already exists! Try logging in.");
        return;
      }

      // Assign a unique ID (_id) to the new user
      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        _id: new Date().getTime().toString(),  // Assign a fake `_id` if missing
    };

    console.log("Newly Registered User:", newUser);

    
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      message.success("✅ Registration successful! Please login.");
      navigate("/login");
    }, 1000);
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
        <h2 className="text-center mb-4">Register Page</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
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
              <Link to="/login" className="d-block mb-2">
                Already registered? Login
              </Link>
              <Button type="primary" htmlType="submit" className="w-100 mt-2">
                Register
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
