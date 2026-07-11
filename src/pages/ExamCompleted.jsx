import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ExamCompleted() {
  const navigate = useNavigate();

  useEffect(()=>{
      let timeOut = setTimeout(()=>{ handleLogout() }, 5000)
      return ()=>{
        clearTimeout(timeOut)
      }
    }
  ,[])
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    localStorage.clear()
    window.location.href = "/login";
    navigate('/login');
  };


  return (
    <div className="container mt-5">
      <h2> Congragulations !!! You have Completed the exam </h2>
      <ul>
        <li>You will be automatically logged out.</li>
        <li>Your result will be shortly published.</li>
        <li>Do not refresh the page.</li>
      </ul>
    </div>
  );
}

export default ExamCompleted;
