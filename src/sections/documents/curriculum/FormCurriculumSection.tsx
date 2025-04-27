import { useCurriculumForm } from "@/hooks/core/form/useFormatForm"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { FooterFormProps } from "@/interfaces/props.interface"
import { RenderFormat } from "@/constants/format.constants"
import { FormProvider } from "react-hook-form"
import React, { useMemo } from "react"

import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import { CardContent } from "#/ui/card"

import TechnicalCharacteristicsSection from "./TechnicalCharacteristicsSection"
import EquipmentClassificationSection from "./EquipmentClassificationSection"
import DetailsEquipmentSection from "./DetailsEquipmentSection"
import CharacteristicsSection from "./CharacteristicsSection"
import InspectionSection from "./PresetInspectionSection"
import AccessoriesSection from "./AccessoriesSection"
import MaintenanceSection from "./MaintenanceSection"
import BasicDataSection from "./BasicDataSection"
import LocationSection from "./LocationSection"

interface FormCurriculumSectionProps extends ThemeContextProps {
  footer?: React.ComponentType<FooterFormProps>
  id: string | undefined
  onChange: () => void
}

const FormCurriculumSection = ({ id, theme, onChange, footer: Footer }: FormCurriculumSectionProps) => {
  const { open, methods, locationData, basicData, detailsData, inspectionData, setOpen, onConfirm, handleSubmit } = useCurriculumForm(id, onChange)

  const formSections = useMemo(() => [
    /** general information technical */
    <LocationSection key="location" theme={theme} id={!!id} options={locationData} />,
    <BasicDataSection key="basic" theme={theme} id={!!id} options={basicData} />,
    <DetailsEquipmentSection key="details" theme={theme} options={detailsData} />,
    <EquipmentClassificationSection key="equipment" theme={theme} />,
    <TechnicalCharacteristicsSection key="technical" theme={theme} />,
    /** maintenance and complementaries */
    <MaintenanceSection key="maintenance" theme={theme} />,
    <InspectionSection key="inspection" theme={theme} options={inspectionData} />,
    <AccessoriesSection key="accessory" theme={theme} />, //accessories equipment
    <CharacteristicsSection key="characteristics" theme={theme} id={!!id} />
  ], [locationData, basicData, detailsData, inspectionData])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
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
            <RenderFormat format={formSections} />
          </CardContent>

          {/* -------------------- Footer -------------------- */}
          {!Footer ? (
            <SubmitFooter
              theme={theme}
              to="/form/curriculum"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo curriculum"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default React.memo(FormCurriculumSection)