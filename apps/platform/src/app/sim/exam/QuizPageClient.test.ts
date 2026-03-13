import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: vi.fn(() => ({ push: vi.fn() })) }))
vi.mock('@/utils/supabase/client', () => ({ createClient: vi.fn(() => ({})) }))
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

import { computeDistribution } from './QuizPageClient'

describe('computeDistribution', () => {
  it('distributes 25 as [9, 8, 8]', () => {
    expect(computeDistribution(25)).toEqual([9, 8, 8])
  })

  it('distributes 30 as [10, 10, 10]', () => {
    expect(computeDistribution(30)).toEqual([10, 10, 10])
  })

  it('distributes 10 as [4, 3, 3]', () => {
    expect(computeDistribution(10)).toEqual([4, 3, 3])
  })

  it('distributes 3 as [1, 1, 1]', () => {
    expect(computeDistribution(3)).toEqual([1, 1, 1])
  })

  it('distributes 1 as [1, 0, 0]', () => {
    expect(computeDistribution(1)).toEqual([1, 0, 0])
  })

  it('total of returned values equals the input', () => {
    for (const n of [5, 10, 15, 20, 25, 30]) {
      const [a, b, c] = computeDistribution(n)
      expect(a + b + c).toBe(n)
    }
  })
})
