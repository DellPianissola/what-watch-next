/**
 * Wrapper para handlers async do Express.
 *
 * Captura exceções (síncronas ou assíncronas) e repassa pro middleware
 * central de erros via `next(err)`.
 *
 * Uso:
 *   router.get('/foo', asyncHandler(async (req, res) => {
 *     const data = await someService.doStuff()
 *     res.json(data)
 *   }))
 *
 * Sem isso, qualquer `throw` ou `Promise.reject` dentro de um handler async
 * vira um unhandled rejection — o Express não sabe lidar com isso por padrão.
 */
export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (err) {
    next(err)
  }
}
