// Weighted random sampling cumulativo. O(n), aceita pesos fracionários.
// `weightFn`: item → number ≥ 0. Total zero cai pra uniforme.

export const weightedPick = (items, weightFn) => {
  if (items.length === 0) return null
  if (items.length === 1) return items[0]

  const weights = items.map(weightFn)
  const total   = weights.reduce((s, w) => s + w, 0)
  if (total <= 0) return items[Math.floor(Math.random() * items.length)]

  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1] // fallback p/ erro de arredondamento
}
