import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/studentlogin.css';

function StudentLogin() {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate roll number format
    if (!rollNumber.match(/^[A-Z]\d{3}$/i)) {
      setError('Please enter a valid roll number (e.g., A001)');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/student/login',
        { roll_number: rollNumber.toUpperCase() }
      );

      if (response.data.success) {
        const { token, team_number, student_name, roll_number } = response.data.data;

        // Save token and student info
        localStorage.setItem('token', token);
        localStorage.setItem(
          'student',
          JSON.stringify({ team_number, student_name, roll_number })
        );

        // Redirect to dashboard
        navigate('/student/dashboard');
      } else {
        setError(response.data.message || 'Invalid roll number');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Network error. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
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
            onChange={(e) => setRollNumber(e.target.value.trim())}
            placeholder="Enter your roll number (e.g., A001)"
            required
            autoComplete="off"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="btn btn-student"
          disabled={isLoading || !rollNumber}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="ms-2">Logging in...</span>
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <a href="/" className="back-link">← Back to role selection</a>
    </div>
  );
}

export default StudentLogin;
