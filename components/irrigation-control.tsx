'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Waves } from 'lucide-react';
import { Badge } from './ui/badge'
import { Button } from './ui/button'
type FieldKey = 'field1' | 'field2' | 'field3';
const IrrigationControl = () => {
    const [irrigationStatus, setIrrigationStatus] = useState<Record<FieldKey, boolean>>({
        field1: false,
        field2: false,
        field3: true,
    })
    const toggleIrrigation = (field: FieldKey) => {
        setIrrigationStatus((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-blue-500" />
                    <CardTitle>Irrigation Control</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-3 flex flex-col justify-center">
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
                            >
                                {irrigationStatus.field2 ? "Turn Off" : "Turn On"}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default IrrigationControl