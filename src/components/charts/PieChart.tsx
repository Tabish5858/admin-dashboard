'use client'

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    color?: string
  }>
  title?: string
  subtitle?: string
  colors?: string[]
}

export default function PieChart({
  data,
  title,
  subtitle,
  colors = ['#4f46e5', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']
}: PieChartProps) {
  const defaultColors = data.map((item, index) =>
    item.color || colors[index % colors.length]
  )

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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              animationDuration={750}
              animationBegin={0}
              animationEasing="ease-out"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={defaultColors[index]} stroke="var(--card-background)" strokeWidth={2} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '6px',
                backgroundColor: 'var(--card-background)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)'
              }}
              formatter={(value: number, name: string) => [
                `${value} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
                name
              ]}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
