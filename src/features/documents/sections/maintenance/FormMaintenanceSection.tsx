import { useMaintenanceForm } from "@/hooks/core/form/useFormatForm"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { FooterFormProps } from "@/interfaces/props.interface"
import { RenderFormat } from "@/constants/format.constants"
import { FormProvider } from "react-hook-form"
import React, { useMemo } from "react"

import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import { CardContent } from "#/ui/card"

import ObservationSection from "./ObservationSection"
import ReferenceSection from "./ReferenceSection"

interface FormMaintenanceSectionProps extends ThemeContextProps {
  footer?: React.ComponentType<FooterFormProps>
  id: string | undefined
  autocomplete?: string
  onChange: () => void
}

const FormMaintenanceSection = ({ id, theme, autocomplete, onChange, footer: Footer }: FormMaintenanceSectionProps) => {
  const mt: string | undefined = autocomplete ? undefined : id //helps to avoid overriding when editing maintenance
  const { open, methods, referenceData, setOpen, onConfirm, handleSubmit } = useMaintenanceForm(mt, onChange)

  const formSections = useMemo(() => [
    <ReferenceSection key="reference" theme={theme} id={!!mt} options={referenceData} autocomplete={autocomplete} />,
    <ObservationSection key="observation" theme={theme} id={!!mt} />
  ], [referenceData])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={mt ? "Edición mantenimiento de equipo" : "Registro mantenimiento de equipo"}
            description={mt ? "Actualiza los datos del mantenimiento de equipo" : "Diligencia la información para registrar una mantenimiento de equipo"}
            breadcrumbs={[
              { description: "Codigo: FHV-01" },
              { description: "Vigente desde: 01/08/2019" },
              { description: "Version: 02" }
            ]}
          />

          {/* -------------------- Content form -------------------- */}
          <CardContent className="pt-6 space-y-6">
            <RenderFormat format={formSections} />
          </CardContent>

          {/* -------------------- Footer -------------------- */}
          {!Footer ? (
            <SubmitFooter
              theme={theme}
              to="/form/maintenance"
              disabled={!methods.formState.isDirty}
              onCancel={() => { methods.reset(); onChange?.() }}
            />
          ) : (
            <Footer
              onReset={methods.reset}
              onSubmit={handleSubmit}
              isDirty={methods.formState.isDirty}
              isSubmitting={methods.formState.isSubmitting}
            />
          )}
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${mt ? "Se guardará los cambios" : "Se creará un nuevo mantenimiento"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default React.memo(FormMaintenanceSection)