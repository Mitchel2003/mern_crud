import { GeneralDataProps } from "@/interfaces/form.interface";
import { useForm, FormProvider } from "react-hook-form";
import ImageField from "#/curriculum/ImageField";
import InputField from "#/curriculum/Field";

const GeneralDataSection = () => {
  const methods = useForm<GeneralDataProps>();

  return (
    <FormProvider {...methods}>
      <h3 className="text-2xl font-bold mb-6">Información General</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-8">

        <div className="md:col-span-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* input of 2 columns */}
            <div className="sm:col-span-2">
              <InputField
                name="name"
                label="Nombre"
                control={methods.control}
                placeholder="Nombre del equipo"
              />
            </div>
            <InputField
              name="brand"
              label="Marca"
              control={methods.control}
              placeholder="Marca del equipo"
            />
            <InputField
              name="model"
              label="Modelo"
              control={methods.control}
              placeholder="Modelo del equipo"
            />
            <InputField
              name="serie"
              label="Serie"
              control={methods.control}
              placeholder="Número de serie"
            />
            <InputField
              name="healthRecord"
              label="Registro Sanitario"
              control={methods.control}
              placeholder="Número de registro sanitario"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <ImageField
            name="equipmentImage"
            label="Imagen del Equipo"
            control={methods.control}
          />
        </div>

      </div>
    </FormProvider>
  )
}

export default GeneralDataSection