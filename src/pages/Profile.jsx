import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
  
        // First check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
        }
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }
  
        setProfile(data);
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

  return (
    <div className="profile-container">
      <h1>Student Profile</h1>

      <div className="profile-section">
        <h2>Personal Information</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Roll Number:</strong> {profile.roll_number}</p>
        <p><strong>Team:</strong> {profile.team}</p>
      </div>

      <div className="profile-section">
        <h2>Mentors</h2>
        <ul className="mentors-list">
          {profile.mentors && profile.mentors.map((mentor, index) => (
            <li key={index}>
              <p><strong>{mentor.role}:</strong> {mentor.name}</p>
              <p>Contact: {mentor.contact}</p>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/student/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default Profile;
