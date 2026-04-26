/**
 * Erros tipados de HTTP — services lançam, o middleware central traduz pra
 * status code + JSON. Permite que services não toquem em `req`/`res`.
 *
 * Uso (em service):
 *   throw new NotFoundError('Perfil não encontrado')
 *
 * Uso (em service, com código pra cliente):
 *   throw new NotFoundError('Sua lista está vazia', { code: 'EMPTY_LIST' })
 */

export class HttpError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    // `code` é opcional — string que o frontend pode usar pra distinguir cenários
    // (ex.: 'EMPTY_LIST' vs 'PROFILE_NOT_FOUND', ambos 404).
    this.code = options.code
    // `details` é opcional — payload extra (ex.: campos inválidos numa validação).
    this.details = options.details
  }
}

export class ValidationError extends HttpError {
  constructor(message, options) {
    super(400, message, options)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Não autorizado', options) {
    super(401, message, options)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Acesso negado', options) {
    super(403, message, options)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Recurso não encontrado', options) {
    super(404, message, options)
  }
}

export class ConflictError extends HttpError {
  constructor(message, options) {
    super(409, message, options)
  }
}
