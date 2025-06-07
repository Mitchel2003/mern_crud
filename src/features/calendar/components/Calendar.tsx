import { ChevronLeft, ChevronRight, Clock, MapPin, Users, Calendar, X, MenuIcon, User } from "lucide-react"
import CalendarEventActions from '@/features/calendar/components/CalendarEventActions'
import { useCalendar } from "@/features/calendar/hooks/useCalendar"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { Separator } from "@/components/ui/separator"
import { Event } from '@/interfaces/props.interface'
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CalendarProps extends ThemeContextProps { isLoading: boolean; events: Event[] }
const CalendarUI = ({ theme, events, isLoading = false }: CalendarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const {
    weekDays,
    monthDays,
    timeSlots,
    currentDate,
    displayDate,
    currentView,
    displayMonth,
    selectedEvent,
    miniCalendarInfo,
    isSameDay,
    goToNext,
    goToToday,
    goToPrevious,
    setCurrentView,
    setCurrentDate,
    setSelectedEvent,
    calculateEventStyle
  } = useCalendar()

  /** handle behavior when an event is clicked */
  const handleEventClick = (event: Event) => { setSelectedEvent(event) }

  if (isLoading) return <div>Loading...</div>
  return (
    <div className="max-w-8xl mx-auto">
      <div className={cn("bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden", theme === "dark" ? "dark" : "")}>
        {/* Header del calendario */}
        <div className={cn("p-4 flex flex-col sm:flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-700")}>
          <div className="flex items-center mb-4 sm:mb-0">
            <button onClick={goToPrevious} className={cn("p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 mr-1", theme === 'dark' ? 'text-white' : 'text-zinc-600')}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={goToNext} className={cn("p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 mr-4", theme === 'dark' ? 'text-white' : 'text-zinc-600')}>
              <ChevronRight className="h-5 w-5" />
            </button>
            <h2 className={cn("text-xl font-semibold", theme === 'dark' ? 'text-white' : 'text-zinc-800')}>
              {currentView === "month" ? displayMonth : displayDate}
            </h2>
          </div>

          <div className="flex items-center">
            <button onClick={goToToday} className={cn("px-3 py-1.5 text-sm font-medium",
              'hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md mr-2',
              theme === 'dark' ? 'text-white' : 'text-zinc-700',
            )}>
              Today
            </button>
            <div className={cn("hidden md:flex space-x-1 bg-zinc-100 dark:bg-zinc-700 rounded-md p-1")}>
              <button onClick={() => setCurrentView("day")} className={cn("px-3 py-1 text-sm font-medium rounded-md", currentView === "day" ? "bg-white dark:bg-zinc-600 shadow" : "text-zinc-700 dark:text-zinc-200")}>
                Day
              </button>
              <button onClick={() => setCurrentView("week")} className={cn("px-3 py-1 text-sm font-medium rounded-md", currentView === "week" ? "bg-white dark:bg-zinc-600 shadow" : "text-zinc-700 dark:text-zinc-200")}>
                Week
              </button>
              <button onClick={() => setCurrentView("month")} className={cn("px-3 py-1 text-sm font-medium rounded-md", currentView === "month" ? "bg-white dark:bg-zinc-600 shadow" : "text-zinc-700 dark:text-zinc-200")}>
                Month
              </button>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={cn("md:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 ml-2", theme === 'dark' ? 'text-white' : 'text-zinc-600')}>
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <div className="flex justify-center space-x-1 p-2">
              <button
                onClick={() => { setCurrentView("day"); setIsMobileMenuOpen(false) }}
                className={cn("px-3 py-1.5 text-sm font-medium rounded-md", currentView === "day" ? "bg-zinc-100 dark:bg-zinc-700" : "text-zinc-700 dark:text-zinc-200")}
              >
                Day
              </button>
              <button
                onClick={() => { setCurrentView("week"); setIsMobileMenuOpen(false) }}
                className={cn("px-3 py-1.5 text-sm font-medium rounded-md", currentView === "week" ? "bg-zinc-100 dark:bg-zinc-700" : "text-zinc-700 dark:text-zinc-200")}
              >
                Week
              </button>
              <button
                onClick={() => { setCurrentView("month"); setIsMobileMenuOpen(false) }}
                className={cn("px-3 py-1.5 text-sm font-medium rounded-md", currentView === "month" ? "bg-zinc-100 dark:bg-zinc-700" : "text-zinc-700 dark:text-zinc-200")}
              >
                Month
              </button>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar con mini calendario */}
          <div className={cn("md:w-64 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-700")}>
            <div className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-medium text-zinc-900 dark:text-white">{displayMonth}</h3>
              </div>
              <div className={cn("grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 dark:text-zinc-400 mb-2")}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (<div key={i}>{day}</div>))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array(miniCalendarInfo.firstDayOffset).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="h-7 w-7"></div>
                ))}
                {miniCalendarInfo.days.filter((day) => day !== null).map((day, i) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day as number)
                  const isToday = isSameDay(date, new Date())
                  const isSelected = isSameDay(date, currentDate)

                  return (
                    <div key={`day-${i}`} onClick={() => setCurrentDate(date)}
                      className={cn(`h-7 w-7 flex items-center justify-center text-xs rounded-full cursor-pointer`,
                        isToday ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "",
                        !isToday && !isSelected ? "hover:bg-zinc-100 dark:hover:bg-zinc-700" : "",
                        isSelected ? "bg-blue-500 text-white" : ""
                      )}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Próximos eventos */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
              <h3 className="font-medium text-zinc-900 dark:text-white mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {events
                  .filter((event) => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3).map((event) => (
                    <div key={event.id} onClick={() => handleEventClick(event)} className="p-2 rounded-md cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700">
                      <div className="flex items-start">
                        <div className={cn(event.color, "w-3 h-3 rounded-full mt-1 mr-2")}></div>
                        <div>
                          <h4 className="font-medium text-zinc-900 dark:text-white text-sm">{event.title}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(event.date)}{" "} · {event.startTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Vista principal del calendario */}
          <div className="flex-1 overflow-auto">
            <div className="h-full">
              {/* Vista diaria */}
              {currentView === "day" && (
                <div className="flex flex-col h-full">
                  <div className="border-b border-zinc-200 dark:border-zinc-700 p-4 text-center">
                    <h3 className="font-medium text-zinc-900 dark:text-white">
                      {new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", }).format(currentDate)}
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="relative" style={{ height: "calc(15 * 60px)" }}>
                      {/* Líneas de hora */}
                      {timeSlots.map((hour) => (
                        <div key={hour} style={{ top: `${(hour - 6) * 60}px` }} className="absolute w-full border-t border-zinc-200 dark:border-zinc-700 flex">
                          <div className="w-16 pr-2 text-right text-xs text-zinc-500 dark:text-zinc-400">
                            {hour}:00
                          </div>
                          <div className="flex-1"></div>
                        </div>
                      ))}

                      {/* Eventos */}
                      {events
                        .filter((event) => isSameDay(event.date, currentDate)).map((event) => {
                          const style = calculateEventStyle(event.startTime, event.endTime)
                          return (
                            <div
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              style={{ top: style.top, height: style.height }}
                              className={cn(event.color, "absolute left-16 right-4 rounded-md p-2 text-white cursor-pointer")}
                            >
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <p className="text-xs">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* Vista semanal */}
              {currentView === "week" && (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-700">
                    {weekDays.map((day, i) => {
                      const isToday = isSameDay(day.date, new Date())
                      return (
                        <div
                          key={i}
                          onClick={() => { setCurrentDate(day.date); setCurrentView("day") }}
                          className={cn("p-2 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700", isToday ? "bg-blue-50 dark:bg-blue-900/20" : "")}
                        >
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{day.dayName}</div>
                          <div className={cn("text-sm font-medium", isToday ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto" : "text-zinc-900 dark:text-white")}>
                            {day.dayNumber}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="relative" style={{ height: "calc(15 * 60px)" }}>
                      {/* Líneas de hora */}
                      {timeSlots.map((hour) => (
                        <div key={hour} style={{ top: `${(hour - 6) * 60}px` }} className={cn("absolute w-full border-t border-zinc-200 dark:border-zinc-700 flex")}>
                          <div className={cn("w-16 pr-2 text-right text-xs text-zinc-500 dark:text-zinc-400")}>
                            {hour}:00
                          </div>
                          <div className="flex-1 grid grid-cols-7 gap-0">
                            {Array(7).fill(0).map((_, i) => (<div key={i} className={cn("border-l border-zinc-200 dark:border-zinc-700 h-full")}></div>))}
                          </div>
                        </div>
                      ))}

                      {/* Eventos */}
                      {events.map((event) => {
                        // Encontrar el índice del día en la semana
                        const dayIndex = weekDays.findIndex((day) => isSameDay(day.date, event.date))
                        if (dayIndex === -1) return null

                        const style = calculateEventStyle(event.startTime, event.endTime)
                        const leftPosition = `calc(${(dayIndex / 7) * 100}% + 16px)`
                        const width = `calc(${100 / 7}% - 4px)`
                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            style={{ top: style.top, height: style.height, left: leftPosition, width: width }}
                            className={cn(event.color, `absolute rounded-md p-1 text-white cursor-pointer overflow-hidden`)}
                          >
                            <h4 className="font-medium text-xs truncate">{event.title}</h4>
                            <p className="text-xs truncate">
                              {event.startTime} - {event.endTime}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Vista mensual */}
              {currentView === "month" && (
                <div className="grid grid-cols-7 auto-rows-fr h-full">
                  {/* Encabezados de día */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div key={i} className={cn("p-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700")}>
                      {day}
                    </div>
                  ))}

                  {/* Días del mes */}
                  {monthDays.map((day, i) => {
                    const isToday = isSameDay(day.date, new Date())
                    const dayEvents = events.filter((event) => isSameDay(event.date, day.date))

                    return (
                      <div
                        key={i}
                        onClick={() => { setCurrentDate(day.date); setCurrentView("day") }}
                        className={cn("border-b border-r border-zinc-200 dark:border-zinc-700 p-1 overflow-hidden",
                          day.currentMonth ? "bg-white dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-900",
                          isToday ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        )}
                      >
                        <div className={cn("text-sm font-medium",
                          day.currentMonth ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500",
                          isToday ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""
                        )}>
                          {day.date.getDate()}
                        </div>

                        {/* Show max 3 events per day in month view */}
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              onClick={(e) => { e.stopPropagation(); handleEventClick(event) }}
                              className={cn(event.color, "rounded px-1 py-0.5 text-white text-[10px] truncate cursor-pointer")}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className={cn("text-[10px] text-zinc-400 dark:text-zinc-500 pl-1")}>+{dayEvents.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de detalles del evento */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={cn(selectedEvent.color, "dark:bg-inherit p-6 rounded-lg shadow-xl max-w-md w-full mx-4")}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white hover:bg-white/20 rounded-full p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 text-white">
                {/* Personal asignado */}
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 md:h-7 md:w-7 mt-1" />
                  <span><strong>Asignada a:</strong>{' ' + selectedEvent.attendees.join(", ") || "No attendees"}</span>
                </p>
                {/* Cliente */}
                <p className="flex items-center">
                  <User className="mr-2 h-5 w-5 md:h-7 md:w-7" />
                  <span><strong>Cliente:</strong>{' ' + selectedEvent.client}</span>
                </p>
                {/* Horario */}
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 md:h-7 md:w-7" />
                  <span><strong>Horario:</strong>{' ' + selectedEvent.startTime + ' - ' + selectedEvent.endTime}</span>
                </p>
                {/* Ubicación */}
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 md:h-7 md:w-7" />
                  <span><strong>Ubicación:</strong>{' ' + selectedEvent.location}</span>
                </p>
                {/* Fecha */}
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 md:h-7 md:w-7" />
                  <span><strong>Fecha:</strong>{' ' + new Intl.DateTimeFormat("es-ES", { weekday: "long", month: "long", day: "numeric" }).format(selectedEvent.date)}</span>
                </p>

                <Separator />
                <p><strong>Descripción:</strong> {selectedEvent.description}</p>

                {/* Acciones contextuales */}
                {selectedEvent.metadata && <CalendarEventActions theme={theme} event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarUI