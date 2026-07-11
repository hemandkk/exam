import React, { useState } from "react";
import API from "../services/api";

const RegisteredStudentsTable = ({ students, deleteStudent, setStudents }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );
  const toggleExamStatus = async (id, status) => {
    try {
      await API.put(`/students/${id}/exam-status?status=${status}`);
      const tempConst = students.map((el) => { 
        
        if(el.id === id){
            el.exam_completed = status
        }
        return el
    })
      setStudents(tempConst)
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };
  
  return (
    <div>
      <h4 className="mb-3">Registered Students</h4>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>USER-ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Stream</th>
            <th>Exam Completed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No students found</td>
            </tr>
          ) : (
            currentStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.user_id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.stream}</td>
                <td>
                  {student.user_type === "admin" ? (<span> </span>):(<input
                    type="checkbox"
                    checked={student.exam_completed}
                    onChange={() => toggleExamStatus(student.id, !student.exam_completed)}
                  />)}
                </td>

                <td>
                  <button
                    disabled={student.user_type === "admin"}
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStudent(student.id)}
                  >
                    Delete
                  </button>
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

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                {i + 1}
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

export default RegisteredStudentsTable;
