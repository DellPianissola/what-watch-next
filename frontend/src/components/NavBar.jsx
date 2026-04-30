import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import WatchuLogo from './WatchuLogo.jsx'
import './NavBar.css'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  // onboarding: sem navbar — usuário não deve sair do fluxo
  if (location.pathname === '/onboarding') {
    return null
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <WatchuLogo size={32} />
        <span className="nav-brand-text">What<span className="nav-brand-chu">chu</span></span>
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
        <div className="nav-user">
          <Link to="/profiles" className="nav-username-link">
            {user?.username}
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar

