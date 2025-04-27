import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/common/elements/HeaderCustom"
import CheckboxField from "#/common/fields/Checkbox"
import { useFormContext } from "react-hook-form"
import SelectField from "#/common/fields/Select"
import { Separator } from "#/ui/separator"
import {
  biomedicalCollection as biomedicalClassification,
  technologyCollection as technologyPredominant,
  equipClassCollection as equipClassification,
  typeClassCollection as typeClassification,
  useClassCollection as useClassification,
  powerSupplyCollection as powerSupply,
  riskCollection as risks
} from '@/constants/values.constants'
import { cn } from "@/lib/utils"

interface EquipmentClassProps extends ThemeContextProps { }

const EquipmentClassificationSection = ({ theme }: EquipmentClassProps) => {
  const selectedType = useFormContext().watch('typeClassification')
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
      <div className={cn('grid grid-cols-1 gap-4', selectedType === 'biomédico' ? 'lg:grid-cols-5' : 'lg:grid-cols-3')}>
        <SelectField
          theme={theme}
          name="useClassification"
          label="Clasificación uso"
          placeholder="Seleccionar clasificación"
          options={useClassification.map(e => ({ label: e, value: e }))}
        />
        <SelectField
          theme={theme}
          label="Equipo"
          name="equipClassification"
          placeholder="Seleccionar equipo"
          options={equipClassification.map(e => ({ label: e, value: e }))}
        />
        <SelectField
          theme={theme}
          label="Tipo"
          name="typeClassification"
          placeholder="Seleccionar tipo"
          options={typeClassification.map(e => ({ label: e, value: e }))}
        />
        {selectedType === 'biomédico' && (
          <>
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
          </>
        )}
      </div>

      {/* technology and power supply */}
      <div className="flex flex-col md:flex-row">
        <CheckboxField
          isMultiple
          theme={theme}
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
          isMultiple
          theme={theme}
          name="technologyPredominant"
          label="Tecnología predominante"
          options={technologyPredominant}
        />
      </div>
    </div>
  )
}

export default EquipmentClassificationSection