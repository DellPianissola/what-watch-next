import { vi } from 'vitest'

/**
 * Helpers para construir req/res/next "fake" em testes de middleware/handlers.
 *
 * `buildRes` retorna um objeto encadeável (status().json()) com mocks vi
 * — assim dá pra fazer expect(res.status).toHaveBeenCalledWith(...) etc.
 */

export const buildReq = (overrides = {}) => ({ ...overrides })

export const buildRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
})

export const buildNext = () => vi.fn()
