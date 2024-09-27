import SelectField from "#/curriculum/SelectField";
import DateField from "#/curriculum/DateField";
import InputField from "#/curriculum/Field";

import { DetailsEquipmentProps } from '@/interfaces/form.interface';
import { FormProvider, useForm } from "react-hook-form";

const DetailsEquipmentSection = () => {
  const methods = useForm<DetailsEquipmentProps>()

  return (
    <FormProvider {...methods}>
      {/* Details about the acquisition */}
      <div className="space-y-6">

        <h3 className="text-2xl font-bold">Detalles del Dispositivo</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <InputField
            name="price"
            label="Valor"
            control={methods.control}
            type="number"
            placeholder="Valor del equipo"
          />
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
            options={["na", "6meses", "1ano", "2anos"]}
            placeholder="Seleccionar garantía"
          />
        </div >

      </div >

      {/* info about the representative */}
      <div className="space-y-6">

        <h3 className="text-2xl font-medium">Representante</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      </div>

      {/* info about the distributor */}
      <div className="space-y-6">

        <h3 className="text-2xl font-medium">Distribuidor</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputField
            name="distributor"
            label="Nombre"
            control={methods.control}
            placeholder="Nombre del distribuidor"
          />
          <InputField
            name="city_distributor"
            label="Ciudad"
            control={methods.control}
            placeholder="Ciudad del distribuidor"
          />
          <InputField
            name="phone_distributor"
            label="Teléfono"
            control={methods.control}
            placeholder="Teléfono del distribuidor"
          />
        </div>
      </div>

      {/* info about the manufacturer */}
      <div className="space-y-6">

        <h3 className="text-2xl font-medium">Fabricante</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <InputField
            name="manufacturer"
            label="Nombre"
            control={methods.control}
            placeholder="Nombre del fabricante"
          />
          <InputField
            name="country_manufacturer"
            label="País"
            control={methods.control}
            placeholder="País del fabricante"
          />
          <InputField
            name="phone_manufacturer"
            label="Teléfono"
            control={methods.control}
            placeholder="Teléfono del fabricante"
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
    </FormProvider>
  )
}

export default DetailsEquipmentSection