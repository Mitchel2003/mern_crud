import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { RenderFormat } from "@/utils/RenderFormat"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import { Card, CardContent } from "#/ui/card"

import TechnicalCharacteristicsSection from "./TechnicalCharacteristicsSection"
import EquipmentClassificationSection from "./EquipmentClassificationSection"
import DetailsEquipmentSection from "./DetailsEquipmentSection"
import EngineerServiceSection from "./EngineerServiceSection"
import CharacteristicsSection from "./CharacteristicsSection"
import InspectionSection from "./PresetInspectionSection"
import MaintenanceSection from "./MaintenanceSection"
import AccessoriesSection from "./AccessoriesSection"
import OfficeAreaSection from "./OfficeAreaSection"
import BasicDataSection from "./BasicDataSection"

interface FormCurriculumSectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
  isUpdate: boolean
}

const FormCurriculumSection = ({
  theme,
  methods,
  onSubmit,
  onChange,
  isUpdate
}: FormCurriculumSectionProps) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Card
          id="curriculum-form"
          className={cn(
            'w-full mx-auto shadow-lg',
            'backdrop-filter backdrop-blur-lg',
            theme === 'dark'
              ? 'bg-zinc-800 hover:shadow-gray-900'
              : 'bg-gray-50 hover:shadow-purple-500/60'
          )}
        >

          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={isUpdate ? "Edición hoja de vida de equipo" : "Registro hoja de vida de equipo"}
            description={isUpdate ? "Actualiza los datos de la hoja de vida de equipo" : "Diligencia la información para registrar una hoja de vida de equipo"}
            breadcrumbs={[
              { description: "Codigo: FHV-01" },
              { description: "Vigente desde: 01/08/2019" },
              { description: "Version: 02" }
            ]}
          />

          {/* -------------------- Content form -------------------- */}
          <CardContent className="pt-6 space-y-8">
            <RenderFormat format={[
              <OfficeAreaSection theme={theme} />,
              <BasicDataSection theme={theme} />,
              <DetailsEquipmentSection theme={theme} />,
              <EquipmentClassificationSection theme={theme} />,
              <TechnicalCharacteristicsSection theme={theme} />,
              <MaintenanceSection theme={theme} />,
              <InspectionSection theme={theme} />,
              <AccessoriesSection theme={theme} />,
              <CharacteristicsSection theme={theme} />,
              <EngineerServiceSection theme={theme} />
            ]} />
          </CardContent>

          {/* -------------------- Footer form (Buttons submit) -------------------- */}
          <SubmitFooter
            theme={theme}
            to="/curriculum"
            onChange={() => { onChange('table'); methods.reset() }}
          />
        </Card>
      </form>
    </FormProvider>
  )
}

export default FormCurriculumSection