import HeaderCustom from "#/common/elements/HeaderCustom"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"
import { Separator } from "#/ui/separator"

import { ThemeContextProps } from "@/interfaces/context.interface"

interface EquipmentClassProps extends ThemeContextProps { }

const EquipmentClassificationSection = ({ theme }: EquipmentClassProps) => (
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
        options={[
          { label: "fijo", value: "fijo" },
          { label: "movil", value: "movil" }
        ]}
      />
      <SelectField
        theme={theme}
        name="useClassification"
        label="Clasificación por Uso"
        placeholder="Seleccionar clasificación"
        options={[
          { label: "medico", value: "medico" },
          { label: "basico", value: "basico" },
          { label: "apoyo", value: "apoyo" }
        ]}
      />
      <SelectField
        theme={theme}
        name="biomedicalClassification"
        label="Clasificación Biomédica"
        placeholder="Seleccionar clasificación"
        options={[
          { label: "diagnostico", value: "diagnostico" },
          { label: "tratamiento", value: "tratamiento" },
          { label: "prevención", value: "prevención" },
          { label: "rehabilitación", value: "rehabilitación" },
          { label: "analisis", value: "analisis" }
        ]}
      />
      <SelectField
        theme={theme}
        name="riskClassification"
        label="Clasificación riesgo"
        placeholder="Seleccionar riesgo"
        options={[
          { label: "I", value: "I" },
          { label: "IIA", value: "IIA" },
          { label: "IIB", value: "IIB" },
          { label: "III", value: "III" }
        ]}
      />
    </div>

    {/* technology and power supply */}
    <div className="flex flex-col md:flex-row">
      <CheckboxField
        theme={theme}
        isMultiple={true}
        name="powerSupply"
        label="Fuentes de alimentacion"
        options={['agua', 'aire', 'gas', 'vapor', 'electricidad']}
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
        options={['mecanico', 'electrico', 'electronico', 'hidraulico', 'neumatico']}
      />
    </div>
  </div>
)

export default EquipmentClassificationSection