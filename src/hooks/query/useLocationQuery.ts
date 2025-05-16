import { CustomMutation_Location, QueryReact_Location, UpdateMutationProps, DeleteMutationProps, QueryOptions, QueryConfig, } from '@/interfaces/hook.interface'
import { useQuery, useQueryClient, useMutation, UseQueryResult } from '@tanstack/react-query'
import { useLocationContext } from '@/context/LocationContext'
import { LocationType } from '@/interfaces/context.interface'

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  locations: (path: LocationType) => ['locations', path],
  location: (path: LocationType, id: string) => ['location', path, id],
  search: (path: LocationType, query: QueryOptions) => ['locations', 'search', path, query]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useQuery--------------------------------------------------*/
export const useQueryLocation = (): QueryReact_Location => {
  const location = useLocationContext()

  /**
   * Obtener todas las ubicaciones
   * @param {LocationType} path - Nos ayuda a construir la route
   */
  const fetchAllLocations = <T>(path: LocationType, config: QueryConfig = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.locations(path),
    queryFn: () => location.getAll<T>(path),
    enabled: Boolean(path) && (config.enabled ?? true),
    select: (data) => data || [] as T[],
    initialData: [] as T[],
  }) as UseQueryResult<T[]>

  /**
   * Obtener ubicación por ID
   * @param {LocationType} path - Nos ayuda a construir la route
   * @param {string} id - Corresponde al id de la ubicación a consultar
   * @param {QueryConfig} config - Contiene la configuración de la consulta
   */
  const fetchLocationById = <T>(path: LocationType, id: string, config: QueryConfig = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.location(path, id),
    queryFn: () => location.getById<T>(path, id),
    enabled: Boolean(id) && (config.enabled ?? true),
    select: (data) => data || undefined as T,
  }) as UseQueryResult<T | undefined>

  /**
   * Buscar ubicación por término
   * @param {LocationType} path - Nos ayuda a construir la route
   * @param {QueryOptions} query - Elementos de busqueda y configuración de la consulta
   */
  const fetchLocationByQuery = <T>(path: LocationType, query: QueryOptions = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.search(path, query),
    queryFn: () => location.getByQuery<T>(path, { ...query, enabled: undefined }),
    enabled: Boolean(query) && (query.enabled ?? true),
    select: (data) => data || [] as T[],
  }) as UseQueryResult<T[]>

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
   * @returns {Promise<any>} Los datos de la ubicación creada.
   */
  const createMutation = useMutation({
    mutationFn: async (data: object) => await create(path, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations(path) })
  })

  /**
   * Mutation para actualizar una ubicación
   * @param {object} data - La data del documento a actualizar.
   * @returns {Promise<any>} Los datos de la ubicación actualizada.
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
   * @returns {Promise<any>} Los datos de la ubicación eliminada.
   */
  const deleteMutation = useMutation({
    mutationFn: async ({ id }: DeleteMutationProps) => await deleteLocation(path, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations(path) })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.location(path, variables.id) })
    }
  })

  return {
    createLocation: createMutation.mutateAsync,
    updateLocation: updateMutation.mutateAsync,
    deleteLocation: deleteMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}