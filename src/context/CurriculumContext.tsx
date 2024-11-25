import { getCVRequest, getCVsRequest, createCVRequest, updateCVRequest, deleteCVRequest } from "@/api/curriculum";
import { Curriculum as TypeCurriculum, CurriculumContext } from "@/interfaces/context.interface";
import { useNotification } from "@/hooks/ui/useNotification";
import { isAxiosResponse } from "@/interfaces/db.interface";
import { useLoadingScreen } from "@/hooks/ui/useLoading";
import { Props } from "@/interfaces/props.interface";

import { useState, useContext, createContext } from "react";

const Curriculum = createContext<CurriculumContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de curriculums.
 * @throws {Error} Si se intenta usar fuera del CurriculumProvider.
 */
export const useCurriculumContext = () => {
  const context = useContext(Curriculum)
  if (!context) throw new Error('Error al intentar usar curriculumContext')
  return context
}

/**
 * Proveedor del contexto de curriculums.
 * Maneja el estado de los curriculums y proporciona funciones para interactuar con ellos.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de curriculums.
 */
export const CurriculumProvider = ({ children }: Props): JSX.Element => {
  const { show: showLoading, hide: hideLoading } = useLoadingScreen()
  const { notifyError, notifySuccess } = useNotification()
  const [cvs, setCvs] = useState<TypeCurriculum[]>([])
  const [loading, setLoading] = useState(true)

  /**
   * Obtiene un curriculum específico por su ID.
   * @param {string} id - El ID del curriculum a obtener.
   * @returns {Promise<void>} Los datos del curriculum o undefined en caso de error.
   */
  const getCV = async (id: string): Promise<void> => {
    setLoadingStatus('Obteniendo datos...')
    try {
      await getCVRequest(id).then(res => setCvs(res.data))
      notifySuccess({ title: "Exito al obtener datos", message: 'La solicitud se ha completado' })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /**
   * Obtiene todos los curriculums del usuario en contexto
   * @returns {Promise<void>} Un array con los datos de todos los curriculums.
   */
  const getCVs = async (): Promise<void> => {
    setLoadingStatus('Obteniendo datos...')
    try {
      await getCVsRequest().then(res => setCvs(res.data))
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Crea un nuevo curriculum.
   * @param {object} curriculum - Los datos del curriculum a crear.
   * @returns {Promise<void>} Los datos del curriculum creado o undefined en caso de error.
   */
  const createCV = async (curriculum: object): Promise<void> => {
    setLoadingStatus('Creando datos...')
    try {
      await createCVRequest(curriculum).then(res => setCvs(res.data))
      notifySuccess({ title: "Exito al crear datos", message: 'La solicitud se ha completado' })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Actualiza un curriculum existente por su ID.
   * @param {string} id - El ID del curriculum a actualizar.
   * @param {object} curriculum - Los nuevos datos del curriculum.
   * @returns {Promise<TypeCurriculum>} Los datos del curriculum actualizado o undefined en caso de error.
   */
  const updateCV = async (id: string, curriculum: object): Promise<void> => {
    setLoadingStatus('Actualizando datos...')
    try {
      await updateCVRequest(id, curriculum).then(res => setCvs(res.data))
      notifySuccess({ title: "Exito al actualizar datos", message: 'La solicitud se ha completado' })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Elimina un curriculum por su ID.
   * @param {string} id - El ID del curriculum a eliminar.
   * @returns {Promise<TypeCurriculum>} Los datos del curriculum eliminado o undefined en caso de error.
   */
  const deleteCV = async (id: string): Promise<void> => {
    setLoadingStatus('Eliminando datos...')
    try {
      await deleteCVRequest(id).then(res => setCvs(res.data))
      notifySuccess({ title: "Exito al eliminar datos", message: 'La solicitud se ha completado' })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error en la solicitud", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------tools--------------------------------------------------*/
  /**
   * Actualiza el estado de carga basado en un parametro opcional
   * si valor del param es distinto a undefined, se muestra el loading
   * @param {string | undefined} status - El estado de carga.
   */
  const setLoadingStatus = (status?: string) => {
    setLoading(Boolean(status))
    status ? showLoading(status) : hideLoading()
  }
  /*---------------------------------------------------------------------------------------------------------*/

  return (
    <Curriculum.Provider value={{ cvs, loading, getCV, getCVs, createCV, updateCV, deleteCV }}>
      {children}
    </Curriculum.Provider>
  )
}