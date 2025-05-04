// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './components/auth/StudentLogin';
import InstructorLogin from './components/auth/InstructorLogin';
import StudentDashboard from './components/dashboard/StudentDashboard';
import Profile from './pages/Profile';
import Components from './pages/Components';
import Issue from './pages/Issue';
import Return from './pages/Return';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentLogin />} />
        <Route path="/instructor" element={<InstructorLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/components" element={<Components />} />
        <Route path="/student/issue" element={<Issue />} />
        <Route path="/student/return" element={<Return />} />
      </Routes>
    </Router>
  );
}

export default App;