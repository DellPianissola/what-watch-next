/**
 * Parsers genéricos para payloads HTTP — converte string/undefined em tipos
 * primitivos, devolvendo null quando o valor é ausente ou inválido.
 *
 * Usar em services que recebem `req.body` / `req.query` direto, onde tudo
 * pode chegar como string ou undefined.
 */

/**
 * Converte pra inteiro ou null. Aceita undefined, null, string vazia, ou
 * qualquer string/número parseável. Devolve null se não conseguir parsear
 * num inteiro finito.
 */
export const toIntOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Converte pra float ou null. Mesma semântica de toIntOrNull.
 */
export const toFloatOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}
