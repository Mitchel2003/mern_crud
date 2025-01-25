import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { ConfirmTriggerProps } from '@/interfaces/props.interface'
import { useFormContext } from 'react-hook-form'

/**
 * Hook personalizado para manejar utilidades comunes de formularios
 * Proporciona funciones reutilizables para validación, manejo de errores y acciones de formulario
 */
export const useFormUtils = () => {
  const { getValues, setValue, trigger, formState: { dirtyFields, errors } } = useFormContext()
  const { confirmAction } = useDialogConfirm()

  /**
   * Verifica si hay errores en un campo específico
   * @param fieldName - Nombre del campo a verificar
   */
  const hasErrors = (fieldName: string) => !!errors[fieldName]

  /**
   * Verifica si cualquier campo está "sucio" basado en las propiedades requeridas
   * @param fieldName - Nombre del campo a verificar
   * @param requiredProps - Array de propiedades requeridas
   */
  const isDirtyField = (fieldName: string, requiredProps: string[]) => {
    const fields = dirtyFields[fieldName] as Record<string, boolean>[]
    return requiredProps.every(prop => fields?.[0]?.[prop])
  }

  /**
   * Maneja la confirmación y ejecución de acciones del formulario
   * @param param0 - Propiedades necesarias para la confirmación
   */
  const ConfirmTrigger = async ({ fieldName, title, description, resetData, onSubmit }: ConfirmTriggerProps) => {
    const isValid = await trigger(fieldName)
    const action = async () => { await onSubmit(getValues(fieldName)[0]); setValue(fieldName, [resetData]) }
    isValid && confirmAction({ title, description, action })
  }

  return {
    hasErrors,
    isDirtyField,
    ConfirmTrigger,
    formState: { dirtyFields, errors }
  }
}
