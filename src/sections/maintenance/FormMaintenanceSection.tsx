import { ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceForm } from "@/hooks/auth/useFormatForm"
import { RenderFormat } from "@/utils/RenderFormat"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import { Card, CardContent } from "#/ui/card"

import EngineerServiceSection from "./EngineerServiceSection"
import ObservationSection from "./ObservationSection"
import ReferenceSection from "./ReferenceSection"

interface FormMaintenanceSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormMaintenanceSection = ({ id, theme, onChange }: FormMaintenanceSectionProps) => {
  const { open, methods, setOpen, onConfirm, handleSubmit } = useMaintenanceForm(id, () => { onChange('table') })

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <Card
              className={cn(
                'relative my-10 w-[calc(100%-1rem)] md:max-w-[calc(100%-5rem)]',
                'backdrop-filter backdrop-blur-lg',
                theme === 'dark'
                  ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
                  : 'bg-white hover:shadow-purple-500/60'
              )}
            >
              {/* -------------------- Header form -------------------- */}
              <HeaderForm
                theme={theme}
                title={id ? "Edición mantenimiento de equipo" : "Registro mantenimiento de equipo"}
                description={id ? "Actualiza los datos de mantenimiento de equipo" : "Diligencia la información para registrar un mantenimiento de equipo"}
                breadcrumbs={[
                  { description: "Codigo: FHV-01" },
                  { description: "Vigente desde: 01/08/2019" },
                  { description: "Version: 02" }
                ]}
              />

              {/* -------------------- Content form -------------------- */}
              <CardContent className="pt-6 space-y-8">
                <RenderFormat format={[
                  <ReferenceSection theme={theme} />,
                  <ObservationSection theme={theme} />,
                  <EngineerServiceSection theme={theme} />
                ]} />
              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/form/maintenance"
                disabled={!methods.formState.isDirty}
                onCancel={() => { methods.reset(); onChange('table') }}
              />
            </Card>
          </div>
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

export default FormMaintenanceSection