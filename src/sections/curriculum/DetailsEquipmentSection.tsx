import IterableCustomCard from '#/common/fields/CardIterable'
import HeaderCustom from '#/common/elements/HeaderCustom'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'
import DateField from '#/common/fields/Date'
import { Button } from '#/ui/button'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { UseFormReturn } from 'react-hook-form'

interface DetailsEquipmentProps extends ThemeContextProps { }

const DetailsEquipmentSection = ({ theme }: DetailsEquipmentProps) => {
  const methods = useFormatForm()

  return (
    <div className='space-y-6'>
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        title="Detalles Asociados"
        className="text-2xl font-bold"
        span="Campos obligatorios"
        iconSpan="warn"
      />

      {/* ---------------------- details about the acquisition ---------------------- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DateField
          theme={theme}
          name="purchase_date"
          label="Fecha de Compra"
          placeholder="Seleccionar fecha"
        />
        <DateField
          theme={theme}
          name="installation_date"
          label="Fecha de Instalación"
          placeholder="Seleccionar fecha"
        />
        <DateField
          theme={theme}
          name="start_operation_date"
          label="Fecha de Inicio de Operación"
          placeholder="Seleccionar fecha"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <SelectField
            theme={theme}
            name="type_acquisition"
            label="Tipo de Adquisición"
            options={[
              { label: "compra", value: "compra" },
              { label: "comodato", value: "comodato" },
              { label: "alquiler", value: "alquiler" },
              { label: "otro", value: "otro" }
            ]}
            placeholder="Seleccionar tipo"
          />
          <SelectField
            theme={theme}
            name="warranty"
            label="Garantía"
            options={[
              { label: "N/A", value: "N/A" },
              { label: "6 meses", value: "6" },
              { label: "1 año", value: "12" },
              { label: "2 años", value: "24" }
            ]}
            placeholder="Seleccionar garantía"
          />
        </div>
        <InputField
          theme={theme}
          type="number"
          name="value"
          label="Valor"
          placeholder="Valor del equipo"
        />
        <InputField
          theme={theme}
          type="number"
          name="manufacturing_year"
          label="Año de fabricación"
          placeholder="Año de fabricación del equipo"
        />
      </div>

      {/* ---------------------- information references ---------------------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* info about the representative */}
        <div className="flex flex-col gap-2">
          <SelectField
            theme={theme}
            name="representative"
            label="Representante"
            className='text-2xl font-light'
            placeholder="Seleccionar representante"
            options={[{ label: "N/A", value: "N/A" }]}
          />
          <IterableCustomCard
            theme={theme}
            name="add-representative"
            fields={representativeFields({ theme, methods, name: "representative" })}
            titleButton="Nuevo representante"
          />
        </div>

        {/* info about the distributor */}
        <div className="flex flex-col gap-2">
          <SelectField
            theme={theme}
            name="provider"
            label="Proveedor"
            className='text-2xl font-light'
            placeholder="Seleccionar proveedor"
            options={[{ label: "N/A", value: "N/A" }]}
          />
          <IterableCustomCard
            theme={theme}
            name="add-provider"
            titleButton="Nuevo proveedor"
            fields={supplierFields({ theme, methods, name: "provider" })}
          />
        </div>

        {/* info about the manufacturer */}
        <div className="flex flex-col gap-2">
          <SelectField
            theme={theme}
            name="manufacturer"
            label="Fabricante"
            className='text-2xl font-light'
            placeholder="Seleccionar fabricante"
            options={[{ label: "N/A", value: "N/A" }]}
          />
          <IterableCustomCard
            theme={theme}
            name="add-manufacturer"
            titleButton="Nuevo fabricante"
            fields={representativeFields({ theme, methods, name: "manufacturer" })}
          />
        </div>

      </div>
    </div>
  )
}

export default DetailsEquipmentSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface fieldsProps extends ThemeContextProps {
  methods: UseFormReturn
  name: string
}

const representativeFields = ({ theme, methods, name }: fieldsProps) => [
  {
    name: name,
    component:
      <form className='flex flex-col gap-2' onSubmit={methods.handleSubmit((data: any) => console.log(data))}>
        <InputField name="name" label="Nombre" theme={theme} />
        <InputField name="city" label="Ciudad" theme={theme} />
        <InputField name="phone" label="Teléfono" theme={theme} />
        <Button variant="outline" type="submit">Guardar</Button>
      </form>
  }
]

const supplierFields = ({ theme, methods, name }: fieldsProps) => [
  {
    name: name,
    component:
      <form className='flex flex-col gap-2' onSubmit={methods.handleSubmit((data: any) => console.log(data))}>
        <InputField name="name" label="Nombre" theme={theme} />
        <InputField name="email" label="Email" theme={theme} />
        <InputField name="address" label="Dirección" theme={theme} />
        <InputField name="phone" label="Teléfono" theme={theme} />
        <InputField name="nit" label="NIT" theme={theme} />
        <Button variant="outline" type="submit">Guardar</Button>
      </form>
  }
]