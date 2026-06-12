const { buildGenreAffinity, normalize, computeScore } = require('../src/services/scoring')

describe('buildGenreAffinity', () => {
  test('calcula ≈1.44 para Sci-Fi con 8 likes y 2 dislikes (≥5 swipes)', () => {
    const swipes = []
    for (let i = 0; i < 8; i++) swipes.push({ genres: ['Sci-Fi'], action: 'like' })
    for (let i = 0; i < 2; i++) swipes.push({ genres: ['Sci-Fi'], action: 'dislike' })
    expect(buildGenreAffinity(swipes)['Sci-Fi']).toBeCloseTo(1.44, 2)
  })

  test('excluye Drama cuando tiene <5 swipes', () => {
    const swipes = [
      { genres: ['Drama'], action: 'like' },
      { genres: ['Drama'], action: 'like' },
      { genres: ['Drama'], action: 'dislike' },
    ]
    expect(buildGenreAffinity(swipes)).not.toHaveProperty('Drama')
  })

  test('retorna objeto vacío para array vacío', () => {
    expect(buildGenreAffinity([])).toEqual({})
  })

  test('retorna objeto vacío si ningún género alcanza 5 swipes', () => {
    const swipes = [
      { genres: ['A'], action: 'like' },
      { genres: ['B'], action: 'dislike' },
    ]
    expect(buildGenreAffinity(swipes)).toEqual({})
  })

  test('multiplica correctamente varios géneros en un mismo swipe', () => {
    const swipes = [
      { genres: ['Action', 'Sci-Fi'], action: 'like' },
      { genres: ['Action', 'Sci-Fi'], action: 'like' },
      { genres: ['Action', 'Sci-Fi'], action: 'like' },
      { genres: ['Action', 'Sci-Fi'], action: 'like' },
      { genres: ['Action', 'Sci-Fi'], action: 'like' },
    ]
    const result = buildGenreAffinity(swipes)
    expect(result['Action']).toBeCloseTo(1.6, 2)
    expect(result['Sci-Fi']).toBeCloseTo(1.6, 2)
  })

  test('valores borde: 5 likes de 5 = 1.6, 0 likes de 5 = 0.8', () => {
    const allLikes = Array.from({ length: 5 }, () => ({ genres: ['A'], action: 'like' }))
    expect(buildGenreAffinity(allLikes)['A']).toBeCloseTo(1.6, 2)

    const allDislikes = Array.from({ length: 5 }, () => ({ genres: ['B'], action: 'dislike' }))
    expect(buildGenreAffinity(allDislikes)['B']).toBeCloseTo(0.8, 2)
  })
})
