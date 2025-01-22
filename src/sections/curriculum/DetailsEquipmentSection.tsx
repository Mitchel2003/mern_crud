import HeaderCustom from '#/common/elements/HeaderCustom'
import CardIterable from '#/common/fields/CardIterable'
import AlertDialog from '#/common/elements/AlertDialog'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'
import DateField from '#/common/fields/Date'

import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useCurriculumForm } from '@/hooks/auth/useFormatForm'
import DetailsCV from '@/hooks/format/curriculum/useDetailsCV'
import { useFormContext } from 'react-hook-form'

interface DetailsEquipmentProps extends ThemeContextProps { }

const DetailsEquipmentSection = ({ theme }: DetailsEquipmentProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { getValues, setValue, formState: { dirtyFields, errors } } = useFormContext()
  const { onSubmit: onSubmitRep } = DetailsCV.useRepresentative()
  const { onSubmit: onSubmitMan } = DetailsCV.useManufacturer()
  const { onSubmit: onSubmitSup } = DetailsCV.useSupplier()
  const { detailsData: options } = useCurriculumForm()

  const isFieldsDirty = (fieldName: string) => {
    const fields = dirtyFields[fieldName] as Record<string, boolean>[]
    return fields?.[0]?.name && fields[0]?.phone && (fields[0]?.city || fields[0]?.country)
  }

  const hasErrors = (fieldName: string) => !!errors[fieldName]

  return (
    <>
      <div className='space-y-6'>
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          iconSpan="info"
          title="Detalles asociados"
          span="Información de adquisición y más"
          className="text-2xl font-light"
        />

        {/* ---------------------- details about the acquisition ---------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DateField
            theme={theme}
            name="datePurchase"
            label="Fecha compra"
            placeholder="Seleccionar fecha"
          />
          <DateField
            theme={theme}
            name="dateInstallation"
            label="Fecha instalación"
            placeholder="Seleccionar fecha"
          />
          <DateField
            theme={theme}
            name="dateOperation"
            label="Fecha inicio operación"
            placeholder="Seleccionar fecha"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SelectField
            theme={theme}
            name="acquisition"
            label="Tipo adquisición"
            placeholder="Seleccionar tipo"
            options={[
              { label: "compra", value: "compra" },
              { label: "alquiler", value: "alquiler" }
            ]}
          />
          <SelectField
            theme={theme}
            name="warranty"
            label="Garantía"
            placeholder="Seleccionar garantía"
            options={[
              { label: "Ninguna", value: "n/a" },
              { label: "6 meses", value: "6 meses" },
              { label: "1 año", value: "12 meses" },
              { label: "otro", value: "otro" }
            ]}
          />
          <InputField
            theme={theme}
            name="price"
            label="Valor"
            span='opcional'
            placeholder="Valor del equipo"
          />
        </div>

        {/* ---------------------- information references ---------------------- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* -------------------- Representative -------------------- */}
          <div className="flex flex-col gap-2">
            <SelectField
              theme={theme}
              name="representative"
              label="Representante"
              className='text-2xl font-light'
              placeholder="Seleccionar representante"
              options={options.representatives}
            />
            <CardIterable
              theme={theme}
              name="newRepresentative"
              titleButton="Nuevo representante"
              disabled={!isFieldsDirty('newRepresentative') || hasErrors('newRepresentative')}
              fields={representativeFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
              onSubmit={() =>
                confirmAction({
                  title: 'Agregar representante',
                  description: '¿Deseas añadir un representante?',
                  action: async () => {
                    await onSubmitRep(getValues('newRepresentative')[0])
                    setValue('newRepresentative', [{ name: '', phone: '', city: '' }])
                  },
                })
              }
            />
          </div>

          {/* -------------------- Supplier -------------------- */}
          <div className="flex flex-col gap-2">
            <SelectField
              theme={theme}
              name="supplier"
              label="Proveedor"
              className='text-2xl font-light'
              placeholder="Seleccionar proveedor"
              options={options.suppliers}
            />
            <CardIterable
              theme={theme}
              name="newSupplier"
              titleButton="Nuevo proveedor"
              disabled={!isFieldsDirty('newSupplier') || hasErrors('newSupplier')}
              fields={supplierFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
              onSubmit={() =>
                confirmAction({
                  title: 'Agregar proveedor',
                  description: '¿Deseas añadir un proveedor?',
                  action: async () => {
                    await onSubmitSup(getValues('newSupplier')[0])
                    setValue('newSupplier', [{ name: '', phone: '', city: '' }])
                  },
                })
              }
            />
          </div>

          {/* -------------------- Manufacturer -------------------- */}
          <div className="flex flex-col gap-2">
            <SelectField
              theme={theme}
              name="manufacturer"
              label="Fabricante"
              className='text-2xl font-light'
              placeholder="Seleccionar fabricante"
              options={options.manufacturers}
            />
            <CardIterable
              theme={theme}
              name="newManufacturer"
              titleButton="Nuevo fabricante"
              disabled={!isFieldsDirty('newManufacturer') || hasErrors('newManufacturer')}
              fields={manufacturerFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
              onSubmit={() => {
                confirmAction({
                  title: 'Agregar fabricante',
                  description: '¿Deseas añadir un fabricante?',
                  action: async () => {
                    await onSubmitMan(getValues('newManufacturer')[0])
                    setValue('newManufacturer', [{ name: '', phone: '', country: '' }])
                  },
                })
              }}
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
const representativeFields = [
  { name: "newRepresentative.name", label: "Nombre" },
  { name: "newRepresentative.phone", label: "Teléfono" },
  { name: "newRepresentative.city", label: "Ciudad" }
]

const supplierFields = [
  { name: "newSupplier.name", label: "Nombre" },
  { name: "newSupplier.phone", label: "Teléfono" },
  { name: "newSupplier.country", label: "País" }
]

const manufacturerFields = [
  { name: "newManufacturer.name", label: "Nombre" },
  { name: "newManufacturer.phone", label: "Teléfono" },
  { name: "newManufacturer.country", label: "País" }
]