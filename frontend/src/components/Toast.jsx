import { useState } from 'react'

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const ROLES = {
  success: 'status',
  info: 'status',
  warning: 'alert',
  error: 'alert',
}

const Toast = ({ id, variant, message, onDismiss }) => {
  const [leaving, setLeaving] = useState(false)

  // anima saída antes de remover do DOM
  const handleDismiss = () => {
    setLeaving(true)
    setTimeout(() => onDismiss(id), 200)
  }

  return (
    <div
      className={`toast toast-${variant} ${leaving ? 'toast-leaving' : ''}`}
      role={ROLES[variant] || 'status'}
      aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
    >
      <span className="toast-icon" aria-hidden="true">{ICONS[variant]}</span>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={handleDismiss}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
