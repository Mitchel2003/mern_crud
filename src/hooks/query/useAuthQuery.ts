import { CustomMutation_User, QueryReact_User, UpdateMutationProps } from '@/interfaces/hook.interface'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { QueryOptions } from '@/interfaces/props.interface'
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
  const fetchAllUsers = <T>() => useQuery({
    queryKey: QUERY_KEYS.users(),
    queryFn: () => user.getAll<T>(),
    select: (data) => data || [],
    initialData: []
  })

  /**
   * Obtener usuario por ID
   * @param {string} id - Corresponde al id del usuario
   */
  const fetchUserById = <T>(id: string, enabled?: boolean) => useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => user.getById<T>(id, enabled),
    select: (data) => data || undefined,
    enabled: Boolean(id)
  })

  /**
   * Buscar usuario por término
   * @param {object} query - Elementos de busqueda
   */
  const fetchUserByQuery = <T>(query: QueryOptions) => useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => user.getByQuery<T>(query),
    select: (data) => data || [],
    enabled: Boolean(query)
  })

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
  const { update } = useAuthContext()
  const queryClient = useQueryClient()

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

  return {
    updateUser: updateMutation.mutateAsync,
    isLoading: updateMutation.isPending
  }
}