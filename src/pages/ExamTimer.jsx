import React, { useEffect, useState } from "react";

function ExamTimer({ totalTime, onSubmit }) {
  const [timeLeft, setTimeLeft] = useState(totalTime); // in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(); // auto-submit when timer hits 0
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timerStyle = {
    color: minutes < 5 ? "red" : "black",
    fontWeight: "bold",
    fontSize: "18px",
  };

  return (
    <div style={timerStyle}>
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}

export default ExamTimer;
