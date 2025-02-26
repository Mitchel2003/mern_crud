import { ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceForm } from "@/hooks/auth/useFormatForm"
import { FooterFormProps } from "@/interfaces/props.interface"
import { RenderFormat } from "@/utils/RenderFormat"
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
  onChange: () => void
}

const FormMaintenanceSection = ({ id, theme, onChange, footer: Footer }: FormMaintenanceSectionProps) => {
  const { open, methods, setOpen, onConfirm, handleSubmit } = useMaintenanceForm(id, onChange)

  const formSections = useMemo(() => [
    <ReferenceSection key="reference" theme={theme} />,
    <ObservationSection key="observation" theme={theme} id={id} />
  ], [theme])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? "Edición mantenimiento de equipo" : "Registro mantenimiento de equipo"}
            description={id ? "Actualiza los datos del mantenimiento de equipo" : "Diligencia la información para registrar una mantenimiento de equipo"}
            breadcrumbs={[
              { description: "Codigo: FHV-01" },
              { description: "Vigente desde: 01/08/2019" },
              { description: "Version: 02" }
            ]}
          />

          {/* -------------------- Content form -------------------- */}
          <CardContent className="pt-6 space-y-8">
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo mantenimiento"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default React.memo(FormMaintenanceSection)