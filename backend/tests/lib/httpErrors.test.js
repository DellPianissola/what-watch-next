import { describe, it, expect } from 'vitest'
import {
  HttpError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../lib/httpErrors.js'

describe('HttpError (base)', () => {
  it('deve guardar statusCode e message', () => {
    const err = new HttpError(418, 'Sou um bule')

    expect(err.statusCode).toBe(418)
    expect(err.message).toBe('Sou um bule')
  })

  it('deve guardar code opcional quando passado', () => {
    const err = new HttpError(404, 'lista vazia', { code: 'EMPTY_LIST' })

    expect(err.code).toBe('EMPTY_LIST')
  })

  it('deve guardar details opcional quando passado', () => {
    const details = { campo: 'email', motivo: 'formato inválido' }
    const err = new HttpError(400, 'inválido', { details })

    expect(err.details).toBe(details)
  })

  it('deve deixar code/details undefined quando não passados', () => {
    const err = new HttpError(500, 'oops')

    expect(err.code).toBeUndefined()
    expect(err.details).toBeUndefined()
  })

  it('deve ser instanceof Error (pra capturar em catch genéricos)', () => {
    const err = new HttpError(500, 'oops')

    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(HttpError)
  })

  it('deve setar name = nome da classe (útil pra logs)', () => {
    const err = new HttpError(500, 'oops')

    expect(err.name).toBe('HttpError')
  })
})

describe('ValidationError', () => {
  it('deve usar status 400', () => {
    const err = new ValidationError('campo inválido')

    expect(err.statusCode).toBe(400)
    expect(err.message).toBe('campo inválido')
  })

  it('deve ser instanceof HttpError e ValidationError', () => {
    const err = new ValidationError('x')

    expect(err).toBeInstanceOf(HttpError)
    expect(err).toBeInstanceOf(ValidationError)
    expect(err.name).toBe('ValidationError')
  })

  it('deve passar options pro pai', () => {
    const err = new ValidationError('x', { code: 'BAD_INPUT', details: ['email'] })

    expect(err.code).toBe('BAD_INPUT')
    expect(err.details).toEqual(['email'])
  })
})

describe('UnauthorizedError', () => {
  it('deve usar status 401 e mensagem default', () => {
    const err = new UnauthorizedError()

    expect(err.statusCode).toBe(401)
    expect(err.message).toBe('Não autorizado')
  })

  it('deve permitir mensagem custom', () => {
    const err = new UnauthorizedError('token expirado')

    expect(err.message).toBe('token expirado')
  })
})

describe('ForbiddenError', () => {
  it('deve usar status 403 e mensagem default', () => {
    const err = new ForbiddenError()

    expect(err.statusCode).toBe(403)
    expect(err.message).toBe('Acesso negado')
  })

  it('deve permitir mensagem custom', () => {
    const err = new ForbiddenError('apenas admins')

    expect(err.message).toBe('apenas admins')
  })
})

describe('NotFoundError', () => {
  it('deve usar status 404 e mensagem default', () => {
    const err = new NotFoundError()

    expect(err.statusCode).toBe(404)
    expect(err.message).toBe('Recurso não encontrado')
  })

  it('deve permitir mensagem custom + code (caso EMPTY_LIST)', () => {
    const err = new NotFoundError('Sua lista está vazia', { code: 'EMPTY_LIST' })

    expect(err.message).toBe('Sua lista está vazia')
    expect(err.code).toBe('EMPTY_LIST')
  })
})

describe('ConflictError', () => {
  it('deve usar status 409', () => {
    const err = new ConflictError('já existe')

    expect(err.statusCode).toBe(409)
    expect(err.message).toBe('já existe')
  })

  it('deve passar code adiante', () => {
    const err = new ConflictError('duplicado', { code: 'DUPLICATE' })

    expect(err.code).toBe('DUPLICATE')
  })
})
