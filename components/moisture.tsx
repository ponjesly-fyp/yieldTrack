import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Droplet } from 'lucide-react'
import { Progress } from './ui/progress'
interface props{
    r_moisture:number
}
const MoistureData = ({r_moisture}:props) => {
    return (
        <Card className="w-full h-auto">
            <CardHeader className="flex justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <Droplet className="h-4 w-4 text-[#64E2B7]" />
                        <CardTitle className="text-base font-medium">Soil Moisture</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">Optimal range: 60-80%</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Field 1</span>
                        <span>{r_moisture}%</span>
                    </div>
                    <Progress value={r_moisture} className="h-2 bg-muted" />
                    <div className="flex items-center justify-between text-sm">
                        <span>Field 2</span>
                        <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-muted" />
                </div>
            </CardContent>
        </Card>
    )
}

export default MoistureData