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
    {
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
      <div className='space-y-6'>
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          title="Detalles Asociados"
          span="Campos obligatorios"
          iconSpan="warn"
        />

        {/* ---------------------- details about the acquisition ---------------------- */}
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
            theme={theme}
            type="number"
            name="value"
            label="Valor"
            control={methods.control}
            placeholder="Valor del equipo"
          />
          <InputField
            theme={theme}
            type="number"
            name="manufacturing_year"
            label="Año de fabricación"
            control={methods.control}
            placeholder="Año de fabricación del equipo"
          />
        </div>

        {/* ---------------------- information references ---------------------- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* info about the representative */}
          <div className="flex flex-col gap-2">
            <SelectField
              theme={theme}
              options={["N/A"]}
              name="representative"
              label="Representante"
              control={methods.control}
              className='text-3xl font-light'
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
            <SelectField
              theme={theme}
              options={["N/A"]}
              name="provider"
              label="Proveedor"
              control={methods.control}
              className='text-3xl font-light'
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
            <SelectField
              theme={theme}
              options={["N/A"]}
              name="manufacturer"
              label="Fabricante"
              control={methods.control}
              className='text-3xl font-light'
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
    </FormProvider >
  )
}

export default DetailsEquipmentSection