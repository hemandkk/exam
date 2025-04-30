import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ToastAlert from '../components/ToastAlert'
import ExamTimer from './ExamTimer';
import './exam.css'
const API_URL = process.env.REACT_APP_API_URL;
const EXAM_TIME = 10800 // 60 mins

function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const STUDENT_NAME = localStorage.getItem('name') || 'no-name';
  const ID = localStorage.getItem('ID') || '001';
  const USER_ID = localStorage.getItem('user_id')

  const [toast, setToast] = useState({ show: false, message: '', type: '' });
//console.log(localStorage.getItem('name'), "name")
  // user clicks reload or backbutton
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      //submitResponsesBeforeUnload();
      e.preventDefault();
      e.returnValue = ""; // Show browser's default alert
    };

    const handlePopState = (e) => {
      //submitResponsesBeforeUnload();
      // Redirect back to instructions if user tries to go back
      navigate("/instructions", { replace: true });
    };
    //user clicks reload 
    window.addEventListener("beforeunload", handleBeforeUnload);
     //user clicks backbutton 
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, questions.length, responses]);

  
  useEffect(() => {
    const userCategory = localStorage.getItem('user_stream') || 'commerce';
//console.log(  userCategory , "user")
//console.log(  localStorage.getItem('user_stream') , "local")
    setCategory(userCategory);
    axios.get(`${API_URL}/questions/${userCategory}`)
      .then(res => setQuestions(res.data))
      .catch(err => {
        tostTrigger("There is been an error in fetching questions, log out and try again",'danger')
      });
  }, []);

  const handleOptionChange = (questionId, option) => {
    const newResponses = { ...responses, [questionId]: option };
    setResponses(newResponses);
    localStorage.setItem('responses', JSON.stringify(newResponses));
  };

  const tostTrigger = (message, type)=>{
    setToast({ show: true, message: message, type: type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }

  const handleSaveNext = () => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  };
  const submitResponsesBeforeUnload = () => {

    const token = localStorage.getItem('access_token'); // or get from cookie
    const data = {
      user_id: USER_ID,
      responses,
      total_questions: questions.length,
      token, // attach token manually
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(`${API_URL}/submit-responses-v2`, blob);
    
  };
  const handleReview = () => {
    const questionId = questions[currentQuestionIndex].id;
    if (!markedForReview.includes(questionId)) {
      setMarkedForReview([...markedForReview, questionId]);
    }
    handleSaveNext();
  };

  const handleClearResponse = () => {
    const questionId = questions[currentQuestionIndex].id;
    if (markedForReview.includes(questionId)) {
      setMarkedForReview(markedForReview.filter((value)=>value !== questionId));
    }
    const newResponses = { ...responses };
    delete newResponses[questionId];
    setResponses(newResponses);
    localStorage.setItem('responses', JSON.stringify(newResponses));
  };

  const handleSubmit = () => {
    // Show confirmation dialog
    var userConfirmed = window.confirm("Are you sure want to complete the exam? This exam will mark as compeleted.");
    
    // If user clicks "Cancel", exit the function
    if (!userConfirmed) {
      return; // Stop the function from executing
    }
    setLoading(true)
    axios.post(`${API_URL}/submit-responses`, {
      user_id: localStorage.getItem('user_id'),
      responses,
      total_questions: questions.length
    }).then(() => 
              {
                setLoading(false)
                navigate("/exam-completed", { replace: true });
            }
        ).catch ((error) =>{
          setLoading(false)
          tostTrigger("Error during exam. Please contact admin.",'danger')
        })
  };


  return (
    <div className="exam-container d-flex">
      <div className="exam-content flex-grow-1 p-3">
      { toast?.show && <ToastAlert show={toast.show}  setShow={setToast} message={toast.message} variant={toast.type} />}
        <div className="d-flex justify-content-between align-items-center">
          <h5>Category: {category}</h5>
          <strong>{STUDENT_NAME.toUpperCase()} ({ID})</strong>
          <ExamTimer totalTime={EXAM_TIME} onSubmit={handleSubmit} />
        </div>
        {questions.length > 0 && (
          <div className="question-box mt-3">
            <h6>Q {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}</h6>
            {['a', 'b', 'c', 'd'].map(opt => (
              <div key={opt} className="form-check">
                <input
                  className="frm-border form-check-input "
                  type="radio"
                  name={`q_${questions[currentQuestionIndex].id}`}
                  id={`q_${questions[currentQuestionIndex].id}_${opt}`}
                  checked={responses[questions[currentQuestionIndex].id] === opt}
                  onChange={() => handleOptionChange(questions[currentQuestionIndex].id, opt)}
                />
                <label className="form-check-label" for={`q_${questions[currentQuestionIndex].id}_${opt}`}>
                  {questions[currentQuestionIndex][`option_${opt.toLowerCase()}`]}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3">
          <button disabled={loading} className="btn btn-secondary me-2" onClick={handleReview}>Mark for Review & Next</button>
          <button disabled={loading} className="btn btn-warning me-2" onClick={handleClearResponse}>Clear Response</button>
          <button disabled={loading} className="btn btn-success me-2" onClick={handleSaveNext}>Save & Next</button>
          <button disabled={loading} className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="sidebar p-3 bg-light">
        <h6>Choose a Question</h6>
        <div className="d-flex flex-wrap">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`btn m-1 ${(responses[q.id] && !markedForReview.includes(q.id)) ? 'btn-success' : markedForReview.includes(q.id) ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
