import { CustomMutation_User, QueryReact_User, UpdateMutationProps, DeleteMutationProps } from '@/interfaces/hook.interface'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { UserType } from '@/interfaces/context.interface'
import { useUserContext } from '@/context/UserContext'

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  users: (path: UserType) => ['users', path],
  user: (path: UserType, id: string) => ['user', path, id],
  search: (path: UserType, query: object) => ['users', 'search', path, query]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useQuery--------------------------------------------------*/
/** Hook personalizado para gestionar consultas de usuarios */
export const useQueryUser = (): QueryReact_User => {
  const user = useUserContext()

  /**
   * Obtener todos los usuarios
   * @param {UserType} path - Nos ayuda a construir la route
   */
  const fetchAllUsers = <T>(path: UserType) => useQuery({
    queryKey: QUERY_KEYS.users(path),
    queryFn: () => user.getAll<T>(path),
    select: (data) => data || [],
    initialData: []
  })

  /**
   * Obtener usuario por ID
   * @param {UserType} path - Nos ayuda a construir la route
   * @param {string} id - Corresponde al id del usuario
   */
  const fetchUserById = <T>(path: UserType, id: string) => useQuery({
    queryKey: QUERY_KEYS.user(path, id),
    queryFn: () => user.getById<T>(path, id),
    select: (data) => data || undefined,
    enabled: Boolean(id)
  })

  /**
   * Buscar usuario por término
   * @param {UserType} path - Nos ayuda a construir la route
   * @param {object} query - Elementos de busqueda
   */
  const fetchUserByQuery = <T>(path: UserType, query: object) => useQuery({
    queryKey: QUERY_KEYS.search(path, query),
    queryFn: () => user.getByQuery<T>(path, query),
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
export const useUserMutation = (path: UserType): CustomMutation_User => {
  const { create, update, delete: deleteUser } = useUserContext()
  const queryClient = useQueryClient()

  /**
   * Mutation para crear un usuario
   * @param {object} data - La data del documento a crear.
   * @returns {Promise<any>} Los datos del usuario creado.
   */
  const createMutation = useMutation({
    mutationFn: async (data: object) => await create(path, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users(path) })
  })

  /**
   * Mutation para actualizar un usuario
   * @param {object} data - La data del documento a actualizar.
   * @returns {Promise<any>} Los datos del usuario actualizado.
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateMutationProps) => await update(path, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users(path) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(path, variables.id) })
    }
  })

  /**
   * Mutation para eliminar un usuario
   * @param {string} _id - Corresponde al uid default del usuario.
   * @returns {Promise<any>} Los datos del usuario eliminado.
   */
  const deleteMutation = useMutation({
    mutationFn: async ({ id }: DeleteMutationProps) => await deleteUser(path, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users(path) })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.user(path, variables.id) })
    }
  })

  return {
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}