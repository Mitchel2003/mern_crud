import { EntityReferenceSection as TypeEntityReference } from "@/interfaces/form.interface";
import SelectField from "@/components/curriculum/SelectField";
import { useForm } from "react-hook-form";

const EntityReferenceSection = () => {
  const form = useForm<TypeEntityReference>();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectField
        name="entity"
        label="Entidad"
        control={form.control}
        options={["Entidad 1", "Entidad 2", "Entidad 3"]}
        placeholder="Seleccionar entidad"
      />
      <SelectField
        name="service"
        label="Servicio"
        control={form.control}
        options={["Servicio 1", "Servicio 2", "Servicio 3"]}
        placeholder="Seleccionar servicio"
      />
    </div>
  )
}

export default EntityReferenceSection