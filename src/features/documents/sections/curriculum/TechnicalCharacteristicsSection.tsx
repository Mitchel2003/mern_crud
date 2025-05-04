import HeaderCustom from "#/common/elements/HeaderCustom";
import InputField from "#/common/fields/Input";

import { ThemeContextProps } from "@/interfaces/context.interface";

interface TechnicalCharacteristicsProps extends ThemeContextProps { }

const TechnicalCharacteristicsSection = ({ theme }: TechnicalCharacteristicsProps) => (
  <div className="space-y-6">
    {/* -------------------- Header -------------------- */}
    <HeaderCustom
      to="component"
      theme={theme}
      title="Características técnicas"
      className="text-2xl font-light"
      span="Campos opcionales"
      iconSpan="info"
    />

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <InputField
        theme={theme}
        label="Voltaje (V)"
        placeholder="Voltaje (V)"
        name="technicalCharacteristics.voltage"
      />
      <InputField
        theme={theme}
        label="Corriente (A)"
        placeholder="Corriente (A)"
        name="technicalCharacteristics.amperage"
      />
      <InputField
        theme={theme}
        label="Potencia"
        placeholder="Potencia"
        name="technicalCharacteristics.power"
      />
      <InputField
        theme={theme}
        label="Frecuencia (Hz)"
        placeholder="Frecuencia (Hz)"
        name="technicalCharacteristics.frequency"
      />
      <InputField
        theme={theme}
        label="Capacidad"
        placeholder="Capacidad"
        name="technicalCharacteristics.capacity"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <InputField
        theme={theme}
        label="Presión (PSI)"
        placeholder="Presión (PSI)"
        name="technicalCharacteristics.pressure"
      />
      <InputField
        theme={theme}
        label="Velocidad"
        placeholder="Velocidad"
        name="technicalCharacteristics.speed"
      />
      <InputField
        theme={theme}
        label="Humedad (%)"
        placeholder="Humedad (%)"
        name="technicalCharacteristics.humidity"
      />
      <InputField
        theme={theme}
        label="Temperatura (C°)"
        placeholder="Temperatura (C°)"
        name="technicalCharacteristics.temperature"
      />
      <InputField
        theme={theme}
        label="Peso (kg)"
        placeholder="Peso (kg)"
        name="technicalCharacteristics.weight"
      />
    </div>
  </div>
)

export default TechnicalCharacteristicsSection