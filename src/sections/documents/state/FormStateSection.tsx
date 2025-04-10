import { ThemeContextProps } from "@/interfaces/context.interface"
import { useStateForm } from "@/hooks/core/form/useLocationForm"
import { FormProvider } from "react-hook-form"

import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { CardContent } from "#/ui/card"

interface FormStateSectionProps extends ThemeContextProps {
  id: string | undefined
  onChange: () => void
}

const FormStateSection = ({ id, theme, onChange }: FormStateSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useStateForm(id, onChange)
  if (isLoading) return <Skeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? "Edición de departamento" : "Registro de departamento"}
            description={id ? "Actualiza los datos del departamento" : "Diligencia la información para registrar un departamento"}
          />
          {/* -------------------- Content form -------------------- */}
          <CardContent className="py-6 space-y-6">
            <InputField
              theme={theme}
              name="name"
              label="Nombre"
              placeholder="Nombre del departamento"
              type="text"
            />
            <SelectField
              theme={theme}
              label="País"
              name="country"
              options={options}
              placeholder="Selecciona el país"
            />
          </CardContent>
          {/* -------------------- Footer -------------------- */}
          <SubmitFooter
            theme={theme}
            to="/location/states"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo departamento"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormStateSection