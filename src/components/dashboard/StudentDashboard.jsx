import { Link } from 'react-router-dom';
import '../../styles/studentdashboard.css';

function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <nav>
          <Link to="/student/profile" className="nav-link">Profile</Link>
        </nav>
      </header>
      
      <div className="dashboard-grid">
        <Link to="/student/components" className="dashboard-card">
          <h2>Request Components</h2>
          <p>Browse available components</p>
        </Link>
        
        {/* <Link to="/student/issue" className="dashboard-card">
          <h2>Issue Components</h2>
          <p>Request lab components</p>
        </Link> */}
        
        <Link to="/student/return" className="dashboard-card">
          <h2>Return Components</h2>
          <p>Return used components</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;