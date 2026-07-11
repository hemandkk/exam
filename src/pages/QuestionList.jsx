import React, { useEffect, useState } from "react";
import API from "../services/api";

const QuestionList = ({categoryList}) => {
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchQuestions = async () => {
    if (!selectedCategory) return;
    try {
      const res = await API.get('/questions/', {
        params: { category: selectedCategory, page, limit },
      });
      setQuestions(res.data.questions);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await API.delete(`/questions/${id}`);
      fetchQuestions(); // Refresh after delete
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  useEffect(() => {
    if (selectedCategory && page) {
      fetchQuestions();
    }
  }, [selectedCategory, page]);
  
  // When category changes, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);
  
  

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h4>Questions Management</h4>

      <div className="mb-3">
        <label className="form-label">Select Category:</label>
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryList && categoryList.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No data found.</td>
            </tr>
          ):(categoryList && categoryList.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          )))}
        </select>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Options</th>
            <th>Correct</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {questions.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No data found.</td>
            </tr>
          ):
          (questions.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.question}</td>
              <td>
                A. {q.option_a} <br />
                B. {q.option_b} <br />
                C. {q.option_c} <br />
                D. {q.option_d}
              </td>
              <td>{q.correct_option}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteQuestion(q.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          )))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionList;
