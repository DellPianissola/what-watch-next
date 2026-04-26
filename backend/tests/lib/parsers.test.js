import { describe, it, expect } from 'vitest'
import { toIntOrNull, toFloatOrNull } from '../../lib/parsers.js'

describe('toIntOrNull', () => {
  it.each([
    ['1', 1],
    ['42', 42],
    ['  10  ', 10],   // parseInt aceita espaços
    [0, 0],            // zero é válido (não é null)
    [-5, -5],
    ['3.7', 3],        // parseInt trunca decimais
    [3.9, 3],
  ])('deve converter %p em %p', (input, expected) => {
    expect(toIntOrNull(input)).toBe(expected)
  })

  it.each([
    [undefined],
    [null],
    [''],
    ['abc'],
    ['NaN'],
  ])('deve devolver null para %p', (input) => {
    expect(toIntOrNull(input)).toBeNull()
  })
})

describe('toFloatOrNull', () => {
  it.each([
    ['1.5', 1.5],
    ['10', 10],
    [3.14, 3.14],
    [0, 0],
    [-2.5, -2.5],
  ])('deve converter %p em %p', (input, expected) => {
    expect(toFloatOrNull(input)).toBe(expected)
  })

  it.each([
    [undefined],
    [null],
    [''],
    ['abc'],
  ])('deve devolver null para %p', (input) => {
    expect(toFloatOrNull(input)).toBeNull()
  })
})
