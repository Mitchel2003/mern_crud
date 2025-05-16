import { CustomMutation_User, DeleteMutationProps, QueryReact_User, UpdateMutationProps, QueryOptions, QueryConfig } from '@/interfaces/hook.interface'
import { useQuery, useQueryClient, useMutation, UseQueryResult } from '@tanstack/react-query'
import { UserFormProps } from '@/schemas/auth/auth.schema'
import { useAuthContext } from '@/context/AuthContext'

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  users: () => ['users'],
  user: (id: string) => ['user', id],
  search: (query: QueryOptions) => ['users', 'search', query]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useQuery--------------------------------------------------*/
/** Hook personalizado para gestionar consultas de usuarios */
export const useQueryUser = (): QueryReact_User => {
  const user = useAuthContext()

  /** Obtener todos los usuarios */
  const fetchAllUsers = <T>(config: QueryConfig = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.users(),
    queryFn: () => user.getAll<T>(),
    enabled: (config.enabled ?? true),
    select: (data) => data || [] as T[],
    initialData: [] as T[],
  }) as UseQueryResult<T[]>

  /**
   * Obtener usuario por ID
   * @param {string} id - Corresponde al id del usuario
   * @param {QueryConfig} config - Contiene la configuración de la consulta
   */
  const fetchUserById = <T>(id: string, config: QueryConfig = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => user.getById<T>(id),
    enabled: Boolean(id) && (config.enabled ?? true),
    select: (data) => data || undefined as T,
  }) as UseQueryResult<T | undefined>

  /**
   * Buscar usuario por término
   * @param {QueryOptions} query - Elementos de busqueda y configuración de la consulta
   */
  const fetchUserByQuery = <T>(query: QueryOptions = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => user.getByQuery<T>({ ...query, enabled: undefined }),
    enabled: Boolean(query) && (query.enabled ?? true),
    select: (data) => data || [] as T[],
  }) as UseQueryResult<T[]>

  return {
    fetchAllUsers,
    fetchUserById,
    fetchUserByQuery,
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/** Hook personalizado para gestionar mutaciones de usuarios */
export const useUserMutation = (): CustomMutation_User => {
  const { create, update, delete: deleteUser } = useAuthContext()
  const queryClient = useQueryClient()

  /**
   * Mutation para crear un formato
   * @param {object} data - La data del documento a crear.
   * @returns {Promise<any>} Los datos del formato creado.
   */
  const createMutation = useMutation({
    mutationFn: async (data: UserFormProps) => await create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users() })
  })

  /**
   * Mutation para actualizar un usuario
   * @param {object} data - La data del documento a actualizar.
   * @returns {Promise<any>} Los datos del usuario actualizado.
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateMutationProps) => await update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(variables.id) })
    }
  })

  /**
   * Mutation para eliminar un formato
   * @param {string} _id - Corresponde al uid default del formato.
   * @returns {Promise<any>} Los datos del formato eliminado.
   */
  const deleteMutation = useMutation({
    mutationFn: async ({ id }: DeleteMutationProps) => await deleteUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users() })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.user(variables.id) })
    }
  })

  return {
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}