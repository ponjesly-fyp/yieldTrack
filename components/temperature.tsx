/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Thermometer } from 'lucide-react'
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
} from "recharts"
interface props{
    r_temp:number
}
const TemperatureChart = ({r_temp}:props) => {
    const temperatureData = [
        { time: "00:00", value: 22 },
        { time: "04:00", value: 28 },
        { time: "08:00", value: 23 },
        { time: "12:00", value: 26 },
        { time: "16:00", value: 32 },
        { time: "20:00", value: 24 },
        { time: "24:00", value: 22 },
    ]
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <Thermometer className="h-4 w-4 text-[#FE7743]" />
                        <CardTitle className="text-base font-medium">Temperature</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">Optimal range: 20-25°C</p>
                </div>
                <div className="text-2xl font-bold">
                    {r_temp}
                    <span className="text-sm text-white ml-1">°C</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[120px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                            data={temperatureData}
                            margin={{ top: 5, right: 10, left: -40, bottom: 0 }}
                        >
                            <YAxis dataKey="value" tick={{ fontSize: 10 }} stroke="#888888" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10 }}
                                stroke="#888888"
                                allowDuplicatedCategory={false}
                                interval={0}
                                tickFormatter={(time) => (time === '0:00' ? '0:00' : time)}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                                                        <span className="font-bold text-xs">{payload[0].payload.time}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Temperature</span>
                                                        <span className="font-bold text-xs">{payload[0].value}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#FE7743"
                                strokeWidth={2}
                                dot={{
                                    r: 2,
                                    fill: "#FE7743",
                                }}
                                activeDot={{ r: 4 }}
                            />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default TemperatureChart