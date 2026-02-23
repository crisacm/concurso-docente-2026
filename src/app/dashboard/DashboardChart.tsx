'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    {
        name: 'CONTEXTO',
        score: 65,
        color: '#4B88FF',
    },
    {
        name: 'PLANEACIÓN',
        score: 82,
        color: '#3B71FE',
    },
    {
        name: 'PRAXIS',
        score: 45,
        color: '#FF5A79', // Color rojo para oportunidad de mejora
    },
    {
        name: 'AMBIENTE',
        score: 78,
        color: '#3B71FE',
    },
];

export function DashboardChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: -20,
                    bottom: 5,
                }}
                barSize={40}
            >
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700, dy: 10 }}
                />
                <YAxis hide={true} />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1E293B',
                    }}
                    itemStyle={{ color: '#1E293B' }}
                />
                <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
