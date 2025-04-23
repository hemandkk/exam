import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const userType = localStorage.getItem('user_type');
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); // if you're storing user info too
    localStorage.removeItem("user_type"); // if you're storing user info too
    localStorage.clear()
    window.location.href = "/login"; // redirect to login page
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Online Exam</Link>
        <div>
          {userType ==='' && <Link className="btn btn-outline-light mx-2" to="/">Login</Link>}
          {userType === 'admin' && <Link className="btn btn-outline-light mx-2" to="/admin">Admin</Link>}
          {/* {userType === 'student' && <Link className="btn btn-outline-light mx-2" to="/exam">Exam</Link>} */}
        </div>
        <div className="ml-auto">
        { (userType !=='' && userType !==null) && <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>}
    </div>
      </div>
    </nav>
  );
}

export default Navbar;
