import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import MyList from './pages/MyList'
import Profiles from './pages/Profiles'
import { getProfiles } from './services/api.js'
import './App.css'

function App() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const response = await getProfiles()
      setProfiles(response.data.profiles)
    } catch (error) {
      console.error('Erro ao carregar perfis:', error)
    }
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home profiles={profiles} />} />
        <Route path="/search" element={<Search profiles={profiles} onMovieAdded={loadProfiles} />} />
        <Route path="/list" element={<MyList profiles={profiles} />} />
        <Route path="/profiles" element={<Profiles onProfileChange={setProfiles} />} />
      </Routes>
    </Router>
  )
}

function NavBar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        🎬 What Watch Next
      </Link>
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          🏠 Início
        </Link>
        <Link to="/search" className={isActive('/search') ? 'active' : ''}>
          🔍 Buscar
        </Link>
        <Link to="/list" className={isActive('/list') ? 'active' : ''}>
          📋 Minha Lista
        </Link>
        <Link to="/profiles" className={isActive('/profiles') ? 'active' : ''}>
          👥 Perfis
        </Link>
      </div>
    </nav>
  )
}

export default App

