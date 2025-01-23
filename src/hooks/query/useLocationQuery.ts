import { CustomMutation_Location, QueryReact_Location, UpdateMutationProps, DeleteMutationProps } from '@/interfaces/hook.interface'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useLocationContext } from '@/context/LocationContext'
import { LocationType } from '@/interfaces/context.interface'

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  locations: (path: LocationType) => ['locations', path],
  location: (path: LocationType, id: string) => ['location', path, id],
  search: (path: LocationType, query: object) => ['locations', 'search', path, query]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useQuery--------------------------------------------------*/
export const useQueryLocation = (): QueryReact_Location => {
  const location = useLocationContext()

  // Obtener todas las ubicaciones
  const fetchAllLocations = <T>(path: LocationType) => useQuery({
    queryKey: QUERY_KEYS.locations(path),
    queryFn: () => location.getAll<T>(path),
    select: (data) => data || [],
    initialData: []
  })

  // Obtener ubicación por ID
  const fetchLocationById = <T>(path: LocationType, id: string) => useQuery({
    queryKey: QUERY_KEYS.location(path, id),
    queryFn: () => location.getById<T>(path, id),
    select: (data) => data || undefined,
    enabled: Boolean(id)
  })

  // Buscar ubicación por término
  const fetchLocationByQuery = <T>(path: LocationType, query: object) => useQuery({
    queryKey: QUERY_KEYS.search(path, query),
    queryFn: () => location.getByQuery<T>(path, query),
    select: (data) => data || [],
    enabled: Boolean(query)
  })

  return {
    fetchAllLocations,
    fetchLocationById,
    fetchLocationByQuery,
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/** Hook personalizado para gestionar mutaciones de productos */
export const useLocationMutation = (path: LocationType): CustomMutation_Location => {
  const { create, update, delete: deleteLocation } = useLocationContext()
  const queryClient = useQueryClient()

  /**
   * Mutation para crear una ubicación
   * @param {object} data - La data del documento a crear.
   */
  const createMutation = useMutation({
    mutationFn: async (data: object) => await create(path, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations(path) })
  })

  /**
   * Mutation para actualizar una ubicación
   * @param {object} data - La data del documento a actualizar.
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateMutationProps) => await update(path, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations(path) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.location(path, variables.id) })
    }
  })

  /**
   * Mutation para eliminar una ubicación
   * @param {string} _id - Corresponde al uid default de la ubicación.
   */
  const deleteMutation = useMutation({
    mutationFn: async ({ id }: DeleteMutationProps) => await deleteLocation(path, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations(path) })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.location(path, variables.id) })
    }
  })

  return {
    createLocation: createMutation.mutate,
    updateLocation: updateMutation.mutate,
    deleteLocation: deleteMutation.mutate,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}