import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Header Mounted");
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoginUser(parsedUser);
        console.log("User Found:", parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoginUser(null);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src="/apple-touch-icon.png" alt="Artha Logo" style={{ height: '40px', marginRight: '10px' }} />

  <h3 className="mb-0 fw-bold">ARTHA</h3>
  <span className="fs-5 text-muted">Financial Management</span>
</Link>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {loginUser ? (
              <>
                <li className="nav-item">
                  <Link to="/user" className="nav-link active">
                    {loginUser.name}
                  </Link>
                </li> 
                <li className="nav-item">
                  <button className="nav-link active btn btn-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link active">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
