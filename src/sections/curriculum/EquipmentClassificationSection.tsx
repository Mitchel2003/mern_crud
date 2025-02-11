import HeaderCustom from "#/common/elements/HeaderCustom"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"
import { Separator } from "#/ui/separator"
import {
  biomedicalCollection as biomedicalClassification,
  technologyCollection as technologyPredominant,
  typeClassCollection as typeClassification,
  useClassCollection as useClassification,
  powerSupplyCollection as powerSupply,
  riskCollection as risks
} from '@/utils/constants'

import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumForm } from '@/hooks/auth/useFormatForm'
import { useFormContext } from "react-hook-form"
import { useEffect } from 'react'

interface EquipmentClassProps extends ThemeContextProps { }

const EquipmentClassificationSection = ({ theme }: EquipmentClassProps) => {
  const { equipmentData: cvs } = useCurriculumForm()
  const { watch, setValue } = useFormContext()

  const curriculumId = watch('name')
  const selectedCV = cvs?.find(cv => cv.name === curriculumId)

  useEffect(() => {
    if (!selectedCV) return
    setValue('useClassification', selectedCV.useClassification)
    setValue('riskClassification', selectedCV.riskClassification)
    setValue('biomedicalClassification', selectedCV.biomedicalClassification)
  }, [selectedCV, setValue])

  return (
    <div className="space-y-6">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        title="Clasificación del equipo"
        className="text-2xl font-light"
        span="Información sensible"
        iconSpan="warn"
      />

      {/* classification */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SelectField
          theme={theme}
          label="Tipo"
          name="typeClassification"
          placeholder="Seleccionar tipo"
          options={typeClassification.map(e => ({ label: e, value: e }))}
        />
        <SelectField
          theme={theme}
          name="useClassification"
          label="Clasificación por uso"
          placeholder="Seleccionar clasificación"
          options={useClassification.map(e => ({ label: e, value: e }))}
        />
        <SelectField
          theme={theme}
          name="biomedicalClassification"
          label="Clasificación biomédica"
          placeholder="Seleccionar clasificación"
          options={biomedicalClassification.map(e => ({ label: e, value: e }))}
        />
        <SelectField
          theme={theme}
          name="riskClassification"
          label="Clasificación riesgo"
          placeholder="Seleccionar riesgo"
          options={risks.map(e => ({ label: e, value: e }))}
        />
      </div>

      {/* technology and power supply */}
      <div className="flex flex-col md:flex-row">
        <CheckboxField
          theme={theme}
          isMultiple={true}
          name="powerSupply"
          options={powerSupply}
          label="Fuentes de alimentacion"
        />

        {/* separator vertial to md */}
        <div className="hidden md:flex justify-center items-center px-6 mx-auto">
          <Separator
            orientation="vertical"
            className={`h-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`}
          />
        </div>

        {/* separator horizontal to sm */}
        <div className="flex md:hidden justify-center items-center py-6">
          <Separator
            orientation="horizontal"
            className={`w-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`}
          />
        </div>

        <CheckboxField
          theme={theme}
          isMultiple={true}
          name="technologyPredominant"
          label="Tecnología predominante"
          options={technologyPredominant}
        />
      </div>
    </div>
  )
}

export default EquipmentClassificationSection