/**
 * Header sticky exibido em /onboarding (modo de busca durante onboarding).
 * Mostra saudação, instrução, link de skip e barra de progresso.
 */
const OnboardingHeader = ({ count, target, onSkip }) => {
  const progress = Math.min(count, target)
  const complete = count >= target

  const progressLabel = complete
    ? `Pronto! ${count} ${count === 1 ? 'item adicionado' : 'itens adicionados'}`
    : `${progress} de ${target} ${progress === 1 ? 'adicionado' : 'adicionados'}`

  return (
    <div className="onboarding-header">
      <div className="onboarding-header-content">
        <div className="onboarding-header-text">
          <h2>Bem-vindo!</h2>
          <p>
            Adicione pelo menos {target} filmes, séries ou animes pra
            ativar o sorteio e começar a usar o app.
          </p>
        </div>
        <button
          type="button"
          className="onboarding-skip-link"
          onClick={onSkip}
        >
          Pular por agora
        </button>
      </div>
      <div className="onboarding-progress">
        <div className="onboarding-progress-text">{progressLabel}</div>
        <div className="onboarding-progress-bar">
          <div
            className="onboarding-progress-fill"
            style={{ width: `${(progress / target) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default OnboardingHeader
