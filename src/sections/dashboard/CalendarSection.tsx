import { EventMaintenance, CardDay as ICardDay } from '@/types/dashboard.type'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CardDay from '#/pages/dashboard/CardDay'
import useCalendar from '@/hooks/ui/useCalendar'
import { Button } from '#/ui/button'
import { cn } from '@/lib/utils'

interface MaintenanceCalendarProps extends ThemeContextProps { events: EventMaintenance[] }
const MaintenanceCalendar = ({ events, theme }: MaintenanceCalendarProps) => {
  const { daysInMonth, currentMonth, nextMonth, prevMonth } = useCalendar(events)
  return (

    <div
      className={cn(
        'flex items-center space-y-4',
        'rounded-xl transition-colors duration-200',
        theme === 'dark'
          ? 'bg-zinc-800/70 hover:bg-zinc-800/90'
          : 'bg-purple-200/80 hover:bg-purple-300/80'
      )}
    >
      <CalendarHeader
        currentMonth={currentMonth}
        onNext={nextMonth}
        onPrev={prevMonth}
      />
      <CalendarGrid days={daysInMonth} />
    </div>
  )
}

export default MaintenanceCalendar

/*--------------------------------------------------tools--------------------------------------------------*/
/** CalendarHeader: Componente para el encabezado del calendario */
interface CalendarHeaderProps { currentMonth: Date; onNext: () => void; onPrev: () => void }
const CalendarHeader = ({ currentMonth, onNext, onPrev }: CalendarHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        Calendario de Mantenimiento
      </h2>
      <MonthNavigator
        currentMonth={currentMonth}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  )
}

/** MonthNavigator: Controles de navegación del mes */
interface MonthNavigatorProps { currentMonth: Date; onNext: () => void; onPrev: () => void }
const MonthNavigator = ({ currentMonth, onNext, onPrev }: MonthNavigatorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <NavigationButton onClick={onPrev} direction="prev" />
      <span className="text-lg font-semibold min-w-32 text-center">
        {currentMonth.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })}
      </span>
      <NavigationButton onClick={onNext} direction="next" />
    </div>
  )
}

/** NavigationButton: Botón de navegación reutilizable */
interface NavigationButtonProps { onClick: () => void; direction: 'prev' | 'next' }
const NavigationButton = ({ onClick, direction }: NavigationButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="icon"
      className={cn(
        'transition-colors duration-200',
        'hover:bg-primary/10'
      )}
    >
      {direction === 'prev'
        ? <ChevronLeft className="h-4 w-4" />
        : <ChevronRight className="h-4 w-4" />
      }
    </Button>
  )
}

/** CalendarGrid: Cuadrícula de días del calendario */
interface CalendarGridProps { days: ICardDay[] }
const CalendarGrid = ({ days }: CalendarGridProps) => {
  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day, index) => (
        <CardDay key={index} day={day} />
      ))}
    </div>
  )
}