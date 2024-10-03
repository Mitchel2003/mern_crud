import { useForm, FormProvider } from "react-hook-form"
import SelectField from "#/curriculum/fields/Select"

type OfficeAreaProps = {
  entity: string;
  area: string;
  office: string;
}

const OfficeAreaSection = () => {
  const methods = useForm<OfficeAreaProps>();

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SelectField
          name="entity"
          label="Entidad"
          control={methods.control}
          options={["Entidad 1", "Entidad 2", "Entidad 3"]}
          placeholder="Seleccionar entidad"
        />
        <SelectField
          name="area"
          label="Area"
          control={methods.control}
          options={["Area 1", "Area 2", "Area 3"]}
          placeholder="Seleccionar área"
        />
        <SelectField
          name="office"
          label="Consultorio"
          control={methods.control}
          options={["Consultorio 1", "Consultorio 2", "Consultorio 3"]}
          placeholder="Seleccionar consultorio"
        />
      </div>
    </FormProvider>
  )
}

export default OfficeAreaSection