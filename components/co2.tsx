/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Bubbles, Thermometer } from 'lucide-react'
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
    r_co2:number
}
const Co2Chart = ({r_co2}:props) => {
    const co2Data = [
        { time: "00:00", value: 980 },
        { time: "04:00", value: 1020 },
        { time: "08:00", value: 1100 },
        { time: "12:00", value: 1250 },
        { time: "16:00", value: 1300 },
        { time: "20:00", value: 1180 },
        { time: "24:00", value: 1050 },
    ]

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <Bubbles className="h-4 w-4 text-[#4ED7F1]" />
                        <CardTitle className="text-base font-medium">CO2 Level</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">Optimal range: 1k - 1.3k ppm</p>
                </div>
                <div className="text-2xl font-bold">
                    {r_co2}
                    <span className="text-sm text-white ml-1">ppm</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[120px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                            data={co2Data}
                            margin={{ top: 5, right: 10, left: -30, bottom: 0 }}
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
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Humidity</span>
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
                                stroke="#4ED7F1"
                                strokeWidth={2}
                                dot={{
                                    r: 2,
                                    fill: "#4ED7F1",
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

export default Co2Chart