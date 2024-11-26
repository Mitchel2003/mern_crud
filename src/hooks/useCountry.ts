import { CustomMutation_Country, QueryReact_Country } from "@/interfaces/hook.interface";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocationContext } from "@/context/LocationContext";
import { Country } from "@/interfaces/context.interface";

/*--------------------------------------------------useQuery--------------------------------------------------*/
/**
 * Con este método podemos usar el hook "ReactQuery" para manejar consultas y mutaciones de datos de forma reactiva; usamos axios para operar las solicitudes
 * @returns {QueryReact_Country} proporciona métodos que implementan useQueryResult
 * @example
 *  const { fetchCountry } = useQueryReact();
 *  const { data: country, error, isLoading } = fetchCountry(id_country);
 * @description a través de una clave "queryKey" podemos manejar el estado;
 */
export function useQueryReact(): QueryReact_Country {
  const location = useLocationContext()

  /**
   * Ejecuta una solicitud de un país por su id
   * @param id - Corresponde al "_id" del país en contexto
   */
  const fetchCountry = (id: string) => {
    return useQuery<Country>({
      queryKey: ['country', id],
      queryFn: ({ queryKey }) => location.getOne<Country>('country', queryKey[1] as string),
      enabled: id !== 'new'
    })
  }
  /** Ejecuta una solicitud que devuelve todos los países del contexto del usuario */
  const fetchCountries = () => {
    return useQuery<Country[]>({
      queryKey: ['countries'],
      queryFn: () => location.getAll<Country>('country'),
      select: (data) => data || [],
      initialData: []
    })
  }
  return { fetchCountry, fetchCountries }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/**
 * Nos permite preparar el useMutation de acuerdo a una solicitud específica, usamos axios para llamar a la api
 * @returns {CustomMutation_Country} proporciona métodos que implementan useMutationResult
 * @example
 *  const mutation = useCustomMutation().create();
 *  mutation.mutate(id);
 */
export function useCustomMutation(): CustomMutation_Country {
  const queryClient = useQueryClient()
  const location = useLocationContext()

  /**
   * Ejecuta una solicitud condicionalmente basada en el parámetro id
   * @param id - Corresponde al idCurriculum de los parámetros de la url para las acciones de crear o actualizar
   */
  const createOrUpdateCountry = (id: string) => {
    return useMutation<Country, Error, object>({
      mutationFn: (data: object) =>
        id !== 'new'
          ? location.update<Country>('country', id, data)
          : location.create<Country>('country', data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['countries', id] })
      }
    })
  }
  /** Ejecuta una solicitud para eliminar un país por su id */
  const deleteCountry = () => {
    return useMutation<Country, Error, string>({
      mutationFn: (id: string) => location.delete<Country>('country', id),
      onSuccess: (_, idDeleted) => {
        queryClient.invalidateQueries({ queryKey: ['countries', idDeleted] })
      }
    })
  }
  return { createOrUpdateCountry, deleteCountry }
}
/*---------------------------------------------------------------------------------------------------------*/