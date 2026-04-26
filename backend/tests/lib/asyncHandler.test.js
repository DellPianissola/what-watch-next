import { describe, it, expect, vi } from 'vitest'
import { asyncHandler } from '../../lib/asyncHandler.js'

describe('asyncHandler', () => {
  // Setup: helpers para construir req/res/next fake
  const buildReq = () => ({})
  const buildRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  })
  const buildNext = () => vi.fn()

  it('deve chamar o handler passando req, res e next', async () => {
    const handler = vi.fn().mockResolvedValue(undefined)
    const wrapped = asyncHandler(handler)
    const req = buildReq()
    const res = buildRes()
    const next = buildNext()

    await wrapped(req, res, next)

    expect(handler).toHaveBeenCalledWith(req, res, next)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('não deve chamar next se o handler resolver normalmente', async () => {
    const handler = vi.fn().mockResolvedValue('ok')
    const next = buildNext()

    await asyncHandler(handler)(buildReq(), buildRes(), next)

    expect(next).not.toHaveBeenCalled()
  })

  it('deve chamar next(err) quando o handler rejeitar a promise', async () => {
    const erro = new Error('falhou')
    const handler = vi.fn().mockRejectedValue(erro)
    const next = buildNext()

    await asyncHandler(handler)(buildReq(), buildRes(), next)

    expect(next).toHaveBeenCalledWith(erro)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('deve chamar next(err) quando o handler lançar exceção sincronamente', async () => {
    const erro = new Error('falhou sync')
    const handler = vi.fn(() => {
      throw erro
    })
    const next = buildNext()

    // Promise.resolve(fn()) captura throws síncronos via try/catch interno do async wrapper
    await asyncHandler(handler)(buildReq(), buildRes(), next)

    expect(next).toHaveBeenCalledWith(erro)
  })

  it('deve aceitar handlers que retornam valor não-promise', async () => {
    // asyncHandler envolve com Promise.resolve, então valor síncrono também funciona
    const handler = vi.fn(() => 'valor síncrono')
    const next = buildNext()

    await asyncHandler(handler)(buildReq(), buildRes(), next)

    expect(next).not.toHaveBeenCalled()
    expect(handler).toHaveBeenCalled()
  })
})
