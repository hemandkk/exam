import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 mb-4">🎓 Welcome to the Online Exam Portal</h1>
      <p className="lead mb-5">
        Take exams, track results, and download your marksheets with ease.
      </p>
      <div>
        <Link to="/login" className="btn btn-primary me-3">
          Student Login
        </Link>
        <Link to="/admin" className="btn btn-outline-secondary">
          Admin Panel
        </Link>
      </div>
    </div>
  );
}
