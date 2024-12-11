import { createContext, useContext, useEffect, useState } from 'react'
import { SidebarContext } from '@/interfaces/context.interface'
import { Props } from '@/interfaces/props.interface'
import { useIsMobile } from "@/hooks/use-mobile"

const Sidebar = createContext<SidebarContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de sidebar.
 * @throws {Error} Si se intenta usar fuera del SidebarProvider.
 */
export const useSidebarContext = () => {
  const context = useContext(Sidebar)
  if (!context) throw new Error('Error al intentar usar sidebarContext')
  return context
}

/**
 * Proveedor del contexto de sidebar.
 * Maneja el estado de la barra lateral y proporciona funciones para interactuar con ella.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de sidebar.
 */
export const SidebarProvider = ({ children }: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => { if (isMobile) setIsExpanded(false) }, [isMobile])

  const toggleSidebar = () => setIsExpanded(prev => !prev)

  return (
    <Sidebar.Provider value={{ isExpanded, toggleSidebar }}>
      {children}
    </Sidebar.Provider>
  )
}