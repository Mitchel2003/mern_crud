import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumForm } from "@/hooks/auth/useFormatForm"
import { RenderFormat } from "@/utils/RenderFormat"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import { Card, CardContent } from "#/ui/card"

import TechnicalCharacteristicsSection from "./TechnicalCharacteristicsSection"
import EquipmentClassificationSection from "./EquipmentClassificationSection"
import DetailsEquipmentSection from "./DetailsEquipmentSection"
// import CharacteristicsSection from "./CharacteristicsSection"
// import EngineerServiceSection from "./EngineerServiceSection"
// import InspectionSection from "./PresetInspectionSection"
// import MaintenanceSection from "./MaintenanceSection"
// import AccessoriesSection from "./AccessoriesSection"
import BasicDataSection from "./BasicDataSection"
import LocationSection from "./LocationSection"

interface FormCurriculumSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormCurriculumSection = ({ id, theme, onChange }: FormCurriculumSectionProps) => {
  const { open, methods, setOpen, onConfirm, handleSubmit } = useCurriculumForm(id, () => { onChange('table') })

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
                title={id ? "Edición hoja de vida de equipo" : "Registro hoja de vida de equipo"}
                description={id ? "Actualiza los datos de la hoja de vida de equipo" : "Diligencia la información para registrar una hoja de vida de equipo"}
                breadcrumbs={[
                  { description: "Codigo: FHV-01" },
                  { description: "Vigente desde: 01/08/2019" },
                  { description: "Version: 02" }
                ]}
              />

              {/* -------------------- Content form -------------------- */}
              <CardContent className="pt-6 space-y-8">
                <RenderFormat format={[
                  <LocationSection theme={theme} />,
                  <BasicDataSection theme={theme} />,
                  <DetailsEquipmentSection theme={theme} />,
                  <EquipmentClassificationSection theme={theme} />,
                  <TechnicalCharacteristicsSection theme={theme} />,
                  // <MaintenanceSection theme={theme} />,
                  // <InspectionSection theme={theme} />, //yet not ready
                  // <AccessoriesSection theme={theme} />, //yet not ready
                  // <CharacteristicsSection theme={theme} />,
                  // <EngineerServiceSection theme={theme} />
                ]} />
              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/form/curriculum"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo curriculum"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormCurriculumSection          