import { ThemeContextProps } from "@/interfaces/context.interface";
import { useForm, FormProvider } from "react-hook-form"
import SelectField from "#/common/fields/Select"

interface OfficeAreaProps extends ThemeContextProps { }

const OfficeAreaSection = ({ theme }: OfficeAreaProps) => {
  const methods = useForm<OfficeAreaProps>();

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <SelectField
          theme={theme}
          name="headquarter"
          label="Sede"
          options={[
            { label: "Sede 1", value: "headquarter_1" },
            { label: "Sede 2", value: "headquarter_2" },
            { label: "Sede 3", value: "headquarter_3" }
          ]}
          placeholder="Seleccionar sede"
        />
        <SelectField
          theme={theme}
          name="area"
          label="Area"
          options={[
            { label: "Area 1", value: "area_1" },
            { label: "Area 2", value: "area_2" },
            { label: "Area 3", value: "area_3" }
          ]}
          placeholder="Seleccionar área"
        />
        <SelectField
          theme={theme}
          name="office"
          label="Consultorio"
          options={[
            { label: "Consultorio 1", value: "office_1" },
            { label: "Consultorio 2", value: "office_2" },
            { label: "Consultorio 3", value: "office_3" }
          ]}
          placeholder="Seleccionar consultorio"
        />
        <SelectField
          theme={theme}
          name="service"
          label="Servicio"
          options={[
            { label: "Servicio 1", value: "service_1" },
            { label: "Servicio 2", value: "service_2" },
            { label: "Servicio 3", value: "service_3" }
          ]}
          placeholder="Seleccionar servicio"
        />

      </div>
    </FormProvider>
  )
}

export default OfficeAreaSection