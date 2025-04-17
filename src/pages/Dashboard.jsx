// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const categories = ["science", "commerce", "engineering"];

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const handleStartExam = (category) => {
    navigate("/exam", { state: { category } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {email}</h1>
        <h2 className="text-lg mb-2">Choose a category to start your exam:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleStartExam(cat)}
              className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
