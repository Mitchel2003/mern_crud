import { useState, useEffect, useCallback } from "react"
import { Event } from "@/hooks/ui/useCalendar"

/** Interfaz para los resultados del hook useCalendarEvents */
export interface CalendarEventsResult<T> {
  refetch: () => Promise<void>
  error: Error | null
  isLoading: boolean
  events: Event[]
  data: T[]
}

/**
 * Hook genu00e9rico para obtener y transformar eventos de calendario.
 * Este hook puede ser extendido por hooks especu00edficos para diferentes roles de usuario.
 * 
 * @param fetchFn - Funciu00f3n para obtener los datos
 * @param transformFn - Funciu00f3n para transformar los datos en eventos de calendario
 * @returns Objeto con datos, eventos, estado de carga, error y funciu00f3n para recargar
 */
export const useCalendarEvents = <T,>(fetchFn: () => Promise<T[]>, transformFn: (items: T[]) => Event[]): CalendarEventsResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchFn();
      setData(result);
      setEvents(transformFn(result));
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, transformFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    events,
    isLoading,
    error,
    refetch: fetchData
  };
};
