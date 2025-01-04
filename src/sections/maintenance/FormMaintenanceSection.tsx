import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { RenderFormat } from "@/utils/RenderFormat"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import { Card, CardContent } from "#/ui/card"

import ReferenceEquipmentSection from "./ReferenceEquipmentSection"
import BuildMaintenanceSection from "./BuildMaintenanceSection"
import EngineerServiceSection from "./EngineerServiceSection"
import ObservationSection from "./ObservationSection"
import EquipmentSection from "./EquipmentSection"
import InspectionSection from "./InspectionSection"
import ClientSection from "./ClientSection"

interface FormMaintenanceSectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
  isUpdate: boolean
}

const FormMaintenanceSection = ({
  theme,
  methods,
  onSubmit,
  onChange,
  isUpdate
}: FormMaintenanceSectionProps) => {
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
            title={isUpdate ? "Edición de CV" : "Registro de CV"}
            description={isUpdate ? "Actualiza los datos del CV" : "Diligencia la información para registrar un CV"}
            breadcrumbs={[
              { description: "Codigo: FHV-01" },
              { description: "Vigente desde: 01/08/2019" },
              { description: "Version: 02" }
            ]}
          />

          {/* -------------------- Content form -------------------- */}
          <CardContent className="space-y-8 pt-6">
            <RenderFormat format={[
              <ClientSection theme={theme} />,
              <ReferenceEquipmentSection theme={theme} />,
              <EquipmentSection theme={theme} />,
              <BuildMaintenanceSection theme={theme} />,
              <InspectionSection theme={theme} />,
              <ObservationSection theme={theme} />,
              <EngineerServiceSection theme={theme} />
            ]} />
          </CardContent>

          {/* -------------------- Footer form (Buttons submit) -------------------- */}
          <SubmitFooter
            theme={theme}
            to="/curriculum"
            onCancel={() => { onChange('table'); methods.reset() }}
          />
        </Card>
      </form>
    </FormProvider>
  )
}

export default FormMaintenanceSection