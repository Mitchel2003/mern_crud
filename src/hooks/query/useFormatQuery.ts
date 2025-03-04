import { CustomMutation_Format, QueryReact_Format, UpdateMutationProps, DeleteMutationProps, FileMutationProps } from "@/interfaces/hook.interface"
import { convertToMongoQuery, buildSortOptions, buildPaginationOptions } from "@/lib/mongodb-filters"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { FileReferenceDB, SearchParams } from "@/interfaces/db.interface"
import { FormatType } from "@/interfaces/context.interface"
import { useFormatContext } from "@/context/FormatContext"

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  formats: (path: FormatType) => ['formats', path],
  files: (data: FileReferenceDB) => ['files', data.path],
  format: (path: FormatType, id: string) => ['format', path, id],
  search: (path: FormatType, query: object) => ['formats', 'search', path, query],
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useQuery--------------------------------------------------*/
export const useQueryFormat = (): QueryReact_Format => {
  const format = useFormatContext()

  // Obtener todas los formatos
  const fetchAllFormats = <T>(path: FormatType) => useQuery({
    queryKey: QUERY_KEYS.formats(path),
    queryFn: () => format.getAll<T>(path),
    select: (data) => data || [],
    initialData: []
  })

  // Obtener formato por ID
  const fetchFormatById = <T>(path: FormatType, id: string) => useQuery({
    queryKey: QUERY_KEYS.format(path, id),
    queryFn: () => format.getById<T>(path, id),
    select: (data) => data || undefined,
    enabled: Boolean(id)
  })

  // Buscar formato por término
  const fetchFormatByQuery = <T>(path: FormatType, query: object) => useQuery({
    queryKey: QUERY_KEYS.search(path, query),
    queryFn: () => format.getByQuery<T>(path, query),
    select: (data) => data || [],
    enabled: Boolean(query)
  })

  // Buscar formato por término, aplicando paginación y filtros
  const fetchFormatByPaginate = <T>(path: FormatType, search: SearchParams, filters: any[]) => useQuery({
    queryKey: [
      ...QUERY_KEYS.formats(path),
      search.page,
      search.perPage,
      search.sort,
      search.filters
    ],
    queryFn: async () => {
      const sort = buildSortOptions(search.sort)
      const query = convertToMongoQuery(search, filters)
      const paginationOptions = buildPaginationOptions(Number(search.page), Number(search.perPage))
      return await format.getByPaginate<T>(path, { sort, query, ...paginationOptions })
    },
    select: (data) => data || { data: [], totalCount: 0, pageCount: 0 },
    enabled: Boolean(search.page) && Boolean(search.perPage),
    initialData: { data: [], totalCount: 0, pageCount: 0 }
  })

  // Obtener todos los archivos de un formato
  const fetchAllFiles = <T>(path: FormatType, data: FileReferenceDB) => useQuery({
    queryKey: QUERY_KEYS.files(data),
    queryFn: () => format.getAllFiles<T>(path, data),
    select: (data) => data || [],
    enabled: Boolean(data.path),
    initialData: []
  })

  return {
    fetchAllFormats,
    fetchFormatById,
    fetchFormatByQuery,
    fetchFormatByPaginate,
    fetchAllFiles
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/** Hook personalizado para gestionar mutaciones de productos */
export const useFormatMutation = (path: FormatType): CustomMutation_Format => {
  const { create, update, delete: deleteFormat, uploadFiles, deleteFile } = useFormatContext()
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
    mutationFn: async (data: FileMutationProps) => await uploadFiles(path, data),
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables) }) }
  })

  /**
   * Mutation para eliminar un archivo de un formato
   * @param {FileMutationProps} props - Propiedades para eliminar el archivo
   */
  const deleteFileMutation = useMutation({
    mutationFn: async (data: FileMutationProps) => await deleteFile(path, data),
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables) }) }
  })

  return {
    createFormat: createMutation.mutateAsync,
    updateFormat: updateMutation.mutateAsync,
    deleteFormat: deleteMutation.mutateAsync,
    createFile: createFileMutation.mutateAsync,
    deleteFile: deleteFileMutation.mutateAsync,
    isLoading: createMutation.isPending
      || updateMutation.isPending
      || deleteMutation.isPending
      || createFileMutation.isPending
      || deleteFileMutation.isPending
  }
}