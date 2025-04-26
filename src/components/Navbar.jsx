import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {

  const initialUserType = localStorage.getItem('user_type');
  const [user_type, setUserType] = useState(initialUserType || '') ;
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); // if you're storing user info too
    localStorage.removeItem("user_type"); // if you're storing user info too
    localStorage.clear()
    window.location.href = "/login"; // redirect to login page
  };

 // Update state on mount (in case localStorage was set before Navbar mounted)
  useEffect(() => {

    const storedUserType = localStorage.getItem('user_type');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []); // Run only once on mount


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Online Exam</Link>
        <div>
          {user_type ==='' && <Link className="btn btn-outline-light mx-2" to="/">Login</Link>}
          {user_type === 'admin' && <Link className="btn btn-outline-light mx-2" to="/admin">Admin</Link>}
          {/* {user_type === 'student' && <Link className="btn btn-outline-light mx-2" to="/exam">Exam</Link>} */}
        </div>
        <div className="ml-auto">
        { (user_type !=='' && user_type !==null) && <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>}
    </div>
      </div>
    </nav>
  );
}

export default Navbar;
