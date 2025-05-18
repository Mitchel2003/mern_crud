import { Office, Headquarter, City, State, Country } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/*--------------------------------------------------office table--------------------------------------------------*/
export const useOfficeTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteLocation } = useLocationMutation("office")
  const isOperating = useRef(false)

  const { data: offices } = useQueryLocation().fetchAllLocations<Office>('office')

  /**
 * Función que se ejecuta cuando se elimina un office
 * @param {string} id - ID del office a eliminar
 */
  const deleteOffice = useCallback(async (id: string) => {
    if (isOperating.current) return
    isOperating.current = true
    await deleteLocation({ id }).finally(() => {
      isOperating.current = false
      setOnDelete(undefined)
    })
  }, [deleteLocation])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteOffice(onDelete) }, [onDelete, deleteOffice])

  return {
    offices: useMemo(() => offices, [offices]),
    handleDelete: (id: string) => setOnDelete(id)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------headquarter table--------------------------------------------------*/
export const useHeadquarterTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteLocation } = useLocationMutation("headquarter")
  const isOperating = useRef(false)

  const { data: headquarters } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')

  /**
 * Función que se ejecuta cuando se elimina un headquarter
 * @param {string} id - ID del headquarter a eliminar
 */
  const deleteHeadquarter = useCallback(async (id: string) => {
    if (isOperating.current) return
    isOperating.current = true
    await deleteLocation({ id }).finally(() => {
      isOperating.current = false
      setOnDelete(undefined)
    })
  }, [deleteLocation])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteHeadquarter(onDelete) }, [onDelete, deleteHeadquarter])

  return {
    headquarters: useMemo(() => headquarters, [headquarters]),
    handleDelete: (id: string) => setOnDelete(id)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------city table--------------------------------------------------*/
export const useCityTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteLocation } = useLocationMutation("city")
  const isOperating = useRef(false)

  const { data: cities } = useQueryLocation().fetchAllLocations<City>('city')

  /**
   * Función que se ejecuta cuando se elimina una ciudad
   * @param {string} id - ID de la ciudad a eliminar
   */
  const deleteCity = useCallback(async (id: string) => {
    if (isOperating.current) return
    isOperating.current = true
    await deleteLocation({ id }).finally(() => {
      isOperating.current = false
      setOnDelete(undefined)
    })
  }, [deleteLocation])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteCity(onDelete) }, [onDelete, deleteCity])

  return {
    cities: useMemo(() => cities, [cities]),
    handleDelete: (id: string) => setOnDelete(id)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------state table--------------------------------------------------*/
export const useStateTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteLocation } = useLocationMutation("state")
  const isOperating = useRef(false)

  const { data: states } = useQueryLocation().fetchAllLocations<State>('state')

  /**
   * Función que se ejecuta cuando se elimina un estado
   * @param {string} id - ID del estado a eliminar
   */
  const deleteState = useCallback(async (id: string) => {
    if (isOperating.current) return
    isOperating.current = true
    await deleteLocation({ id }).finally(() => {
      isOperating.current = false
      setOnDelete(undefined)
    })
  }, [deleteLocation])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteState(onDelete) }, [onDelete, deleteState])

  return {
    states: useMemo(() => states, [states]),
    handleDelete: (id: string) => setOnDelete(id)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------country table--------------------------------------------------*/
export const useCountryTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteLocation } = useLocationMutation("country")
  const isOperating = useRef(false)

  const { data: countries } = useQueryLocation().fetchAllLocations<Country>('country')

  /**
   * Función que se ejecuta cuando se elimina un país
   * @param {string} id - ID del país a eliminar
   */
  const deleteCountry = useCallback(async (id: string) => {
    if (isOperating.current) return
    isOperating.current = true
    await deleteLocation({ id }).finally(() => {
      isOperating.current = false
      setOnDelete(undefined)
    })
  }, [deleteLocation])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteCountry(onDelete) }, [onDelete, deleteCountry])

  return {
    countries: useMemo(() => countries, [countries]),
    handleDelete: (id: string) => setOnDelete(id)
  }
}
/*---------------------------------------------------------------------------------------------------------*/