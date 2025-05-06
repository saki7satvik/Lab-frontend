import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/instructorteams.css';

function InstructorTeams() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://127.0.0.1:5000/api/instructor/teams', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          console.log('Teams fetched successfully:', data.data.teams);
          setTeams(data.data.teams);
          setFilteredTeams(data.data.teams);
        } else {
          alert(data.message || 'Failed to fetch teams');
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
        alert('Network error. Please try again.');
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter(team =>
      team.team_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  return (
    <div className="teams-container">
      <h2>Instructor Teams</h2>

      <input
        type="text"
        placeholder="Search by team number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {filteredTeams.map((team, index) => (
        <div key={index} className="team-card">
          <h3>Team: {team.team_number}</h3>
          <ul>
            {team.members.map((member, i) => (
              <li key={i}>
                {member.roll} - {member.name} ({member.phno})
              </li>
            ))}
          </ul>
          <Link to={`/instructor/teams/${team.team_number}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

export default InstructorTeams;
