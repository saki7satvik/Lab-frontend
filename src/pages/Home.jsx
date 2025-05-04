import { Link } from 'react-router-dom';
import '../styles/main.css'; // Assuming you have a main.css file for styling

function Home() {
  return (
    <div className="container">
      <div className="header">
        <h1>Lab Management Portal</h1>
        <p className="subtitle">Streamlining your laboratory experience</p>
      </div>
      
      <div className="role-selection">
        <h2>Select Your Role</h2>
        <div className="button-container">
          <Link to="/student" className="btn btn-student">
            <span className="icon">🎓</span>
            <span>Student Access</span>
          </Link>
          
          <Link to="/instructor" className="btn btn-instructor">
            <span className="icon">👨‍🏫</span>
            <span>Instructor Access</span>
          </Link>
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🔬</div>
          <h3>Component Tracking</h3>
          <p>Real-time inventory management</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Usage Analytics</h3>
          <p>Detailed component utilization reports</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Efficient Workflow</h3>
          <p>Streamlined request and return process</p>
        </div>
      </div>
    </div>
  );
}

export default Home;