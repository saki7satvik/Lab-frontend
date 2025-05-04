import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components.css'; // Assuming you have a CSS file for styling

function Components() {
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/api/components', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch components');
        }
        
        const data = await response.json();
        setComponents(data.data);
      } catch (err) {
        setError(err.message);
        navigate('/student'); // Redirect if unauthorized
      } finally {
        setLoading(false);
      }
    };
    
    fetchComponents();
  }, [navigate]);

  const filteredComponents = components.filter(comp => 
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="components-container">
      <h1>Available Components</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="components-list">
        {filteredComponents.length > 0 ? (
          filteredComponents.map((component) => (
            <div key={component.id} className="component-card">
              <h3>{component.name}</h3>
              <p>Available: {component.available}</p>
              <p>Category: {component.category}</p>
              <Link 
                to={`/student/issue?component=${component.id}`}
                className="btn btn-issue"
                state={{ component }}
              >
                Request
              </Link>
            </div>
          ))
        ) : (
          <p>No components found</p>
        )}
      </div>
    </div>
  );
}

export default Components;