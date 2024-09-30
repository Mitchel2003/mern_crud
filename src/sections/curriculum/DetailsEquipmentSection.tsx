import SelectField from "#/curriculum/SelectField";
import DateField from "#/curriculum/DateField";
import InputField from "#/curriculum/Field";
import IterableCardCustom from "#/curriculum/IterableCardCustom";

import { DetailsEquipmentProps, CustomFieldProps } from '@/interfaces/form.interface';
import { FormProvider, useForm } from "react-hook-form";

const DetailsEquipmentSection = () => {
  const methods = useForm<DetailsEquipmentProps>();

  const supplierFields: CustomFieldProps[] = [
    {
      name: "name",
      label: "Nombre",
      placeholder: "Nombre del proveedor",
      component: <InputField control={methods.control} name="name" />
    },
    {
      name: "city",
      label: "Ciudad",
      placeholder: "Ciudad del proveedor",
      component: <InputField control={methods.control} name="city" />
    },
    {
      name: "phone",
      label: "Teléfono",
      placeholder: "Teléfono del proveedor",
      component: <InputField control={methods.control} name="phone" />
    },
    {
      name: "type",
      label: "Tipo",
      placeholder: "Seleccionar tipo",
      component: (
        <SelectField
          name="type"
          control={methods.control}
          options={["distributor", "manufacturer"]}
        />
      )
    }
  ]

  return (
    <FormProvider {...methods}>
      {/* first module - details about the acquisition */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Detalles del Dispositivo</h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <DateField
            name="purchase_date"
            label="Fecha de Compra"
            control={methods.control}
            placeholder="Seleccionar fecha"
          />
          <DateField
            name="installation_date"
            label="Fecha de Instalación"
            control={methods.control}
            placeholder="Seleccionar fecha"
          />
          <DateField
            name="start_operation_date"
            label="Fecha de Inicio de Operación"
            control={methods.control}
            placeholder="Seleccionar fecha"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <SelectField
              name="type_acquisition"
              label="Tipo de Adquisición"
              control={methods.control}
              options={["compra", "comodato", "alquiler", "otro"]}
              placeholder="Seleccionar tipo"
            />
            <SelectField
              name="warranty"
              label="Garantía"
              control={methods.control}
              options={["N/A", "6 months", "1 year", "2 years"]}
              placeholder="Seleccionar garantía"
            />
          </div>
          <InputField
            name="price"
            label="Valor"
            type="number"
            control={methods.control}
            placeholder="Valor del equipo"
          />
          <InputField
            name="year_manufacture"
            label="Año de fabricación"
            control={methods.control}
            type="number"
            placeholder="Año de fabricación del equipo"
          />
        </div>
      </div>

      {/* second module - information references */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* info about the representative */}
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-2xl font-medium">Representante</h3>
            <InputField
              name="representative"
              label="Nombre"
              control={methods.control}
              placeholder="Nombre del representante"
            />
            <InputField
              name="city_representative"
              label="Ciudad"
              control={methods.control}
              placeholder="Ciudad del representante"
            />
            <InputField
              name="phone_representative"
              label="Teléfono"
              control={methods.control}
              placeholder="Teléfono del representante"
            />
          </div>

          {/* info about the suppliers */}
          <div className="grid grid-cols-2 gap-2">
            <IterableCardCustom
              name="suppliers"
              title="Proveedores"
              fields={supplierFields}
              addButtonText="Agregar Proveedor"
              control={methods.control}
            />
          </div>

        </div>
      </div>
    </FormProvider >
  )
}

export default DetailsEquipmentSection