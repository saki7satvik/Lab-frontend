import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import '../styles/student.css';
import { Link } from 'react-router-dom';

function Issue() {
  const [quantity, setQuantity] = useState(1);
  const [component, setComponent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const componentId = searchParams.get('component');
    
    if (!componentId) {
      navigate('http://127.0.0.1:5000/student/components');
      return;
    }

    // In a real app, you would fetch the component details
    setComponent({
      id: componentId,
      name: location.state?.component?.name || 'Component'
    });
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          component_id: component.id,
          quantity: quantity
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      setSuccess('Request submitted successfully!');
      setError('');
      setTimeout(() => navigate('http://127.0.0.1:5000/student/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!component) return <div>Loading component details...</div>;

  return (
    <div className="issue-container">
      <h1>Request Component: {component.name}</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="input-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-submit">
          Submit Request
        </button>
      </form>
      
      <Link to="/student/components" className="back-link">
        ← Back to Components
      </Link>
    </div>
  );
}

export default Issue;