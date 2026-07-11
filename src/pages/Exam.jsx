import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../components/ToastAlert'
import ExamTimer from './ExamTimer';
import './exam.css'
import API, { getStoredToken } from '../services/api';
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
    API.get(`/questions/${userCategory}`)
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

  const renderOptionBlock = (question, optionKey, label, secondaryLabel) => {
    const isSelected = responses[question.id] === optionKey;
    const optionText = question[`option_${optionKey}`] || question[`option_${optionKey.toLowerCase()}`];
    const secondaryOptionText = question[`option_${optionKey}_secondary`] || question[`option_${optionKey.toLowerCase()}_secondary`];

    return (
      <div key={`${question.id}-${optionKey}`} className={`option-card ${isSelected ? 'selected' : ''}`}>
        <div className="option-choice-row">
          <input
            className="form-check-input frm-border"
            type="radio"
            name={`q_${question.id}`}
            id={`${question.id}_${optionKey}`}
            checked={isSelected}
            onChange={() => handleOptionChange(question.id, optionKey)}
          />
          <label className="form-check-label option-label" htmlFor={`${question.id}_${optionKey}`}>
            <span className="option-letter">{optionKey.toUpperCase()}</span>
            <span className="option-body">
              <strong>{label}</strong>: {optionText}
            </span>
          </label>
        </div>
        {secondaryLabel && (
          <div className="option-secondary-text">
            <strong>{secondaryLabel}</strong>: {secondaryOptionText || optionText}
          </div>
        )}
      </div>
    );
  };

  const tostTrigger = (message, type)=>{
    setToast({ show: true, message: message, type: type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }

  const handleSaveNext = () => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  };
  const submitResponsesBeforeUnload = () => {

    const token = getStoredToken();
    const data = {
      user_id: USER_ID,
      responses,
      total_questions: questions.length,
      token, // attach token manually
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1'}/submit-responses-v2`, blob);
    
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
    API.post('/submit-responses', {
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

  const currentQuestion = questions[currentQuestionIndex];
  const secondaryLanguageLabel = currentQuestion?.secondary_language ? currentQuestion.secondary_language.toUpperCase() : 'SECONDARY LANGUAGE';

  return (
    <div className="exam-container d-flex">
      <div className="exam-content flex-grow-1 p-3">
      { toast?.show && <ToastAlert show={toast.show}  setShow={setToast} message={toast.message} variant={toast.type} />}
        <div className="d-flex justify-content-between align-items-center">
          <h5>Category: {category}</h5>
          <strong>{STUDENT_NAME.toUpperCase()} ({ID})</strong>
          <ExamTimer totalTime={EXAM_TIME} onSubmit={handleSubmit} />
        </div>
        {currentQuestion && (
          <div className="question-box mt-3">
            <div className="question-header-card">
              <div>
                <h5 className="mb-1">Question {currentQuestionIndex + 1}</h5>
                <p className="mb-0 text-muted">Choose one answer for both language versions.</p>
              </div>
              <span className="question-language-badge">{currentQuestion.secondary_language ? currentQuestion.secondary_language : 'English + Secondary'}</span>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-lg-6">
                <div className="language-panel">
                  <div className="language-panel-title">English</div>
                  <div className="question-text-block">{currentQuestion.question}</div>
                  {['a', 'b', 'c', 'd'].map((opt) => renderOptionBlock(currentQuestion, opt, 'English', 'Translated'))}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="language-panel">
                  <div className="language-panel-title">{secondaryLanguageLabel}</div>
                  <div className="question-text-block">{currentQuestion.question_secondary || currentQuestion.question}</div>
                  {['a', 'b', 'c', 'd'].map((opt) => renderOptionBlock(currentQuestion, opt, 'Translated', ''))}
                </div>
              </div>
            </div>
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
