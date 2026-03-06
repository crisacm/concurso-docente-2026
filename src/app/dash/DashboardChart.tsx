'use client'

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'CONTEXTO',   score: 65, fill: '#4B88FF' },
  { name: 'PLANEACIÓN', score: 82, fill: '#7C3AED' },
  { name: 'PRAXIS',     score: 45, fill: '#FF5A79' },
  { name: 'AMBIENTE',   score: 78, fill: '#06B6D4' },
]

export function DashboardChart() {
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
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: d.fill }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {d.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
