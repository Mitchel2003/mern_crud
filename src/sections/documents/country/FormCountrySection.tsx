import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCountryForm } from "@/hooks/core/form/useLocationForm"
import { FormProvider } from "react-hook-form"

import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from '#/common/skeletons/SkeletonLarge'
import AlertDialog from '#/common/elements/AlertDialog'
import HeaderForm from "#/common/elements/HeaderForm"
import InputField from "#/common/fields/Input"
import { CardContent } from "#/ui/card"

interface FormCountrySectionProps extends ThemeContextProps {
  id: string | undefined
  onChange: () => void
}

const FormCountrySection = ({ id, theme, onChange }: FormCountrySectionProps) => {
  const { methods, isLoading, open, setOpen, onConfirm, handleSubmit } = useCountryForm(id, onChange)
  if (isLoading) return <Skeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? "Edición de país" : "Registro de país"}
            description={id ? "Actualiza los datos del país" : "Diligencia la información para registrar un país"}
          />
          {/* -------------------- Card content -------------------- */}
          <CardContent className="py-6 space-y-6">
            <InputField
              theme={theme}
              name="name"
              label="Nombre del país"
              placeholder="Nombre del país"
              type="text"
            />
          </CardContent>
          {/* -------------------- Footer form -------------------- */}
          <SubmitFooter
            theme={theme}
            to="/location/countries"
            disabled={!methods.formState.isDirty}
            onCancel={() => { methods.reset(); onChange() }}
          />
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo país"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormCountrySection