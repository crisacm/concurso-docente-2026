import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: vi.fn(() => ({ push: vi.fn() })) }))
vi.mock('@/utils/supabase/client', () => ({ createClient: vi.fn(() => ({})) }))

import { getPerformanceLevel } from './ResultPageClient'

describe('getPerformanceLevel', () => {
  it('returns Alta for pct >= 75', () => {
    expect(getPerformanceLevel(75)).toBe('Alta')
    expect(getPerformanceLevel(100)).toBe('Alta')
    expect(getPerformanceLevel(80)).toBe('Alta')
  })

  it('returns Media for pct >= 50 and < 75', () => {
    expect(getPerformanceLevel(50)).toBe('Media')
    expect(getPerformanceLevel(74)).toBe('Media')
    expect(getPerformanceLevel(60)).toBe('Media')
  })

  it('returns Baja for pct < 50', () => {
    expect(getPerformanceLevel(0)).toBe('Baja')
    expect(getPerformanceLevel(49)).toBe('Baja')
    expect(getPerformanceLevel(25)).toBe('Baja')
  })
})

describe('AreaCard pct calculation', () => {
  it('calculates percentage correctly', () => {
    const pct = (correct: number, total: number) =>
      total > 0 ? Math.round((correct / total) * 100) : 0

    expect(pct(8, 10)).toBe(80)
    expect(pct(3, 4)).toBe(75)
    expect(pct(1, 3)).toBe(33)
    expect(pct(0, 10)).toBe(0)
    expect(pct(0, 0)).toBe(0)
  })
})
