import { groupCollection as groups } from "@/constants/values.constants"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useOfficeForm } from "@/hooks/core/form/useLocationForm"
import { FormProvider } from "react-hook-form"
import { HandHelpingIcon } from "lucide-react"
import { CardContent } from "#/ui/card"
import { useMemo } from "react"

import InputSearchableField from "#/common/fields/InputSearchable"
import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectMulti from "#/common/fields/SelectMulti"
import InputField from "#/common/fields/Input"

interface FormOfficeSectionProps extends ThemeContextProps {
  id: string | undefined
  onChange: () => void
}

const FormOfficeSection = ({ id, theme, onChange }: FormOfficeSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useOfficeForm(id, onChange)
  /** Returns a list of services with the appropriate format */
  const serviceOptions = useMemo(() =>
    groups.flatMap(group => (
      group.services.map(service => ({
        label: `${service} - ${group.name}`,
        value: `${service} - ${group.name}`,
        icon: HandHelpingIcon,
      }))
    )), [groups])

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
              <InputSearchableField
                label="Sede"
                theme={theme}
                name="headquarter"
                placeholder="Selecciona la sede"
                span="Indica una sede o cliente referencia"
                options={options.headquarter?.map((e) => ({ value: e._id, label: `${e.name} - ${e.address || ''} - ${e.client?.username || ''}` })) || []}
              />
            </div>
            <SelectMulti
              theme={theme}
              name="services"
              iconSpan="warn"
              label="Servicios"
              options={serviceOptions}
              placeholder="Selecciona los servicios"
              span="Selecciona varios servicios para este consultorio"
            />
          </CardContent>
          {/* -------------------- Submit footer -------------------- */}
          <SubmitFooter
            theme={theme}
            to="/location/offices"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo consultorio"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormOfficeSection