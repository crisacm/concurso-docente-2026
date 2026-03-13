'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

export interface RadarDataPoint {
  subject: string
  score: number
}

interface DashboardChartProps {
  data: RadarDataPoint[]
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <PolarGrid stroke="currentColor" className="opacity-10" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fontWeight: 700, fill: 'currentColor' }}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="score"
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.25}
          dot={{ r: 3, fill: 'var(--color-primary)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
