import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/instructorlogin.css';

function InstructorLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('http://127.0.0.1:5000/api/login/instructor', {
        username: formData.username,
        password: formData.password
      });

      if (data.success) {
        const { token, name } = data.data;

        // Store token and instructor name
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'instructor');
        localStorage.setItem('userName', name);

        // Navigate to instructor dashboard
        navigate('/instructor/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Instructor Login</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-instructor"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : (
            <>
              <span className="icon">👨‍🏫</span>
              <span>Login as Instructor</span>
            </>
          )}
        </button> 
      </form>

      <Link to="/" className="back-link">← Back to role selection</Link>
    </div>
  );
}

export default InstructorLogin;
