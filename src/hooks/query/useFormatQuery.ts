import { CustomMutation_Format, QueryReact_Format, UpdateMutationProps, DeleteMutationProps, FileMutationProps, QueryOptions, QueryConfig } from "@/interfaces/hook.interface"
import { useQuery, useQueries, useQueryClient, useMutation, UseQueryResult } from "@tanstack/react-query"
import { FormatType } from "@/interfaces/context.interface"
import { useFormatContext } from "@/context/FormatContext"
import { FileReference } from "@/interfaces/db.interface"

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  formats: (path: FormatType) => ['formats', path],
  files: (data: FileReference) => ['files', data.path],
  format: (path: FormatType, id: string) => ['format', path, id],
  search: (path: FormatType, query: QueryOptions) => ['formats', 'search', path, query],
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useQuery--------------------------------------------------*/
/** Hook personalizado para gestionar consultas de formatos */
export const useQueryFormat = (): QueryReact_Format => {
  const format = useFormatContext()

  /**
   * Obtener todos los formatos
   * @param {FormatType} path - Nos ayuda a construir la route
   */
  const fetchAllFormats = <T>(path: FormatType, config: QueryConfig = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.formats(path),
    queryFn: () => format.getAll<T>(path),
    enabled: Boolean(path) && (config.enabled ?? true),
    select: (data) => data || [] as T[],
    initialData: [] as T[],
  }) as UseQueryResult<T[]>

  /**
   * Obtener formato por ID
   * @param {FormatType} path - Nos ayuda a construir la route
   * @param {string} id - Corresponde al id del formato a consultar
   * @param {QueryConfig} config - Contiene la configuración de la consulta
   */
  const fetchFormatById = <T>(path: FormatType, id: string, config: QueryConfig = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.format(path, id),
    queryFn: () => format.getById<T>(path, id),
    enabled: Boolean(id) && (config.enabled ?? true),
    select: (data) => data || undefined as T,
  }) as UseQueryResult<T | undefined>

  /**
   * Buscar formato por término
   * @param {FormatType} path - Nos ayuda a construir la route
   * @param {QueryOptions} query - Elementos de busqueda y configuración de la consulta
   */
  const fetchFormatByQuery = <T>(path: FormatType, query: QueryOptions = { enabled: true }) => useQuery({
    queryKey: QUERY_KEYS.search(path, query),
    queryFn: () => format.getByQuery<T>(path, { ...query, enabled: undefined }),
    enabled: Boolean(query) && (query.enabled ?? true),
    select: (data) => data || [] as T[],
  }) as UseQueryResult<T[]>

  /**
   * Obtener todos los archivos de un formato
   * @param {FileReference} data - Representa la referencia al path etc.
   */
  const fetchAllFiles = <T>(data: FileReference) => useQuery({
    queryKey: QUERY_KEYS.files(data),
    queryFn: () => format.getAllFiles<T>(data),
    select: (data) => data || [] as T[],
    enabled: Boolean(data.path),
    initialData: [] as T[],
  }) as UseQueryResult<T[]>

  /**
   * IMPORTANT! I need reconvert this logic to reusable queries fetch
   * just see, we can see that this logic is repeated in fetchQueriesCV
   * we can send a prop like "path" that represent the context of query "accessory";
   * also we need make a prop query optional to put on de second param {query: { curriculum: q._id }}
   * this way we can build a reutilizable and customizable fetchQueries funtion to another context, like "maintenance" or "solicit"

   * Obtener recursos para múltiples curriculums (accesorios)
   * @param {any[]} data - Array de curriculums para los que obtener recursos
   * @returns Array de resultados de consultas para accesorios
   */
  const fetchQueriesCV = <T>(data: any[]) => useQueries({
    queries: (data || []).flatMap((q: any) => [{
      enabled: Boolean(q._id), retry: 1,
      queryKey: ['accessory', q._id],
      queryFn: async () => {
        const result = await format.getByQuery<T>('accessory', { curriculum: q._id })
        return { type: 'accessory', id: q._id, data: result, error: null }
      }
    }])
  })

  return {
    fetchAllFormats,
    fetchFormatById,
    fetchFormatByQuery,
    fetchQueriesCV,
    fetchAllFiles
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/** Hook personalizado para gestionar mutaciones de formatos */
export const useFormatMutation = (path: FormatType): CustomMutation_Format => {
  const { create, update, delete: deleteFormat, uploadFile, deleteFile, deleteFolder } = useFormatContext()
  const queryClient = useQueryClient()

  /**
   * Mutation para crear un formato
   * @param {object} data - La data del documento a crear.
   * @returns {Promise<any>} Los datos del formato creado.
   */
  const createMutation = useMutation({
    mutationFn: async (data: object) => await create(path, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.formats(path) })
  })

  /**
   * Mutation para actualizar un formato
   * @param {object} data - La data del documento a actualizar.
   * @returns {Promise<any>} Los datos del formato actualizado.
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateMutationProps) => await update(path, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.formats(path) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.format(path, variables.id) })
    }
  })

  /**
   * Mutation para eliminar un formato
   * @param {string} _id - Corresponde al uid default del formato.
   * @returns {Promise<any>} Los datos del formato eliminado.
   */
  const deleteMutation = useMutation({
    mutationFn: async ({ id }: DeleteMutationProps) => await deleteFormat(path, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.formats(path) })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.format(path, variables.id) })
    }
  })
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------files--------------------------------------------------*/
  /**
   * Mutation para crear un archivo de un formato
   * @param {FileMutationProps} props - Propiedades para crear el archivo
   */
  const createFileMutation = useMutation({
    mutationFn: async (data: FileMutationProps) => await uploadFile(data),
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables) }) }
  })

  /**
   * Mutation para eliminar un archivo de un formato
   * @param {FileMutationProps} props - Propiedades para eliminar el archivo
   */
  const deleteFileMutation = useMutation({
    mutationFn: async (data: FileMutationProps) => await deleteFile(data),
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables) }) }
  })

  /**
   * Mutation para eliminar una carpeta y todo su contenido recursivamente
   * @param {FileMutationProps} props - Propiedades para eliminar la carpeta
   */
  const deleteFolderMutation = useMutation({
    mutationFn: async (data: FileMutationProps) => await deleteFolder(data),
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables) }) }
  })

  return {
    createFormat: createMutation.mutateAsync,
    updateFormat: updateMutation.mutateAsync,
    deleteFormat: deleteMutation.mutateAsync,
    createFile: createFileMutation.mutateAsync,
    deleteFile: deleteFileMutation.mutateAsync,
    deleteFolder: deleteFolderMutation.mutateAsync,
    isLoading: createMutation.isPending
      || updateMutation.isPending
      || deleteMutation.isPending
      || createFileMutation.isPending
      || deleteFileMutation.isPending
      || deleteFolderMutation.isPending
  }
}