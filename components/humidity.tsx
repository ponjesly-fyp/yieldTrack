/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Droplets, Thermometer } from 'lucide-react'
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
    r_humidity:number
}
const HumidityChart = ({r_humidity}:props) => {
    const humidityData = [
        { time: "00:00", value: 65 },
        { time: "04:00", value: 68 },
        { time: "08:00", value: 62 },
        { time: "12:00", value: 55 },
        { time: "16:00", value: 58 },
        { time: "20:00", value: 60 },
        { time: "24:00", value: 63 },
    ]
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <Droplets className="h-4 w-4 text-[#3D90D7]" />
                        <CardTitle className="text-base font-medium">Humidity</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">Optimal range: 50-70%</p>
                </div>
                <div className="text-2xl font-bold">
                    {r_humidity}
                    <span className="text-sm text-white ml-1">%</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[120px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                            data={humidityData}
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
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">CO2 level</span>
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
                                stroke="#3D90D7"
                                strokeWidth={2}
                                dot={{
                                    r: 2,
                                    fill: "#3D90D7",
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

export default HumidityChart