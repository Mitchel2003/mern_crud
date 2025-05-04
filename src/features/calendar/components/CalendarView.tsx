import { useCollaboratorActivities } from "@/features/calendar/hooks/useCollaboratorActivities"
import { ThemeContextProps } from "@/interfaces/context.interface"
import CalendarUI from "#/common/reusables/Calendar"
import { Event } from "@/hooks/ui/useCalendar"

// Nota: Estas importaciones están comentadas pero disponibles para uso futuro
// import { useAuthContext } from "@/context/AuthContext";
// import { useState } from "react";

interface CalendarViewProps extends ThemeContextProps {
  // Props adicionales si son necesarias
  onEventClick?: (event: Event) => void
}

/**
 * Componente adaptador que conecta el componente puro Calendar con los datos específicos del usuario.
 * Este componente se encarga de obtener los eventos según el rol del usuario y pasarlos al componente Calendar.
 */
const CalendarView = ({ theme, onEventClick }: CalendarViewProps) => {
  // Nota: useAuthContext() está disponible para uso futuro cuando necesitemos diferenciar por rol de usuario
  // Por ahora solo tenemos el hook para colaboradores, pero en el futuro podríamos tener hooks para otros roles
  const { events, isLoading } = useCollaboratorActivities()

  // Manejador de eventos personalizado
  const handleEventClick = (event: Event) => { if (onEventClick) onEventClick(event) }
  return (
    <CalendarUI
      theme={theme}
      events={events}
      isLoading={isLoading}
      onEventClick={handleEventClick}
    />
  )
}

export default CalendarView