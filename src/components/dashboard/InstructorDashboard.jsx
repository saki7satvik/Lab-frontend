import { useNavigate } from 'react-router-dom';
import '../../styles/instructordashboard.css'; // Add appropriate styles

function InstructorDashboard() {
  const navigate = useNavigate();

  const goToTeams = () => {
    navigate('/instructor/teams');
  };

  return (
    <div className="dashboard-container">
      <h1>Instructor Dashboard</h1>
      
      <div className="card-grid">
        <div className="card" onClick={goToTeams}>
          <h2>Teams</h2>
          <p>View all student teams and their details</p>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
