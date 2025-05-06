import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/studentprofile.css'

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('http://127.0.0.1:5000/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');

        setProfile(data.data); // extract .data here
      } catch (err) {
        console.error('Profile fetch error:', err.message);
        navigate('/student');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error-message">Profile not found</div>;

  const { student_details, team_number, component_requests, issued_components, return_history } = profile;

  return (
    <div className="profile-container">
      <h1>Student Profile</h1>

      <div className="profile-section">
        <h2>Personal Information</h2>
        <p><strong>Name:</strong> {student_details.name}</p>
        <p><strong>Roll Number:</strong> {student_details.roll_number}</p>
        <p><strong>Team Number:</strong> {team_number}</p>
      </div>

      <div className="profile-section">
        <h2>Requested Components</h2>
        {component_requests.length === 0 ? (
          <p>No requests made yet.</p>
        ) : (
          <ul>
            {component_requests.map((req, index) => (
              <li key={index}>
                <strong>{req.name}</strong> - Qty: {req.quantity}, Status: {req.status}, Requested on: {new Date(req.request_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section">
        <h2>Issued Components</h2>
        {issued_components.length === 0 ? (
          <p>No components issued.</p>
        ) : (
          <ul>
            {issued_components.map((comp, index) => (
              <li key={index}>
                <strong>{comp.name}</strong> - Qty: {comp.quantity}, Issued on: {new Date(comp.issue_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section">
        <h2>Return History</h2>
        {return_history.length === 0 ? (
          <p>No components returned.</p>
        ) : (
          <ul>
            {return_history.map((ret, index) => (
              <li key={index}>
                <strong>{ret.name}</strong> - Qty: {ret.quantity}, Returned on: {new Date(ret.return_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/student/dashboard" className="back-link">← Back to Dashboard</Link>
    </div>
  );
}

export default Profile;
