'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface LineChartProps {
  data: any[]
  lines: Array<{
    dataKey: string
    color: string
    name?: string
  }>
  xAxisKey?: string
  title?: string
  subtitle?: string
}

export default function LineChart({
  data,
  lines,
  xAxisKey = 'name',
  title,
  subtitle
}: LineChartProps) {
  return (
    <div className="h-full w-full bg-card-background p-6 rounded-lg shadow-sm">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
          >
            <defs>
              {lines.map((line) => (
                <linearGradient key={line.dataKey} id={`color-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} stroke="var(--border)" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '6px',
                backgroundColor: 'var(--card-background)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)'
              }}
              labelStyle={{ marginBottom: '4px', fontWeight: 'bold', color: 'var(--foreground)' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
            />
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                activeDot={{ r: 6, fill: line.color, stroke: 'var(--card-background)' }}
                name={line.name || line.dataKey}
                strokeWidth={2}
                dot={{ fill: line.color, stroke: 'var(--card-background)', strokeWidth: 2 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
