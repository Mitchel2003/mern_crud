import { TechnicalCharacteristicsProps } from "@/interfaces/form.interface";

import { useForm, FormProvider } from "react-hook-form";
import InputField from "#/curriculum/Field";

const TechnicalCharacteristicsSection = () => {
  const methods = useForm<TechnicalCharacteristicsProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        <h3 className="text-2xl font-bold">Características Técnicas</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputField
            name="voltage"
            label="Voltaje"
            control={methods.control}
            placeholder="Voltaje"
          />
          <InputField
            name="amperage"
            label="Amperaje"
            control={methods.control}
            placeholder="Amperaje"
          />
          <InputField
            name="power"
            label="Potencia"
            control={methods.control}
            placeholder="Potencia"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputField
            name="frequency"
            label="Frecuencia"
            control={methods.control}
            placeholder="Frecuencia"
          />
          <InputField
            name="capacity"
            label="Capacidad"
            control={methods.control}
            placeholder="Capacidad"
          />
          <InputField
            name="pressure"
            label="Presión (PSI)"
            control={methods.control}
            placeholder="Presión (PSI)"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <InputField
            name="speed"
            label="Velocidad"
            control={methods.control}
            placeholder="Velocidad"
          />
          <InputField
            name="temperature"
            label="Temp (C°)"
            control={methods.control}
            placeholder="Temp (C°)"
          />
          <InputField
            name="weight"
            label="Peso (kg)"
            control={methods.control}
            placeholder="Peso (kg)"
          />
          <InputField
            name="humidity"
            label="Humedad"
            control={methods.control}
            placeholder="Humedad"
          />
        </div>

      </div>
    </FormProvider>
  )
}

export default TechnicalCharacteristicsSection