// Cache de sessão compartilhado entre Search e MyList — persiste enquanto a aba estiver aberta
export const detailsCache = new Map()

export const trailerUrl = (trailer) => {
  if (!trailer) return null
  if (trailer.startsWith('http')) return trailer
  return `https://www.youtube.com/watch?v=${trailer}`
}
