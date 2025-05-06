import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components.css';

function Components() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchComps() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/student/components', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComponents(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load components');
      } finally {
        setLoading(false);
      }
    }
    fetchComps();
  }, []);

  const openModal = (comp) => {
    setSelectedComp(comp);
    setQuantity(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedComp(null);
  };

  const submitRequest = async () => {
    if (quantity < 1 || quantity > selectedComp.available) {
      alert(`Enter quantity between 1 and ${selectedComp.available}`);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://127.0.0.1:5000/api/student/request',
        {
          component_id: selectedComp.id,
          component_name: selectedComp.name,
          quantity,
          notes: selectedComp.notes || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (res.data.success) {
        alert(`Request ${res.data.data.request_id} created`);
        closeModal();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting request');
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="components-container">
      {components.map((comp) => (
        <div key={comp.id} className="component-card">
          <h3>{comp.name}</h3>
          <p>{comp.description}</p>
          <p>Available: {comp.available}</p>
          <button onClick={() => openModal(comp)}>Request</button>
        </div>
      ))}

    {modalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Request: {selectedComp.name}</h2>

          <label>
            Quantity (max {selectedComp.available}):
            <input
              type="number"
              min="1"
              max={selectedComp.available}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
    
          <label>
            Notes (optional):
            <textarea
              placeholder="Mention any specific reason or urgency"
              onChange={(e) => setSelectedComp({ ...selectedComp, notes: e.target.value })}
              value={selectedComp.notes || ''}
            />
          </label>
    
          <div className="modal-buttons">
            <button onClick={submitRequest}>Submit</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}

export default Components;
