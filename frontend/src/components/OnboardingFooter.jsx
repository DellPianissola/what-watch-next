/**
 * Footer fixo exibido em /onboarding. Botão CTA grande:
 *   - desabilitado mostrando "Adicione mais N itens" enquanto count < target
 *   - ativo com pulse roxo "Continuar →" quando count >= target
 */
const OnboardingFooter = ({ count, target, onComplete }) => {
  const complete = count >= target
  const remaining = Math.max(target - count, 0)

  const label = complete
    ? 'Continuar →'
    : `Adicione mais ${remaining} ${remaining === 1 ? 'item' : 'itens'}`

  return (
    <div className="onboarding-footer">
      <button
        type="button"
        className={`onboarding-cta ${complete ? 'onboarding-cta-ready' : ''}`}
        onClick={onComplete}
        disabled={!complete}
      >
        {label}
      </button>
    </div>
  )
}

export default OnboardingFooter
