import { ThemeContextProps } from "@/interfaces/context.interface"
import { useSolicitForm } from "@/hooks/core/form/useFormatForm"
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

interface FormSolicitSectionProps extends ThemeContextProps {
  footer?: React.ComponentType<FooterFormProps>
  id: string | undefined
  onChange: () => void
}

const FormSolicitSection = ({ id, theme, footer: Footer }: FormSolicitSectionProps) => {
  const { open, methods, setOpen, onConfirm, handleSubmit } = useSolicitForm(id)

  const formSections = useMemo(() => [
    <ReferenceSection key="reference" theme={theme} id={!!id} />,
    <ObservationSection key="observation" theme={theme} />
  ], [theme])
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title="Solicitud de servicio"
            description="Diligencia el formulario para registrar una solicitud"
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
              to="/form/solicit"
              onCancel={() => methods.reset()}
              disabled={!methods.formState.isDirty}
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
        description="¿Estás seguro? Se enviará la solicitud."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default React.memo(FormSolicitSection)