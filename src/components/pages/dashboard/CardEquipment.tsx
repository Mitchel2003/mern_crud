import { Card, CardContent, CardHeader, CardTitle } from '#/ui/card'
import { Equipment } from '@/types/task/dashboard.type'
import { Badge } from '#/ui/badge'
import React from 'react'

interface CardEquipmentProps { equipment: Equipment }

const CardEquipment: React.FC<CardEquipmentProps> = ({ equipment }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{equipment.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative mb-4">
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-sm mb-2">{equipment.status}</p>
        <Badge variant="secondary">
          Próximo mantenimiento: {equipment.nextMaintenance.toLocaleDateString()}
        </Badge>
      </CardContent>
    </Card>
  )
}

export default CardEquipment