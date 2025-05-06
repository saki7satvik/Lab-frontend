import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/instructorteamdetails.css';

const InstructorTeamDetails = () => {
  const { teamNumber } = useParams(); // Extract the team number from URL params
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch team details from the backend
  const fetchTeamDetails = async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (!token) {
      alert('Please login to continue');
      return;
    }

    try {
      // Make the API request with the Authorization header
      const response = await axios.get(
        `http://127.0.0.1:5000/api/instructor/team/${teamNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to header
          },
        }
      );
      console.log('Response from backend:', response.data);  // Add logging here to check response data
      // Assuming the API returns data in 'data' field
      setTeamDetails(response.data);
      console.log('Updated team details state:', response.data); // Log the updated state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team details:', error);
      setLoading(false);
      alert('Failed to fetch team details. Please try again.');
    }
  };

  // Fetch the team details when the component mounts or when teamNumber changes
  useEffect(() => {
    fetchTeamDetails();
  }, [teamNumber]);

  // Function to handle request action (accept/reject)
  const handleRequestAction = async (requestId, action) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to continue');
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:5000/api/instructor/teams/${teamNumber}/process-request`,
        { request_id: requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchTeamDetails(); // Refresh team details after action
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Error processing request:', err);
      alert('Failed to process request');
    }
  };

  // Show loading state
  if (loading) return <p className="loading-text">Loading team details...</p>;

  // Log the teamDetails to check its structure
  console.log('teamDetails state:', teamDetails);

  // Show error if team details are not found
  if (!teamDetails) return <p className="error-text">No data available.</p>;

  // Destructure team details
  const { ipa_ipr_no, members, component_requests = [], issued_components = [], return_history = [] } = teamDetails;

  return (
    <div className="team-details-container">
      <h2>Team Details - {ipa_ipr_no}</h2>

      {/* Members Section */}
      <section>
        <h3>Members</h3>
        <ul>
          {members.length === 0 ? (
            <li>No members available.</li>
          ) : (
            members.map((member, idx) => (
              <li key={idx}>
                {member.name} ({member.roll_number}) - {member.email} - {member.phone}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Requested Components Section */}
      <section>
        <h3>Requested Components</h3>
        <ul>
          {component_requests.length === 0 ? (
            <li>No pending requests.</li>
          ) : (
            component_requests.map((item, idx) => (
              <li key={idx}>
                <strong>{item.name}</strong> - Qty: {item.quantity} (Requested by: {item.requested_by})
                <div className="action-buttons">
                  <button className="accept" onClick={() => handleRequestAction(item.request_id, 'accept')}>
                    Accept
                  </button>
                  <button className="reject" onClick={() => handleRequestAction(item.request_id, 'reject')}>
                    Reject
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Issued Components Section */}
      <section>
        <h3>Issued Components</h3>
        <ul>
          {issued_components.length === 0 ? (
            <li>No issued components.</li>
          ) : (
            issued_components.map((item, idx) => (
              <li key={idx}>
                {item.name} - Qty: {item.quantity} (Issued by: {item.issued_by})
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Return History Section */}
      <section>
        <h3>Return History</h3>
        <ul>
          {return_history.length === 0 ? (
            <li>No returns.</li>
          ) : (
            return_history.map((item, idx) => (
              <li key={idx}>
                {item.name} - Qty: {item.quantity} (Returned by: {item.returned_by})
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

export default InstructorTeamDetails;
