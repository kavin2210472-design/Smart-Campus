
"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { HistoricalDataPoint } from "@/lib/types"

type ZoneChartProps = {
  data: HistoricalDataPoint[]
  dataKey: keyof Omit<HistoricalDataPoint, "timestamp">
  name: string
  color: string
}

export default function ZoneChart({ data, dataKey, name, color }: ZoneChartProps) {
  const chartData = data.map(d => ({
    timestamp: d.timestamp,
    value: d[dataKey],
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 0,
        }}
      >
        <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
        <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={60}
        />
        <YAxis 
            yAxisId="left" 
            orientation="left" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={40}
        />
        <Tooltip
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
            labelFormatter={(label) => new Date(label).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
            formatter={(value) => [value.toFixed(1), name]}
        />
        <Area
            yAxisId="left"
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#color-${dataKey})`}
            dot={false}
            activeDot={{ r: 6, style: { fill: color, stroke: '#fff', strokeWidth: 2 } }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
