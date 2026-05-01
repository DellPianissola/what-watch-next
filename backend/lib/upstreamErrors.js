import { UpstreamError } from './httpErrors.js'

export const describeAxiosError = (error) => {
  if (error.response) {
    const body = typeof error.response.data === 'string'
      ? error.response.data.slice(0, 200)
      : JSON.stringify(error.response.data).slice(0, 200)
    return `HTTP ${error.response.status} — ${body}`
  }
  if (error.code) {
    return `${error.code} — ${error.message}`
  }
  return error.message || 'erro desconhecido'
}

export const makeUpstreamErrorFactory = (source) => (error, operation) => {
  const detail = describeAxiosError(error)
  const upstreamStatus = error.response?.status ?? null
  return new UpstreamError(source, upstreamStatus, `${operation}: ${detail}`)
}
