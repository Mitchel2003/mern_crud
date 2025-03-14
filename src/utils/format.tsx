import { Fragment, ReactElement, cloneElement } from "react"
import { useThemeContext } from "@/context/ThemeContext"
import { Separator } from "#/ui/separator"

/*--------------------------------------------------format date--------------------------------------------------*/
/** returns date in format dd/mm/yyyy */
export const formatDateTime = (date: Date | string | undefined): string => date ? new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '/') : 'N/A'
/** returns date in format "dd de month yyyy" */
export const formatDate = (date: Date | string | undefined): string => date ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date)) : 'N/A'
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