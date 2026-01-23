import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Students from './pages/Students'
import Classes from './pages/Classes'
import Attendance from './pages/Attendance'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Attendance Management</h1>
          <ul className="nav-links">
            <li><Link to="/">Students</Link></li>
            <li><Link to="/classes">Classes</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
          </ul>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Students />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
