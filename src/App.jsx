import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import AdminPanel from "./pages/AdminPanel";
import Exam from "./pages/Exam";
import Results from "./pages/Results";
import Navbar from "./components/Navbar";
import AdminDashboard from './pages/AdminDashboard';
import Instructions from './pages/Instructions';
import ProtectedRoute from "./components/ProtectedRoute";
import StudentRoute from "./components/StudentRoute";
import AdminRoute from "./components/AdminRoute";
import ExamCompleted from "./pages/ExamCompleted";
import RegisterForm from "./pages/RegisterForm";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary"
import Layout from './components/Layout';
function App() {
  return (
    <Router>
      <ErrorBoundary>

      <Routes>  
       { <Route path="/" element={<Login />} />}
        {<Route path="/login" element={<Login />} />}
        <Route path="/register" element={<RegisterForm />} />
        {/* Admin routes */}
        <Route path="/admin" element={ <ProtectedRoute><Navbar /><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>} />
        <Route path="/results/:studentId" element={<ProtectedRoute><Navbar /><AdminRoute><Results /></AdminRoute> </ProtectedRoute>} />
        {/* student routes */}
        <Route path="/instructions" element={<ProtectedRoute><Navbar /><StudentRoute><Instructions /></StudentRoute></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><StudentRoute><Navbar /><Exam /> </StudentRoute></ProtectedRoute>} />
        <Route path="/exam-completed" element={<ProtectedRoute><Navbar /><StudentRoute><ExamCompleted /> </StudentRoute></ProtectedRoute>} />

        {/* Catch-all route for 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
