import { useState, useEffect } from 'react'
import { getMovieDetails, getSeriesDetails, getAnimeDetails } from '../services/api.js'
import { detailsCache } from '../utils/detailsCache.js'

/**
 * Busca os detalhes ricos (diretor, elenco, trailer, etc.) de um item
 * quando ele é aberto no modal. Usa cache de sessão para evitar re-fetches.
 */
export const useRichDetails = (item) => {
  const [richDetails, setRichDetails] = useState(null)
  const [richDetailsLoading, setRichDetailsLoading] = useState(false)

  useEffect(() => {
    if (!item?.externalId) {
      setRichDetails(null)
      return
    }

    const cacheKey = `${item.type}:${item.externalId}`
    if (detailsCache.has(cacheKey)) {
      setRichDetails(detailsCache.get(cacheKey))
      setRichDetailsLoading(false)
      return
    }

    let cancelled = false
    setRichDetails(null)
    setRichDetailsLoading(true)

    const fetchDetails = async () => {
      try {
        let response
        if (item.type === 'MOVIE') response = await getMovieDetails(item.externalId)
        else if (item.type === 'SERIES') response = await getSeriesDetails(item.externalId)
        else response = await getAnimeDetails(item.externalId)

        if (!cancelled) {
          detailsCache.set(cacheKey, response.data)
          setRichDetails(response.data)
        }
      } catch (error) {
        if (!cancelled) console.error('Erro ao carregar detalhes:', error)
      } finally {
        if (!cancelled) setRichDetailsLoading(false)
      }
    }

    fetchDetails()
    return () => { cancelled = true }
  }, [item?.externalId, item?.type])

  return { richDetails, richDetailsLoading }
}
