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
      title="Clasificación del Equipo"
      className="text-2xl font-bold"
      span="Informacion sensible"
      iconSpan="warn"
    />

    {/* classification */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <SelectField
        theme={theme}
        label="Tipo"
        name="type_device"
        placeholder="Seleccionar tipo"
        options={[
          { label: "fijo", value: "static" },
          { label: "movil", value: "mobile" }
        ]}
      />
      <SelectField
        theme={theme}
        name="classification_by_use"
        label="Clasificación por Uso"
        placeholder="Seleccionar clasificación"
        options={[
          { label: "medico", value: "medical" },
          { label: "basico", value: "basic" },
          { label: "apoyo", value: "support" }
        ]}
      />
      <SelectField
        theme={theme}
        name="classification_biomedical"
        label="Clasificación Biomédica"
        placeholder="Seleccionar clasificación"
        options={[
          { label: "diagnostico", value: "diagnostic" },
          { label: "tratamiento", value: "treatment" },
          { label: "prevencion", value: "prevention" },
          { label: "rehabilitacion", value: "rehabilitation" },
          { label: "analisis", value: "analysis" }
        ]}
      />
      <SelectField
        theme={theme}
        name="risk"
        label="Riesgo"
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
        name="power-supply"
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
        name="technology-predominant"
        label="Tecnología Predominante"
        options={['mecanico', 'electrico', 'electronico', 'hidraulico', 'neumatico']}
      />
    </div>

  </div>
)

export default EquipmentClassificationSection