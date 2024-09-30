import { UseCallbackProps } from '@/interfaces/props.interface'
import { useCallback } from 'react'

const useImageField = (): UseCallbackProps => {

  const handler: UseCallbackProps['handler'] = useCallback((field, setPreview) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string)
      field.onChange(file)
    }
    reader.readAsDataURL(file)
  }, [])

  const remove: UseCallbackProps['remove'] = useCallback((field, setPreview) => () => {
    setPreview(null)
    field.onChange(null)
  }, [])

  return { handler, remove }
}

export default useImageField;