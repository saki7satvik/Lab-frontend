import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import '../../styles/studentlogin.css';

function StudentLogin() {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Roll Number:', rollNumber); // Debugging line
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login/student', {
        roll_number: rollNumber,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/student/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Student Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="rollnumber">Roll Number</label>
          <input
            type="text"
            id="rollnumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter your roll number"
            required
          />
        </div>
        <button type="submit" className="btn btn-student">
          <span className="icon">🎓</span>
          <span>Login as Student</span>
        </button>
      </form>
      <a href="/" className="back-link">← Back to role selection</a>
    </div>
  );
}

export default StudentLogin;