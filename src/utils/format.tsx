import { Fragment, ReactElement, cloneElement } from "react"
import { useThemeContext } from "@/context/ThemeContext"
import { Separator } from "#/ui/separator"

/*--------------------------------------------------format date--------------------------------------------------*/
export const formatDate = (date: Date | string | undefined): string => date ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date)) : 'N/A'

export const formatDateTime: Intl.DateTimeFormatOptions = {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------format render--------------------------------------------------*/
export const RenderFormat = ({ format }: { format: ReactElement[] }) => {
  const { theme } = useThemeContext()

  return format.map((e, i) => (
    <Fragment key={i}>
      {cloneElement(e)}
      <Separator className={`my-8 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`} />
    </Fragment>
  ))
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------format pdf--------------------------------------------------*/
/**
 * Formatea el estado de un equipo (Maintenance pdf).
 * @param status El estado a formatear.
 * @returns El estado formateado.
 */
export const formatStatus = (status: string) => {
  switch (status) {
    case 'bueno':
      return 'Funcionando'
    case 'pendiente':
      return 'En espera de repuestos'
    case 'inactivo':
      return 'Fuera de servicio'
    default:
      return 'N/A'
  }
}

/* Función auxiliar para generar tags basados en el tipo de inspección */
export const getInspectionTags = (inspection: string) => {
  const tags = []
  if (inspection.toLowerCase().includes('físic')) tags.push('Física')
  if (inspection.toLowerCase().includes('mecánic')) tags.push('Mecánica')
  if (inspection.toLowerCase().includes('eléctric')) tags.push('Eléctrica')
  if (inspection.toLowerCase().includes('seguridad')) tags.push('Seguridad')
  if (inspection.toLowerCase().includes('prueba')) tags.push('Prueba')
  if (tags.length === 0) tags.push('General')
  return tags
}