import { EventMaintenance } from '@/types/task/dashboard.type'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useCalendar from '@/hooks/useCalendar'
import CardDay from '@/components/pages/dashboard/CardDay'
import { Button } from '#/ui/button'
import React from 'react'

interface MaintenanceCalendarProps { events: EventMaintenance[] }

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ events }) => {
  const { daysInMonth, currentMonth, nextMonth, prevMonth } = useCalendar(events);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendario de Mantenimiento</h2>
        <div className="flex space-x-2">
          <Button onClick={prevMonth} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button onClick={nextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {daysInMonth.map((day, index) => (
          <CardDay key={index} day={day} />
        ))}
      </div>
    </div>
  )
}

export default MaintenanceCalendar