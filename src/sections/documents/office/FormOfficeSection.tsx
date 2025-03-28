import { ThemeContextProps } from "@/interfaces/context.interface"
import { groupCollection as groups } from "@/utils/constants"
import { useOfficeForm } from "@/hooks/auth/useLocationForm"
import { FormProvider } from "react-hook-form"

import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectMulti from "#/common/fields/SelectMulti"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { HandHelpingIcon } from "lucide-react"
import { CardContent } from "#/ui/card"

interface FormOfficeSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormOfficeSection = ({ id, theme, onChange }: FormOfficeSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useOfficeForm(id, () => { onChange('table') })
  const groupName = methods.watch('group')

  const groupSelected = groups.find((group) => group.name === groupName)
  if (isLoading) return <Skeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? "Edición de consultorio" : "Registro de consultorio"}
            description={id ? "Actualiza los datos del consultorio" : "Diligencia la información para registrar un consultorio"}
          />
          {/* -------------------- Card content -------------------- */}
          <CardContent className="py-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                theme={theme}
                name="name"
                label="Nombre"
                placeholder="Nombre del consultorio"
                type="text"
              />
              <SelectField
                label="Sede"
                theme={theme}
                name="headquarter"
                span="Indica una sede referencia"
                placeholder="Selecciona la sede"
                options={options.headquarter?.map((e) => ({ value: e._id, label: `${e.name} - ${e.address || ''} - ${e.user?.username || ''}` })) || []}
              />
            </div>
            <SelectField
              name="group"
              theme={theme}
              label="Grupos"
              iconSpan="info"
              span="Refiere al grupo al que pertenece este consultorio"
              placeholder="Selecciona el grupo"
              options={groups?.map((e) => ({ value: e.name, label: e.name })) || []}
            />
            <SelectMulti
              theme={theme}
              name="services"
              iconSpan="warn"
              label="Servicios"
              placeholder="Selecciona los servicios"
              span="Selecciona varios servicios para este consultorio"
              options={groupSelected?.services?.map((e) => ({ value: e, label: e, icon: HandHelpingIcon })) || []}
            />
          </CardContent>
          {/* -------------------- Submit footer -------------------- */}
          <SubmitFooter
            theme={theme}
            to="/location/offices"
            disabled={!methods.formState.isDirty}
            onCancel={() => { methods.reset(); onChange('table') }}
          />
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo consultorio"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormOfficeSection