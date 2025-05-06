// src/pages/TeamDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/teamdetail.css';

export default function TeamDetail() {
  const { teamNumber } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          'http://127.0.0.1:5000/api/instructor/teams',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const found = data.data.teams.find(t => t.team_number === teamNumber);
        setTeam(found || null);
      } catch (err) {
        console.error(err);
        alert('Failed to load team details');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [teamNumber]);

  const approve = async (reqId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:5000/api/instructor/approve',
        { team_number: teamNumber, request_id: reqId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh only this team's data in memory
      setTeam(team => ({
        ...team,
        requested: team.requested.filter(r => r.request_id !== reqId),
        issued: [
          ...team.issued,
          { ...team.requested.find(r => r.request_id === reqId) }
        ]
      }));
    } catch (err) {
      alert('Error approving request');
    }
  };

  const reject = async (reqId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:5000/api/instructor/reject',
        { team_number: teamNumber, request_id: reqId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeam(team => ({
        ...team,
        requested: team.requested.filter(r => r.request_id !== reqId)
      }));
    } catch {
      alert('Error rejecting request');
    }
  };

  if (loading) return <p>Loading team details…</p>;
  if (!team)    return <p>Team not found <button onClick={() => navigate(-1)}>Go back</button></p>;

  return (
    <div className="team-detail">
      <h1>Team: {team.team_number}</h1>
      <h2>Members</h2>
      <table className="members-table">
        <thead><tr><th>Roll No</th><th>Name</th><th>Phone</th></tr></thead>
        <tbody>
          {team.members.map((m,i) => (
            <tr key={i}>
              <td>{m.roll}</td>
              <td>{m.name}</td>
              <td>{m.phno}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="comp-section">
        <h2>Requested Components</h2>
        {team.requested.length === 0
          ? <p>No pending requests</p>
          : team.requested.map(r => (
              <div key={r.request_id} className="comp-item">
                <span>{r.name} — Qty: {r.quantity}</span>
                <button onClick={() => approve(r.request_id)}>Accept</button>
                <button onClick={() => reject(r.request_id)}>Reject</button>
              </div>
            ))
        }
      </section>

      <section className="comp-section">
        <h2>Issued Components</h2>
        {team.issued.length === 0
          ? <p>None issued</p>
          : team.issued.map((i, idx) => (
              <div key={idx} className="comp-item">
                {i.name} — Qty: {i.quantity}
              </div>
            ))
        }
      </section>

      <section className="comp-section">
        <h2>Return History</h2>
        {team.returned.length === 0
          ? <p>None returned</p>
          : team.returned.map((r, idx) => (
              <div key={idx} className="comp-item">
                {r.name} — Qty: {r.quantity}
              </div>
            ))
        }
      </section>

      <Link to="/instructor/teams" className="back-link">← Back to Teams</Link>
    </div>
  );
}
