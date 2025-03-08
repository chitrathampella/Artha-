import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import "antd/dist/reset.css";  

function App() {
  return (
    <Routes>
<Route path="/home" element={
  <ProtectedRoutes>
    <div>
      <Header />
      <HomePage />
    </div>
  </ProtectedRoutes>
} />
<Route path="/" element={
  <ProtectedRoutes>
    <div>
      <Header />
      <HomePage />
    </div>
  </ProtectedRoutes>
} />


      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export function ProtectedRoutes({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
}

export default App;
