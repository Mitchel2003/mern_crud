import HeaderCustom from '#/reusables/elements/HeaderCustom'
import IterableCustomCard from '#/reusables/fields/Card'
import SelectField from '#/reusables/fields/Select'
import InputField from '#/reusables/fields/Input'
import DateField from '#/reusables/fields/Date'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { CardFieldProps } from '@/interfaces/form.interface'
import { FormProvider, useForm } from 'react-hook-form'

interface DetailsEquipmentProps extends ThemeContextProps { }

const DetailsEquipmentSection = ({ theme }: DetailsEquipmentProps) => {
  const methods = useForm<DetailsEquipmentProps>();

  const supplierFields: CardFieldProps[] = [
    {/* working here... */
      name: "name",
      component: <InputField name="name" control={methods.control} label="Nombre" theme={theme} />
    },
    {
      name: "city",
      component: <InputField name="city" control={methods.control} label="Ciudad" theme={theme} />
    },
    {
      name: "phone",
      component: <InputField name="phone" control={methods.control} label="Teléfono" theme={theme} />
    }
  ]

  return (
    <FormProvider {...methods}>
      {/* ---------------------- first module - details about the acquisition ---------------------- */}
      <div className="space-y-6">

        <HeaderCustom
          to="section"
          theme={theme}
          title="Detalles Asociados"
          span="Campos obligatorios"
          iconSpan="warn"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DateField
            theme={theme}
            name="purchase_date"
            label="Fecha de Compra"
            control={methods.control}
            placeholder="Seleccionar fecha"
          />
          <DateField
            theme={theme}
            name="installation_date"
            label="Fecha de Instalación"
            control={methods.control}
            placeholder="Seleccionar fecha"
          />
          <DateField
            theme={theme}
            name="start_operation_date"
            label="Fecha de Inicio de Operación"
            control={methods.control}
            placeholder="Seleccionar fecha"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <SelectField
              theme={theme}
              name="type_acquisition"
              label="Tipo de Adquisición"
              control={methods.control}
              options={["compra", "comodato", "alquiler", "otro"]}
              placeholder="Seleccionar tipo"
            />
            <SelectField
              theme={theme}
              name="warranty"
              label="Garantía"
              control={methods.control}
              options={["N/A", "6 months", "1 year", "2 years"]}
              placeholder="Seleccionar garantía"
            />
          </div>
          <InputField
            name="value"
            label="Valor"
            theme={theme}
            type="number"
            control={methods.control}
            placeholder="Valor del equipo"
          />
          <InputField
            name="manufacturing_year"
            label="Año de fabricación"
            theme={theme}
            type="number"
            control={methods.control}
            placeholder="Año de fabricación del equipo"
          />
        </div>
      </div>
      {/* --------------------------------- end first module --------------------------------- */}

      {/* ---------------------- second module - information references ---------------------- */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* info about the representative */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium">Representante</h3>
            <SelectField
              theme={theme}
              name="representative"
              control={methods.control}
              options={["N/A"]}
              placeholder="Seleccionar representante"
            />
            <IterableCustomCard
              theme={theme}
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
              theme={theme}
              name="provider"
              control={methods.control}
              options={["N/A"]}
              placeholder="Seleccionar proveedor"
            />
            <IterableCustomCard
              theme={theme}
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
              theme={theme}
              name="manufacturer"
              control={methods.control}
              options={["N/A"]}
              placeholder="Seleccionar fabricante"
            />
            <IterableCustomCard
              theme={theme}
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