import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { resendVerification } from '../services/api.js'
import './EmailVerificationBanner.css'

const EmailVerificationBanner = () => {
  const { user } = useAuth()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.emailVerified) return null

  const handleResend = async () => {
    setSending(true)
    setError('')
    try {
      await resendVerification()
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao reenviar. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="ev-banner">
      <div className="ev-banner__content">
        <span className="ev-banner__icon">!</span>
        <p className="ev-banner__text">
          Verifique seu email <strong>{user.email}</strong> para ativar sua conta.
        </p>
        {sent ? (
          <span className="ev-banner__sent">Email reenviado!</span>
        ) : (
          <button
            className="ev-banner__btn"
            onClick={handleResend}
            disabled={sending}
          >
            {sending ? 'Enviando...' : 'Reenviar'}
          </button>
        )}
      </div>
      {error && <p className="ev-banner__error">{error}</p>}
    </div>
  )
}

export default EmailVerificationBanner
