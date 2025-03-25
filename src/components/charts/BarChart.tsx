'use client'

import { useState } from 'react'
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface BarChartProps {
  data: any[]
  dataKey: string
  nameKey?: string
  barColor?: string
  title?: string
  subtitle?: string
}

export default function BarChart({
  data,
  dataKey,
  nameKey = 'name',
  barColor = '#4f46e5',
  title,
  subtitle
}: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
          <RechartsBarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            onMouseMove={(data) => {
              if (data?.activeTooltipIndex !== undefined) {
                setActiveIndex(data.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
            <XAxis
              dataKey={nameKey}
              tick={{ fontSize: 12, fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: 'var(--secondary)' }}
              contentStyle={{
                borderRadius: '6px',
                backgroundColor: 'var(--card-background)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)'
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '4px' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
            />
            <Bar
              dataKey={dataKey}
              fill={barColor}
              radius={[4, 4, 0, 0]}
              className="cursor-pointer"
              fillOpacity={1}
              animationDuration={500}
              isAnimationActive={true}
            />
            {data[0]?.salePrice && (
              <Bar
                dataKey="salePrice"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                className="cursor-pointer"
                fillOpacity={0.8}
                animationDuration={500}
                isAnimationActive={true}
                name="Sale Price"
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
