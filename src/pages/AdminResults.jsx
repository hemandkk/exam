import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const AdminResultsTable = () => {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin-results`);
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const currentResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="container">
      <h3>Student Results</h3>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Stream</th>
            <th>Status</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {currentResults.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No student resuls data found.</td>
            </tr>
          ) : (
            currentResults.map((student) => (
              <tr key={student.id}>
                <td>{student.email}</td>
                <td>{student.stream}</td>
                <td>
                  <span className={`badge ${student.status === "Completed" ? "bg-success" : "bg-secondary"}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  {student.status === "Completed" ? `${student.score}/${student.total}` : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          </li>

          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminResultsTable;
