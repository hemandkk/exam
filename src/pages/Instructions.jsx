import React from 'react';
import { useNavigate } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();

  const handleContinue = () => {
    goFullscreen()
    navigate('/exam');
  };
  const goFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };
  return (
    <div className="container mt-5">
      <h2>Exam Instructions</h2>
      <ul>
        <li>Each question has four options. Choose the correct one.</li>
        <li>You cannot go back once you answer a question.</li>
        <li>The exam is timed. Make sure to keep track.</li>
        <li>Do not refresh the page during the exam.</li>
      </ul>
      <button className="btn btn-success mt-3" onClick={handleContinue}>
        Start Exam
      </button>
    </div>
  );
}

export default Instructions;
