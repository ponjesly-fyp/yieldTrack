/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from 'react'
import { Bell, Droplet, Droplets, Leaf, Thermometer, Timer, Wind, BarChart, LineChart, WindIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bubbles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import TemperatureChart from "./temperature"
import HumidityChart from "./humidity"
import Co2Chart from "./co2"
import MoistureData from "./moisture"
import IrrigationControl from "./irrigation-control"

const cropYieldData = [
  { name: "Wheat", current: 85, previous: 70 },
  { name: "Corn", current: 75, previous: 80 },
  { name: "Soybeans", current: 90, previous: 75 },
  { name: "Rice", current: 65, previous: 60 },
]

const profitData = [
  { name: "Jan", wheat: 4000, corn: 2400, soybeans: 2400 },
  { name: "Feb", wheat: 3000, corn: 1398, soybeans: 2210 },
  { name: "Mar", wheat: 2000, corn: 9800, soybeans: 2290 },
  { name: "Apr", wheat: 2780, corn: 3908, soybeans: 2000 },
  { name: "May", wheat: 1890, corn: 4800, soybeans: 2181 },
  { name: "Jun", wheat: 2390, corn: 3800, soybeans: 2500 },
  { name: "Jul", wheat: 3490, corn: 4300, soybeans: 2100 },
  { name: "Aug", wheat: 4000, corn: 2400, soybeans: 3100 },
  { name: "Sep", wheat: 2780, corn: 3908, soybeans: 2800 },
  { name: "Oct", wheat: 1890, corn: 4800, soybeans: 2500 },
  { name: "Nov", wheat: 2390, corn: 3800, soybeans: 1800 },
  { name: "Dec", wheat: 3490, corn: 2300, soybeans: 2100 },
]

const notifications = [
  {
    id: 1,
    title: "Low Soil Moisture",
    time: "10 minutes ago",
    severity: "high",
  },
  {
    id: 2,
    title: "Temperature Alert",
    time: "1 hour ago",
    severity: "medium",
  },
  {
    id: 3,
    title: "Ammonia Levels Rising",
    time: "2 hours ago",
    severity: "high",
  },
  {
    id: 4,
    title: "Irrigation Completed",
    time: "5 hours ago",
    severity: "low",
  },
  {
    id: 5,
    title: "Crop Rotation Reminder",
    time: "1 day ago",
    severity: "medium",
  },
]

export default function Dashboard() {
  const [temp, setTemp] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [co2Level, setCo2Level] = useState(0)
  const [moisture, setMoisture] = useState(0)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      const response = await fetch(`https://plant-monitoring-3ba31-default-rtdb.asia-southeast1.firebasedatabase.app/.json`);
      const data = await response.json();
      setTemp(data.temperature)
      setMoisture(data.moisture)
      setCo2Level(data.gas)
      setHumidity(data.humidity)
    };
    const startPolling = () => {
      fetchData(); // fetch immediately
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchData();
        }
      }, 5000);
    };
    const stopPolling = () => {
      clearInterval(interval);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startPolling();
      } else {
        stopPolling();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startPolling();
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-500" />
          <h1 className="text-xl font-semibold">YieldTrack</h1>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex overflow-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* DHT11 Sensor Card - Temperature */}
          <TemperatureChart r_temp={temp}/>
          {/* DHT11 Sensor Card - Humidity */}
          <HumidityChart r_humidity={humidity}/>
          {/* CO2 level */}
          <Co2Chart r_co2={co2Level}/>
          {/* Soil Moisture Card */}
          <div className='col-span-2'>
            <MoistureData r_moisture={moisture}/>
            {/* Irrigation Control Panel */}
          </div>
          <IrrigationControl />
          {/* Historical Comparison Panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-green-500" />
                <CardTitle>Historical Yield Comparison</CardTitle>
              </div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={cropYieldData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Crop</span>
                                  <span className="font-bold">{payload[0].payload.name}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Current</span>
                                  <span className="font-bold">{payload[0].payload.current} bu/acre</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Previous</span>
                                  <span className="font-bold">{payload[0].payload.previous} bu/acre</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Change</span>
                                  <span
                                    className={`font-bold ${payload[0].payload.current > payload[0].payload.previous ? "text-green-500" : "text-red-500"}`}
                                  >
                                    {(
                                      ((payload[0].payload.current - payload[0].payload.previous) /
                                        payload[0].payload.previous) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="current" name="Current Season" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="previous" name="Previous Season" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Panel */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                <CardTitle>Alerts & Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='overflow-y-auto'>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex gap-3 rounded-lg border p-3">
                      <div
                        className={`mt-0.5 rounded-full h-7 w-7 flex items-center justify-center p-1 ${notification.severity === "high"
                          ? "bg-red-500/10 text-red-500"
                          : notification.severity === "medium"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-green-500/10 text-green-500"
                          }`}
                      >
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Profit Forecast Chart */}
          <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                <CardTitle>Profit Forecast</CardTitle>
              </div>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={profitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888888" />
                        <YAxis stroke="#888888" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                                      <span className="font-bold">{payload[0].payload.name}</span>
                                    </div>
                                    {payload.map((entry) => (
                                      <div key={entry.dataKey} className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          {entry.dataKey}
                                        </span>
                                        <span className="font-bold" style={{ color: entry.color }}>
                                          ${entry.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Legend />
                        <Bar dataKey="wheat" name="Wheat" stackId="a" fill="#4ade80" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="corn" name="Corn" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="soybeans" name="Soybeans" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="table">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 border-b px-4 py-2 font-medium">
                      <div>Month</div>
                      <div>Wheat</div>
                      <div>Corn</div>
                      <div>Soybeans</div>
                    </div>
                    {profitData.map((item) => (
                      <div key={item.name} className="grid grid-cols-4 border-b px-4 py-2 last:border-0">
                        <div>{item.name}</div>
                        <div>${item.wheat}</div>
                        <div>${item.corn}</div>
                        <div>${item.soybeans}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
