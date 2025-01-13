import IterableCustomCard from '#/common/fields/CardIterable'
import HeaderCustom from '#/common/elements/HeaderCustom'
import AlertDialog from '#/common/elements/AlertDialog'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'
import DateField from '#/common/fields/Date'
import { Button } from '#/ui/button'

import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { useCurriculumForm, useDetailsEquipmentCV } from '@/hooks/auth/useFormatForm'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { Mail } from 'lucide-react'

interface DetailsEquipmentProps extends ThemeContextProps { }

const DetailsEquipmentSection = ({ theme }: DetailsEquipmentProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { detailsData: options } = useCurriculumForm();

  return (
    <>
      <div className='space-y-6'>
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          iconSpan="warn"
          span="Campos obligatorios"
          title="Detalles Asociados"
          className="text-2xl font-bold"
        />

        {/* ---------------------- details about the acquisition ---------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DateField
            theme={theme}
            name="datePurchase"
            label="Fecha de Compra"
            placeholder="Seleccionar fecha"
          />
          <DateField
            theme={theme}
            name="dateInstallation"
            label="Fecha de Instalación"
            placeholder="Seleccionar fecha"
          />
          <DateField
            theme={theme}
            name="dateOperation"
            label="Fecha de Inicio de Operación"
            placeholder="Seleccionar fecha"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* i need implement select field with "another" option */} {/* working here... */}
          <SelectField
            theme={theme}
            name="acquisition"
            label="Tipo de Adquisición"
            placeholder="Seleccionar tipo"
            options={[
              { label: "compra", value: "compra" },
              { label: "comodato", value: "comodato" },
              { label: "alquiler", value: "alquiler" },
              { label: "otro", value: "otro" }
            ]}
          />
          <SelectField
            theme={theme}
            name="warranty"
            label="Garantía"
            placeholder="Seleccionar garantía"
            options={[
              { label: "Ninguna", value: "n/a" },
              { label: "6 meses", value: "6" },
              { label: "1 año", value: "12" },
              { label: "2 años", value: "24" }
            ]}
          />
          <InputField
            theme={theme}
            name="price"
            label="Valor"
            placeholder="Valor del equipo"
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
              options={options.representative}
            />
            <IterableCustomCard
              theme={theme}
              name="add-representative"
              titleButton="Nuevo representante"
              fields={representativeFields({ theme, name: "representative" })}
            />
          </div>

          {/* info about the distributor */}
          <div className="flex flex-col gap-2">
            <SelectField
              theme={theme}
              name="supplier"
              label="Proveedor"
              className='text-2xl font-light'
              placeholder="Seleccionar proveedor"
              options={options.supplier}
            />
            <IterableCustomCard
              theme={theme}
              name="add-supplier"
              titleButton="Nuevo proveedor"
              fields={supplierFields({ theme, name: "supplier" })}
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
              options={options.manufacturer}
            />
            <IterableCustomCard
              theme={theme}
              name="add-manufacturer"
              titleButton="Nuevo fabricante"
              fields={manufacturerFields({ theme, name: "manufacturer" })}
            />
          </div>

        </div>
      </div>

      <AlertDialog
        open={show}
        theme={theme}
        title={title}
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
        onOpenChange={setShow}
        description={description}
        onConfirm={handleConfirm}
        variant={isDestructive ? "destructive" : "default"}
      />
    </>
  )
}

export default DetailsEquipmentSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface fieldsProps extends ThemeContextProps { name: string }
const representativeFields = ({ theme, name }: fieldsProps) => {
  const { handleSubmit } = useDetailsEquipmentCV.useRepresentative()
  const { confirmAction } = useDialogConfirm()
  return [{
    name: name,
    component:
      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          confirmAction({
            title: 'Agregar representante',
            action: () => { handleSubmit(e) },
            description: `¿Deseas añadir un representante? Este será visible para los demás equipos`,
          })
        }}
      >
        <InputField name="name" label="Nombre" theme={theme} />
        <InputField name="email" type="email" label="Email" icon={Mail} theme={theme} />
        <InputField name="phone" label="Teléfono" theme={theme} />
        <InputField name="city" label="Ciudad" theme={theme} />
        <Button variant="outline" type="submit"> Guardar </Button>
      </form>
  }]
}

const supplierFields = ({ theme, name }: fieldsProps) => {
  const { handleSubmit } = useDetailsEquipmentCV.useSupplier()
  const { confirmAction } = useDialogConfirm()
  return [{
    name: name,
    component:
      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          confirmAction({
            title: 'Agregar proveedor',
            action: () => { handleSubmit(e) },
            description: `¿Deseas añadir un proveedor? Este será visible para los demás equipos`,
          })
        }}
      >
        <InputField name="name" label="Nombre" theme={theme} />
        <InputField name="email" label="Email" theme={theme} />
        <InputField name="address" label="Dirección" theme={theme} />
        <InputField name="phone" label="Teléfono" theme={theme} />
        <InputField name="nit" label="NIT" theme={theme} />
        <Button variant="outline" type="submit"> Guardar </Button>
      </form>
  }]
}

//puedes notar que estamos usando estas funciones para manejar cada targeta iterable (tipo submit)
//con el cual creamos los diferentes representantes (representante, proveedor u fabricante)
//el detalle que como podras percatarte que al crear una funcion para cada representante es una redundancia
//por que si miras bien los lugares en donde llamo estas funciones, podremos ver que lo unico que cambia en cada
//una de las funciones es el nombre, entonces podriamos crear una sola funcion que el name sea generico osea (representative | supplier | manufacturer)
//la situacion es que si queremos implementar esto tendremos que ajustar el hook principal, porque ciertamente llamamos al mismo
//useDetailsEquipment el cual es una clase que tiene las funciones especificas para cada caso (representative | supplier | manufacturer)
const manufacturerFields = ({ theme, name }: fieldsProps) => {
  const { handleSubmit } = useDetailsEquipmentCV.useRepresentative()
  const { confirmAction } = useDialogConfirm()
  return [{
    name: name,
    component:
      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          confirmAction({
            title: 'Agregar fabricante',
            action: () => { handleSubmit(e) },
            description: `¿Deseas añadir un fabricante? Este será visible para los demás equipos`,
          })
        }}
      >
        <InputField name="name" label="Nombre" theme={theme} />
        <InputField name="email" type="email" label="Email" icon={Mail} theme={theme} />
        <InputField name="phone" label="Teléfono" theme={theme} />
        <InputField name="city" label="Ciudad" theme={theme} />
        <Button variant="outline" type="submit"> Guardar </Button>
      </form>
  }]
}