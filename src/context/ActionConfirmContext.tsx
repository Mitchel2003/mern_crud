import { ActionConfig, ActionConfirmContext } from '@/interfaces/context.interface'
import { createContext, useContext, useState } from 'react'
import { Props } from '@/interfaces/props.interface'

const ActionConfirm = createContext<ActionConfirmContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de confirmación de acciones.
 * @throws {Error} Si se intenta usar fuera del ActionConfirmProvider.
 */
export const useActionConfirmContext = () => {
  const context = useContext(ActionConfirm)
  if (!context) throw new Error('Error al intentar usar actionConfirmContext')
  return context
}

/**
 * Proveedor del contexto de confirmación de acciones.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de confirmación de acciones.
 */
export const ActionConfirmProvider = ({ children }: Props): JSX.Element => {
  const [currentAction, setCurrentAction] = useState<ActionConfig>(null)
  const [show, setShow] = useState(false)

  const handleConfirm = async () => {
    try { await currentAction?.action() }
    finally { setShow(false); setCurrentAction(null) }
  }

  const confirmAction = (config: ActionConfig) => {
    setCurrentAction(config)
    setShow(true)
  }

  return (
    <ActionConfirm.Provider value={{
      description: currentAction?.description || '¿Estás seguro?',
      isDestructive: currentAction?.isDestructive || false,
      title: currentAction?.title || 'Confirmación',
      handleConfirm,
      confirmAction,
      setShow,
      show,
    }}>
      {children}
    </ActionConfirm.Provider>
  )
}
