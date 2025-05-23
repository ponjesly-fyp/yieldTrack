/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Bot } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoogleGenerativeAI } from "@google/generative-ai"
interface predictionProps {
    temperature: number
    humidity: number
    co2: number
    moisture: number
}
export default function PredictionDashboard({ temperature, humidity, co2, moisture }: predictionProps) {
    const [formData, setFormData] = useState({
        cropType: "",
        cropName: "",
        fieldArea: 0,
        soilType: "",
        fertilizerUsed: "",
        previousCrop: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [predictionData, setPredictionData] = useState<null | {
        yieldEstimate: "High" | "Medium" | "Low"
        expectedYieldInKg: number
        advice: string
        AlternativeCrops: string[]
        estimatedYield: string
        confidence: number
        recommendations: string[]
    }>(null)

    const handlePredict = () => {
        setIsLoading(true)
        // console.log(formData)
        try {
            generateYieldPrediction({ temperature, humidity, co2, moisture })
        } catch (error) {
            console.error("Issue in Gemini Intergartion")
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }

    const gemini = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
    const aiModel = gemini.getGenerativeModel({ model: "gemini-2.0-flash" })
    const generateYieldPrediction = async ({ temperature, humidity, co2, moisture }: predictionProps) => {
        const prompt = `
            You are an agricultural expert AI. Based on the following environmental and field parameters, predict the crop yield and provide farming insights:

            Temperature: ${temperature}°C  
            Humidity: ${humidity}%  
            CO₂: ${co2} ppm  
            Moisture: ${moisture}%  
            Crop Type: ${formData.cropType}  
            Crop Name: ${formData.cropName}  
            Field Area: ${formData.fieldArea} acres  
            Soil Type: ${formData.soilType}  
            Fertilizer Used: ${formData.fertilizerUsed}  
            Previous Crop: ${formData.previousCrop}  

            Respond with a JSON object strictly in the following format:
            {
            "yieldEstimate": "number (in tons/acre)",
            "expectedYieldInKg": number,
            "advice": "short string",
            "AlternativeCrops": ["string", "string"],
            "estimatedYield": "string",
            "confidence": number (between 0 and 100),
            "recommendations": ["string", "string", "string"]
            }
            Return only the JSON with no extra explanation.
            `;

        const result = await aiModel.generateContent(prompt)
        const jsonString = await result.response.text();
        const cleaned = jsonString.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1')
        const jsonData = JSON.parse(cleaned)
        setPredictionData({
            yieldEstimate: jsonData.yieldEstimate,
            expectedYieldInKg: jsonData.expectedYieldInKg,
            advice: jsonData.advice,
            AlternativeCrops: jsonData.AlternativeCrops,
            estimatedYield: jsonData.estimatedYield,
            confidence: jsonData.confidence,
            recommendations: jsonData.recommendations
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Prediction Form Card */}
                <Card className="bg-transparent text-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-white">Prediction</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cropType" className="mb-3">Crop Type</Label>
                            <Select
                                value={formData.cropType}
                                onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                            >
                                <SelectTrigger id="cropType" className="bg-gray-900 w-full">
                                    <SelectValue placeholder="Select crop type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900">
                                    <SelectItem value="cereal">Cereal</SelectItem>
                                    <SelectItem value="vegetable">Vegetable</SelectItem>
                                    <SelectItem value="fruit">Fruit</SelectItem>
                                    <SelectItem value="pulse">Pulse</SelectItem>
                                    <SelectItem value="oilseed">Oilseed</SelectItem>
                                    <SelectItem value="fiber">Fiber</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cropName" className="mb-3">Crop Name</Label>
                            <Input
                                id="cropName"
                                name="cropName"
                                value={formData.cropName}
                                onChange={handleInputChange}
                                placeholder="e.g Wheat"
                                className="bg-gray-900 focus-visible:ring-1 focus-visible:ring-gray-500/60 focus:border-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fieldArea" className="mb-3">Field Area (in acres)</Label>
                            <Input id="fieldArea" name="fieldArea" type="number" placeholder="e.g 2.5" className="bg-gray-900 focus-visible:ring-1 focus-visible:ring-gray-500/60 focus:border-0"
                                value={formData.fieldArea}
                                onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="soilType" className="mb-3">Soil Type</Label>
                            <Select
                                value={formData.soilType}
                                onValueChange={(value) => { setFormData({ ...formData, soilType: value }) }}
                            >
                                <SelectTrigger id="soilType" className="bg-gray-900 w-full">
                                    <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900">
                                    <SelectItem value="sandy">Sandy</SelectItem>
                                    <SelectItem value="clay">Clay</SelectItem>
                                    <SelectItem value="silt">Silt</SelectItem>
                                    <SelectItem value="loam">Loam</SelectItem>
                                    <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                                    <SelectItem value="clay-loam">Clay Loam</SelectItem>
                                    <SelectItem value="silty-loam">Silty Loam</SelectItem>
                                    <SelectItem value="peat">Peat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fertilizerUsed" className="mb-3">Fertilizer Used</Label>
                            <Select
                                value={formData.fertilizerUsed}
                                onValueChange={(value) => { setFormData({ ...formData, fertilizerUsed: value }) }}
                            >
                                <SelectTrigger id="fertilizerUsed" className="bg-gray-900 w-full">
                                    <SelectValue placeholder="Select fertilizer type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900">
                                    <SelectItem value="organic">Organic</SelectItem>
                                    <SelectItem value="chemical">Chemical</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="previousCrop" className="mb-3">Previous Crop Grown</Label>
                            <Input id="previousCrop" placeholder="e.g., Rice" className="bg-gray-900 focus-visible:ring-1 focus-visible:ring-gray-500/60 focus:border-0"
                                name="previousCrop"
                                value={formData.previousCrop}
                                onChange={handleInputChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 transform hover:scale-[1.02] font-semibold"
                            onClick={handlePredict}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Predict Yield"
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Prediction Results Card */}
                <Card className="bg-transparent text-white shadow-lg h-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-white">
                            <div className="flex flex-row gap-2">
                                <Bot className="h-8 w-8 mb-5 text-emerald-500" />
                                <h1>Prediction Results</h1>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        {predictionData ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Estimated Yield</p>
                                        <p className="text-2xl font-bold text-emerald-400">{predictionData.estimatedYield}</p>
                                    </div>
                                    <div className="bg-zinc-900 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Confidence</p>
                                        <p className="text-2xl font-bold text-emerald-400">{predictionData.confidence}%</p>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Expected Yield in Kg</p>
                                    <p className="text-xl font-bold text-emerald-400">{predictionData.expectedYieldInKg} kg</p>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg">
                                    <p className="text-gray-300 font-medium">Expert Advice:</p>
                                    <p className="text-gray-200 mt-1">{predictionData.advice}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-300 font-medium">Recommendations:</p>
                                    <ul className="space-y-2">
                                        {predictionData.recommendations.map((rec, index) => (
                                            <li key={index} className="bg-zinc-900 p-3 rounded-lg text-gray-200 flex items-start">
                                                <span className="bg-emerald-900 text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                                                    {index + 1}
                                                </span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-300 font-medium">Alternative Crops:</p>
                                    <ul className="space-y-2">
                                        {predictionData.AlternativeCrops.map((crop, index) => (
                                            <li key={index} className="bg-zinc-900 p-3 rounded-lg text-gray-200 flex items-start">
                                                <span className="bg-yellow-900 text-yellow-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                                                    {index + 1}
                                                </span>
                                                {crop}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
                                <div className="bg-zinc-900 rounded-full p-6">
                                    <Bot className="h-16 w-16 text-emerald-500 opacity-70" />
                                </div>
                                <h3 className="text-xl font-medium text-white">No Prediction Data Yet</h3>
                                <p className="text-gray-400 text-center max-w-xs">
                                    Fill out the form and click &quot;Predict Yield&quot; to see crop yield predictions and recommendations
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
