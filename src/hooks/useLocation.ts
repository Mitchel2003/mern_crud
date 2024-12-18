import { QueryReact_Location } from '@/interfaces/hook.interface'
import { useLocationContext } from '@/context/LocationContext'
import { LocationType } from '@/interfaces/context.interface'
import { useQuery } from '@tanstack/react-query'

export const useQueryLocation = (): QueryReact_Location => {
  const context = useLocationContext()

  // Obtener todas las ubicaciones
  const fetchAllLocations = (path: LocationType) => useQuery({
    queryKey: ['locations', path],
    queryFn: () => context.getAll(path),
    select: (data) => data || [],
    initialData: []
  })

  // Obtener ubicación por ID
  const fetchLocationById = (path: LocationType, id: string) => useQuery({
    queryKey: ['location', id, path],
    queryFn: () => context.getById(path, id),
    select: (data) => data || undefined,
    enabled: Boolean(id)
  })

  // Buscar ubicación por término
  const fetchLocationByQuery = (path: LocationType, query: object, populate?: string) => useQuery({
    queryKey: ['locations', 'search', query],
    queryFn: () => context.getByQuery(path, query, populate),
    select: (data) => data || [],
    enabled: Boolean(query)
  })

  return {
    fetchAllLocations,
    fetchLocationById,
    fetchLocationByQuery,
  }
}