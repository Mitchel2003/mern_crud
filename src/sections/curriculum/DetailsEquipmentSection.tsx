import SelectField from '#/curriculum/SelectField'
import DateField from '#/curriculum/DateField'
import InputField from '#/curriculum/Field'

import { DetailsEquipmentProps, CustomFieldProps } from '@/interfaces/form.interface'
import { FormProvider, useForm } from 'react-hook-form'
import IterableCustomCard from '@/components/curriculum/IterableCustomCard'

const DetailsEquipmentSection = () => {
  const methods = useForm<DetailsEquipmentProps>();

  const supplierFields: CustomFieldProps[] = [
    { name: "name", label: "Nombre", component: <InputField control={methods.control} name="name" /> },
    { name: "city", label: "Ciudad", component: <InputField control={methods.control} name="city" /> },
    { name: "phone", label: "Teléfono", component: <InputField control={methods.control} name="phone" /> },
  ]

  return (
    <FormProvider {...methods}>
      {/* ---------------------- first module - details about the acquisition ---------------------- */}
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
      {/* --------------------------------- end first module --------------------------------- */}

      {/* ---------------------- second module - information references ---------------------- */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* info about the representative */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium">Representante</h3>
            <SelectField
              name="representative"
              control={methods.control}
              options={["N/A"]}
              placeholder="Seleccionar representante"
            />
            <IterableCustomCard
              name="add-representative"
              control={methods.control}
              fields={supplierFields}
              titleButton="Nuevo representante"
            />
          </div>

          {/* info about the distributor */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium">Proveedor</h3>
            <SelectField
              name="provider"
              control={methods.control}
              options={["N/A"]}
              placeholder="Seleccionar proveedor"
            />
            <IterableCustomCard
              name="add-provider"
              titleButton="Nuevo proveedor"
              control={methods.control}
              fields={supplierFields}
            />
          </div>

          {/* info about the manufacturer */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium">Fabricante</h3>
            <SelectField
              name="manufacturer"
              control={methods.control}
              options={["N/A"]}
              placeholder="Seleccionar fabricante"
            />
            <IterableCustomCard
              name="add-manufacturer"
              titleButton="Nuevo fabricante"
              control={methods.control}
              fields={supplierFields}
            />
          </div>

        </div>
      </div>
      {/* --------------------------------- end second module --------------------------------- */}
    </FormProvider >
  )
}

export default DetailsEquipmentSection