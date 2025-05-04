import { ThemeContextProps } from "@/interfaces/context.interface"
import { useScheduleForm } from "@/hooks/core/form/useFormatForm"
import { FooterFormProps } from "@/interfaces/props.interface"
import { typeSchedule } from "@/constants/values.constants"
import { FormProvider } from "react-hook-form"
import React from "react"

import InputSearchableField from "#/common/fields/InputSearchable"
import ClassificationSection from "./ClassificationSection"
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import { CardContent } from "#/ui/card"

interface FormScheduleSectionProps extends ThemeContextProps {
  footer?: React.ComponentType<FooterFormProps>
  onChange: () => void
}

const FormScheduleSection = ({ theme, footer: Footer }: FormScheduleSectionProps) => {
  const { open, methods, clients, setOpen, onConfirm, handleSubmit } = useScheduleForm()
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title="Creacion de cronograma"
            description="Diligencia el formulario para registrar un cronograma"
            breadcrumbs={[
              { description: "Codigo: FHV-01" },
              { description: "Vigente desde: 01/08/2019" },
              { description: "Version: 02" }
            ]}
          />

          {/* -------------------- Content form -------------------- */}
          <CardContent className="pt-6 space-y-6">
            <InputSearchableField
              theme={theme}
              name="client"
              label="Cliente"
              options={clients}
              placeholder="Seleccione el cliente"
            />
            <SelectField
              theme={theme}
              name="typeSchedule"
              label="Tipo de cronograma"
              placeholder="Seleccione el tipo de cronograma"
              options={typeSchedule.map(e => ({ label: e, value: e }))}
            />
            {/** Iterable classification */}
            <ClassificationSection theme={theme} />
          </CardContent>

          {/* -------------------- Footer -------------------- */}
          {!Footer ? (
            <SubmitFooter
              theme={theme}
              to="/form/schedule"
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
        description="¿Estás seguro? Se creara un cronograma."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default React.memo(FormScheduleSection)