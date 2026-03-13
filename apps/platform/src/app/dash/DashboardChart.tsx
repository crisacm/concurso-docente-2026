'use client'

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

export interface ChartDataPoint {
  name: string
  score: number
  fill: string
}

interface DashboardChartProps {
  data: ChartDataPoint[]
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <div className="flex flex-col">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            data={data}
          >
            <RadialBar
              dataKey="score"
              cornerRadius={8}
              background={{ fill: 'transparent' }}
              maxBarSize={14}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full border border-foreground/30"
              style={{ backgroundColor: d.fill }}
            />
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              {d.name} {d.score}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
