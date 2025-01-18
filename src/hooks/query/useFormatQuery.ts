import { CustomMutation_Format, QueryReact_Format, UpdateMutationProps, DeleteMutationProps, FileMutationProps } from '@/interfaces/hook.interface'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { FormatType } from '@/interfaces/context.interface'
import { useFormatContext } from '@/context/FormatContext'
import { FileDB } from '@/interfaces/db.interface'

// Keys constantes para mejor mantenimiento
const QUERY_KEYS = {
  formats: (path: FormatType) => ['formats', path],
  format: (path: FormatType, id: string) => ['format', path, id],
  files: (path: FormatType, data: object) => ['files', path, data],
  search: (path: FormatType, query: string) => ['formats', 'search', path, query],
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
  const fetchFormatByQuery = <T>(path: FormatType, query: string) => useQuery({
    queryKey: QUERY_KEYS.search(path, query),
    queryFn: () => format.getByQuery<T>(path, query),
    select: (data) => data || [],
    enabled: Boolean(query)
  })

  // Obtener todos los archivos de un formato
  const fetchAllFiles = <T>(path: FormatType, data: FileDB) => useQuery({
    queryKey: QUERY_KEYS.files(path, data),
    queryFn: () => format.getAllFiles<T>(path, data),
    select: (data) => data || [],
    enabled: Boolean(data.id),
    initialData: []
  })

  return {
    fetchAllFormats,
    fetchFormatById,
    fetchFormatByQuery,
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
   */
  const createMutation = useMutation({
    mutationFn: async (data: object) => await create(path, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.formats(path) })
  })

  /**
   * Mutation para actualizar un formato
   * @param {object} data - La data del documento a actualizar.
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.format(path, variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(path, variables) })
    }
  })

  /**
   * Mutation para eliminar un archivo de un formato
   * @param {FileMutationProps} props - Propiedades para eliminar el archivo
   */
  const deleteFileMutation = useMutation({
    mutationFn: async (data: FileMutationProps) => await deleteFile(path, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.format(path, variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(path, variables) })
    }
  })

  return {
    createFormat: createMutation.mutate,
    updateFormat: updateMutation.mutate,
    deleteFormat: deleteMutation.mutate,
    createFile: createFileMutation.mutate,
    deleteFile: deleteFileMutation.mutate,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}