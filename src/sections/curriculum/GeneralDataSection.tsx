import { GeneralDataSection as TypeGeneralData } from "@/interfaces/form.interface";
import ImageUploadField from "#/curriculum/ImageUploadField";
import InputField from "#/curriculum/InputField";
import { useForm } from "react-hook-form";

const GeneralDataSection = () => {
  const form = useForm<TypeGeneralData>();

  return (
    <>
      <h3 className="text-2xl font-bold mb-6">Información General</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div className="sm:col-span-2">
              <InputField
                name="name"
                label="Nombre"
                control={form.control}
                placeholder="Nombre del equipo"
              />
            </div>
            
            <InputField
              name="brand"
              label="Marca"
              control={form.control}
              placeholder="Marca del equipo"
            />
            <InputField
              name="model"
              label="Modelo"
              control={form.control}
              placeholder="Modelo del equipo"
            />
            <InputField
              name="serie"
              label="Serie"
              control={form.control}
              placeholder="Número de serie"
            />
            <InputField
              name="healthRecord"
              label="Registro Sanitario"
              control={form.control}
              placeholder="Número de registro sanitario"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <ImageUploadField
            name="equipmentImage"
            label="Imagen del Equipo"
            control={form.control}
          />
        </div>
      </div>
    </>
  );
};

export default GeneralDataSection;