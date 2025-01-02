import { useNavigate } from "react-router-dom"

interface UseTabsProps {
  setTab: (value: string) => void
  id?: string
  to: string
}

/**
 * Hook para manejar las secciones "tabs"
 * @param {string} useTabsProps.to - Ruta base, corresponde al contexto de la solicitud
 * @param {string} useTabsProps.id - ID para construir la ruta del elemento a actualizar
 * @param {(value: string) => void} useTabsProps.setTab - Función para cambiar el tab actual
 * @example
 * if(value === 'table') '/location/countries';
 * if(value === 'form' && !id) '/location/country';
 * if(value === 'form' && id) '/location/country/123';
 */
export const useTabs = ({ id, setTab, to }: UseTabsProps) => {
  const toPlural = to.slice(-1) === 'y' ? to.slice(0, -1) + 'ies' : to + 's'

  const navigate = useNavigate()
  const handle = (value: string) => {
    if (value === 'form') navigate(`${to}${id ? `/${id}` : ''}`)
    if (value === 'table') navigate(`${toPlural}`)
    setTab(value)
  }
  return { handle }
}