/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Bell, Droplet, Droplets, Leaf, Thermometer, Timer, Wind, BarChart, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

// Sample data for charts
const temperatureData = [
  { time: "00:00", value: 22 },
  { time: "04:00", value: 21 },
  { time: "08:00", value: 23 },
  { time: "12:00", value: 26 },
  { time: "16:00", value: 25 },
  { time: "20:00", value: 24 },
  { time: "24:00", value: 22 },
]

const humidityData = [
  { time: "00:00", value: 65 },
  { time: "04:00", value: 68 },
  { time: "08:00", value: 62 },
  { time: "12:00", value: 55 },
  { time: "16:00", value: 58 },
  { time: "20:00", value: 60 },
  { time: "24:00", value: 63 },
]

const soilMoistureData = [
  { name: "Field 1", value: 68 },
  { name: "Field 2", value: 75 },
  { name: "Field 3", value: 42 },
]

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

type FieldKey = 'field1' | 'field2' | 'field3';

export default function Dashboard() {
  const [irrigationStatus, setIrrigationStatus] = useState<Record<FieldKey, boolean>>({
    field1: false,
    field2: false,
    field3: true,
  })
  const [autoIrrigation, setAutoIrrigation] = useState(true)

  const toggleIrrigation = (field: FieldKey) => {
    setIrrigationStatus((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

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
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* DHT11 Sensor Card - Temperature */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24°C</div>
              <p className="text-xs text-muted-foreground">Optimal range: 20-25°C</p>
              <div className="h-[120px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={temperatureData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#888888" tickLine={false} axisLine={false} />
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
                                  <span className="font-bold text-xs">{payload[0].value}°C</span>
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
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* DHT11 Sensor Card - Humidity */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62%</div>
              <p className="text-xs text-muted-foreground">Optimal range: 50-70%</p>
              <div className="h-[120px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={humidityData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#888888" tickLine={false} axisLine={false} />
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
                    <Area type="monotone" dataKey="value" stroke="#60a5fa" fill="url(#colorHumidity)" strokeWidth={2} />
                    <defs>
                      <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Soil Moisture Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Soil Moisture</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">68%</div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Optimal
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Optimal range: 60-80%</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Field 1</span>
                  <span>68%</span>
                </div>
                <Progress value={68} className="h-2 bg-muted" />

                <div className="flex items-center justify-between text-sm">
                  <span>Field 2</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2 bg-muted" />

                <div className="flex items-center justify-between text-sm">
                  <span>Field 3</span>
                  <span className="text-amber-500">42%</span>
                </div>
                <Progress value={42} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* Gas Detection Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Gas Detection</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ammonia</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={25} className="h-2 bg-muted" />
                    <span className="text-xs">25 ppm</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Methane</span>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                      Elevated
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="h-2 bg-muted"/>
                    <span className="text-xs">65 ppm</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CO2</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={40} className="h-2 bg-muted"/>
                    <span className="text-xs">400 ppm</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nitrogen</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={30} className="h-2 bg-muted"/>
                    <span className="text-xs">30 ppm</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Irrigation Control Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <CardTitle>Irrigation Control</CardTitle>
              </div>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Automated Irrigation</span>
                  </div>
                  <Switch
                    checked={autoIrrigation}
                    onCheckedChange={setAutoIrrigation}
                    aria-label="Toggle automated irrigation"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Field 1</span>
                      <Badge
                        variant={irrigationStatus.field1 ? "default" : "outline"}
                        className={irrigationStatus.field1 ? "bg-blue-500" : ""}
                      >
                        {irrigationStatus.field1 ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    <Button
                      variant={irrigationStatus.field1 ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleIrrigation("field1")}
                      disabled={autoIrrigation}
                    >
                      {irrigationStatus.field1 ? "Turn Off" : "Turn On"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Field 2</span>
                      <Badge
                        variant={irrigationStatus.field2 ? "default" : "outline"}
                        className={irrigationStatus.field2 ? "bg-blue-500" : ""}
                      >
                        {irrigationStatus.field2 ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    <Button
                      variant={irrigationStatus.field2 ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleIrrigation("field2")}
                      disabled={autoIrrigation}
                    >
                      {irrigationStatus.field2 ? "Turn Off" : "Turn On"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Field 3</span>
                      <Badge
                        variant={irrigationStatus.field3 ? "default" : "outline"}
                        className={irrigationStatus.field3 ? "bg-blue-500" : ""}
                      >
                        {irrigationStatus.field3 ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    <Button
                      variant={irrigationStatus.field3 ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleIrrigation("field3")}
                      disabled={autoIrrigation}
                    >
                      {irrigationStatus.field3 ? "Turn Off" : "Turn On"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Automation Status</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {autoIrrigation
                      ? "Automated irrigation is active. System will irrigate when soil moisture drops below 50%."
                      : "Automated irrigation is disabled. Manual control is enabled."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Soil Nutrition Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                <CardTitle>Soil Nutrition</CardTitle>
              </div>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">pH Value</span>
                    <span className="text-xl font-bold">6.8</span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-muted">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/7 bg-red-500 rounded-l-full"></div>
                      <div className="w-1/7 bg-orange-500"></div>
                      <div className="w-1/7 bg-yellow-500"></div>
                      <div className="w-1/7 bg-green-500"></div>
                      <div className="w-1/7 bg-blue-500"></div>
                      <div className="w-1/7 bg-indigo-500"></div>
                      <div className="w-1/7 bg-purple-500 rounded-r-full"></div>
                    </div>
                    <div
                      className="absolute top-0 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-black"
                      style={{ left: "68%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Acidic (0)</span>
                    <span>Neutral (7)</span>
                    <span>Alkaline (14)</span>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Nitrogen (N)</span>
                      <span>65 mg/kg</span>
                    </div>
                    <Progress value={65} className="h-2 bg-muted"/>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Phosphorus (P)</span>
                      <span>42 mg/kg</span>
                    </div>
                    <Progress value={42} className="h-2 bg-muted"/>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Potassium (K)</span>
                      <span>78 mg/kg</span>
                    </div>
                    <Progress value={78} className="h-2 bg-muted"/>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Organic Matter</span>
                      <span>3.2%</span>
                    </div>
                    <Progress value={32} className="h-2 bg-muted"/>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    Soil analysis indicates good overall fertility. Consider phosphorus supplementation for optimal crop
                    growth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex gap-3 rounded-lg border p-3">
                      <div
                        className={`mt-0.5 rounded-full p-1 ${
                          notification.severity === "high"
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
                          {notification.severity === "high" && (
                            <Badge variant="destructive" className="h-5 text-[10px]">
                              Urgent
                            </Badge>
                          )}
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
