import { CardDay as CardDayType } from '@/types/task/dashboard.type'
import { Card, CardContent } from '#/ui/card'
import { Badge } from '#/ui/badge'
import React from 'react'

interface CardDayProps { day: CardDayType }

const CardDay: React.FC<CardDayProps> = ({ day }) => {
  const hasEvents = day.events.length > 0
  const criticalEvent = day.events.find(event => event.importance === 'critical')
  const warningEvent = day.events.find(event => event.importance === 'warning')

  const getBgColor = () => {
    if (criticalEvent) return 'bg-red-100 dark:bg-red-900'
    if (warningEvent) return 'bg-yellow-100 dark:bg-yellow-900'
    if (hasEvents) return 'bg-green-100 dark:bg-green-900'
    return 'bg-gray-100 dark:bg-gray-800'
  }

  return (
    <Card className={`${getBgColor()} transition-colors duration-200 hover:shadow-lg`}>
      <CardContent className="p-4">
        <div className="font-bold text-lg mb-2">{day.date.getDate()}</div>
        {day.events.map((event, index) => (
          <Badge
            key={index}
            variant={event.importance === 'critical' ? 'destructive' : event.importance === 'normal' ? 'default' : 'secondary'}
            className="mr-2 mb-2"
          >
            {event.description}
          </Badge>
        ))}
      </CardContent>
    </Card>
  )
}

export default CardDay

