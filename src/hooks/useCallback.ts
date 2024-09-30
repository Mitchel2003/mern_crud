import { UseCallback_handler, UseCallback_remove, UseCallbackProps } from "@/interfaces/props.interface";
import { useCallback, ChangeEvent, SetStateAction } from "react";

const useCall = (): UseCallbackProps => {

  const handler: UseCallback_handler = (field, setPreview) =>
    useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as SetStateAction<any>)
        field.onChange(file)
      }
      reader.readAsDataURL(file)
    }, [field])

  const remove: UseCallback_remove = (field, setPreview) =>
    useCallback(() => {
      setPreview(null)
      field.onChange(null)
    }, [field])

  return { handler, remove }
}

export default useCall