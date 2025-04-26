import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToastAlert from '../components/ToastAlert'
import Loader from '../components/Loader'
import AdminResultsTable from './AdminResults'
import RegisteredStudentsTable from './RegisteredStudents'
import QuestionList from './QuestionList'

const supported_files = ['xlsx', 'csv']
//const categoryList = ['science', 'commerce', 'B-Tech-IT', 'arts']
const API_URL = process.env.REACT_APP_API_URL;
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentFile, setStudentFile] = useState(null);
  const [questionFile, setQuestionFile] = useState(null);
  const [category, setCategory] = useState('science'); // default to first option
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, attended: 0 });
  const [loader, setLoader] = useState(false)

  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [categoryList, setCategoryList] = useState(['science', 'commerce', 'B-Tech-IT', 'arts']);

  const fetchStudents = async () => {
    const res = await axios.get(`${API_URL}/students`);
    setStudents(res.data);
    setStats(prev => ({ ...prev, total: res.data.length }));
  };
  const fetchStreams = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/streams/`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(res?.data?.length > 0 ){
      setCategoryList(res.data);
    }
  };

  const tostTrigger = (message, type)=>{
    setToast({ show: true, message: message, type: type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }
  const fetchExamStats = async () => {
   // const res = await axios.get(`${API_URL}/admin-results`);
    //setStats(prev => ({ ...prev, attended: res.data.length }));
  };

  const uploadStudents = async () => {
    if(studentFile === null){
        alert('Choose a file to upload');
        return false
    }
    let fileName = studentFile.name 
    if( !supported_files.includes(fileName.substring(fileName.lastIndexOf('.')+1 , fileName.length )) ){
        alert('File should be excel of CSV');
        return false
    }
    const formData = new FormData();
    formData.append('file', studentFile);

    try {
        setLoader(true)
        const result = await axios.post(`${API_URL}/upload-students`, formData);
        tostTrigger(result?.data?.message,result?.status ===200 ? 'success':  'danger')
        setLoader(false)
        fetchStudents();
      } catch (error) {
        setLoader(false)
        console.error('Upload failed:', error);
        if (error?.response) {

          // The request was made and the server responded with a status code not in the 2xx range
          const msg = `Upload failed with status ${error.response.status}: ${error.response.data.detail || 'Server error'}`
          tostTrigger( msg,'danger')
        } else if (error?.request) {
          // The request was made but no response was received

          tostTrigger('No response from server. Please try again later.',  'danger')
        } else {
          // Something happened in setting up the request

          tostTrigger(error.message,  'danger')
        }
      }

  };

  const uploadQuestions = async () => {
    if(questionFile === null){
        alert('Choose a file to upload');
        return false
    }
    let fileName = questionFile.name 
    if( !supported_files.includes(fileName.substring(fileName.lastIndexOf('.')+1 , fileName.length )) ){
        alert('File should be excel of CSV');
        return false
    }
    try {
        setLoader(true)
        const formData = new FormData();
        formData.append('file', questionFile);
        const result = await axios.post(`${API_URL}/upload-questions/${category}`, formData);
        tostTrigger(result?.data?.message,result?.status ===200 ? 'success':  'danger')
        setLoader(false)
        fetchStudents();
      } catch (error) {
        setLoader(false)
        console.error('Upload failed:', error);
        if (error?.response) {

          // The request was made and the server responded with a status code not in the 2xx range
          const msg = `Upload failed with status ${error.response.status}: ${error.response.data.detail || 'Server error'}`
          tostTrigger( msg,'danger')
        } else if (error?.request) {
          // The request was made but no response was received

          tostTrigger('No response from server. Please try again later.',  'danger')
        } else {
          // Something happened in setting up the request

          tostTrigger(error.message,  'danger')
        }
      }

  };

  const deleteStudent = async (id) => {
    await axios.delete(`${API_URL}/students/${id}`);
    fetchStudents();
  };

  useEffect(() => {
    fetchStreams();
    fetchStudents();
    fetchExamStats();
  }, []);

  return (
    <div className="d-flex">
        
      {/* Left Sidebar */}
      <div className="bg-light p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <h4>Admin Panel</h4>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <button className={`tab-link btn  btn-primary ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-link'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          </li>
          <li className="nav-item">
            <button className={`tab-link btn ${activeTab === 'students' ? 'btn-primary' : 'btn-link'}`} onClick={() => setActiveTab('students')}>Registered Students</button>
          </li>
          <li className="nav-item">
            <button className={`tab-link btn ${activeTab === 'uploadStudents' ? 'btn-primary' : 'btn-link'}`} onClick={() => setActiveTab('uploadStudents')}>Upload Students</button>
          </li>
          <li className="nav-item">
            <button className={`tab-link btn ${activeTab === 'uploadQuestions' ? 'btn-primary' : 'btn-link'}`} onClick={() => setActiveTab('uploadQuestions')}>Upload Questions</button>
          </li>
          <li className="nav-item">
            <button className={`tab-link btn ${activeTab === 'questionsList' ? 'btn-primary' : 'btn-link'}`} onClick={() => setActiveTab('questionsList')}>Uploaded Questions</button>
          </li>
          <li className="nav-item">
            <button className={`tab-link btn ${activeTab === 'results' ? 'btn-primary' : 'btn-link'}`} onClick={() => setActiveTab('results')}>Exam Results</button>
          </li>
        </ul>
      </div>

      { toast?.show && <ToastAlert show={toast.show}  setShow={setToast} message={toast.message} variant={toast.type} />}
      {/* Right Content */}
      <div className="container mt-4">
        {activeTab === 'dashboard' && (
          <div>
            <h3>Dashboard Overview</h3>
            <div className="row">
              <div className="col-md-4">
                <div className="card p-3 text-white bg-success mb-3">
                  <h5>Total Registered Students</h5>
                  <h3>{stats.total}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 text-white bg-info mb-3">
                  <h5>Exam Attended</h5>
                  <h3>{stats.attended}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <RegisteredStudentsTable setStudents={setStudents} students={students} deleteStudent={deleteStudent}/>
          
        )}

        {activeTab === 'uploadStudents' && (
          <div>
            <h4>Upload Students</h4>
            <input type="file" className="form-control" onChange={(e) => setStudentFile(e.target.files[0])} />
            <button disabled={loader? true : false} className="btn btn-success mt-2" onClick={()=> uploadStudents()}>Upload Students </button>
            {/* <div><button className="btn btn-success mt-2">Loading</button><Loader loading /></div> */}
            
          </div>
        )}

        {activeTab === 'uploadQuestions' && (
          <><div>
            <h4>Upload Questions</h4>
            <select className="form-control mb-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categoryList.map((val, index)=>(
                    <option key={`${val}-${index}`} id={index} value={val}>{val}</option>
                ))}
            </select>

            <input type="file" className="form-control" onChange={(e) => setQuestionFile(e.target.files[0])} />
            <button  disabled={loader? true : false} className="btn btn-primary mt-2" onClick={ ()=> uploadQuestions() }>Upload Questions</button>
          </div>
          {/* <QuestionList categoryList={categoryList} /> */}</>
        )}
        {activeTab === 'questionsList' && (
          <>
            <QuestionList categoryList={categoryList}/>
          </>
        )}

        {activeTab === 'results' && (
          <>
            <AdminResultsTable />
          </>
        )}
      </div>
    </div>
  );
}

