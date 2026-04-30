import './OnboardingHeader.css'

const OnboardingHeader = ({ count, target, onSkip, onComplete }) => {
  const progress = Math.min(count, target)
  const complete = count >= target
  const remaining = Math.max(target - count, 0)

  const progressLabel = complete
    ? `${count} ${count === 1 ? 'título adicionado' : 'títulos adicionados'}`
    : `${progress} de ${target} ${progress === 1 ? 'adicionado' : 'adicionados'}`

  const ctaLabel = complete
    ? 'Continuar →'
    : `Adicione mais ${remaining} ${remaining === 1 ? 'título' : 'títulos'}`

  return (
    <div className="onboarding-header">
      <div className="onboarding-header-content">
        <div className="onboarding-header-text">
          <h2>Bem-vindo!</h2>
          <p>Busque e adicione pelo menos {target} títulos para começar.</p>
        </div>
        <button
          type="button"
          className="onboarding-skip-link"
          onClick={onSkip}
        >
          Pular por agora
        </button>
      </div>
      <div className="onboarding-progress-row">
        <div className="onboarding-progress">
          <div className="onboarding-progress-bar">
            <div
              className="onboarding-progress-fill"
              style={{ width: `${(progress / target) * 100}%` }}
            />
          </div>
          <div className="onboarding-progress-text">{progressLabel}</div>
        </div>
        <button
          type="button"
          className={`onboarding-cta ${complete ? 'onboarding-cta-ready' : ''}`}
          onClick={onComplete}
          disabled={!complete}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}

export default OnboardingHeader
