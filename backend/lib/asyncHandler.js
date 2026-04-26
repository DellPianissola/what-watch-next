/**
 * Wrapper para handlers async do Express.
 *
 * Captura exceções rejeitadas (que o Express não pega sozinho em handlers async)
 * e repassa pro middleware central de erros via `next(err)`.
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
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
