import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../services/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import WatchuLogo from '../components/WatchuLogo.jsx'
import './VerifyEmail.css'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const { refreshUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setErrorMsg('Link de verificação inválido.')
      return
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success')
        // Atualiza o user no contexto para refletir emailVerified = true
        refreshUser?.()
      })
      .catch((err) => {
        setStatus('error')
        setErrorMsg(
          err.response?.data?.error || 'Link inválido ou expirado. Solicite um novo.'
        )
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-brand">
          <WatchuLogo size={40} />
          <span>What<span className="verify-chu">chu</span></span>
        </div>

        {status === 'loading' && (
          <div className="verify-content">
            <div className="verify-spinner" />
            <p>Verificando seu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-content">
            <div className="verify-icon verify-icon--success">✓</div>
            <h2>Email verificado!</h2>
            <p>Sua conta está confirmada. Agora você tem acesso completo à plataforma.</p>
            <Link to="/" className="btn-verify-primary">Ir para o início</Link>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-content">
            <div className="verify-icon verify-icon--error">✕</div>
            <h2>Verificação falhou</h2>
            <p>{errorMsg}</p>
            <Link to="/" className="btn-verify-secondary">Voltar ao início</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
