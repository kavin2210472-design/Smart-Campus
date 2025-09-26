"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
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
    <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                fontSize={12}
                tickLine={false}
                axisLine={false}
            />
            <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
            />
            <Tooltip
                cursor={{ stroke: color, strokeWidth: 1.5, strokeDasharray: "3 3" }}
                content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                        return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">{name}</span>
                                    <span className="font-bold text-foreground">{payload[0].value.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                                    <span className="font-bold text-muted-foreground">
                                    {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        )
                    }
                    return null
                }}
            />
            <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
            />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
