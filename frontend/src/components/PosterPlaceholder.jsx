import './PosterPlaceholder.css'

const PosterPlaceholder = ({ title, type, className = '' }) => {
  const getIcon = () => {
    switch (type) {
      case 'MOVIE':
      case 'movie':
        return '🎬'
      case 'SERIES':
      case 'series':
        return '📺'
      case 'ANIME':
      case 'anime':
        return '🎌'
      default:
        return '🎬'
    }
  }

  return (
    <div className={`poster-placeholder ${className}`}>
      <div className="poster-placeholder-icon">{getIcon()}</div>
      <div className="poster-placeholder-text">{title}</div>
    </div>
  )
}

export default PosterPlaceholder

