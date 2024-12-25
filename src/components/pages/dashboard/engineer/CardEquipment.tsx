import { Card, CardContent, CardHeader, CardTitle } from '#/ui/card'
import { Equipment } from '@/interfaces/props.interface'
import { Badge } from '#/ui/badge'

interface CardEquipmentProps { equipment: Equipment }
const CardEquipment = ({ equipment }: CardEquipmentProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{equipment.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            className="w-full h-[200px] object-cover rounded-md"
          />
        </div>
        <p className="text-lg mb-2">{equipment.status}</p>
        <Badge variant="secondary">
          Próximo mantenimiento: {equipment.nextMaintenance.toLocaleDateString()}
        </Badge>
      </CardContent>
    </Card>
  )
}

export default CardEquipment