import HeaderCustom from '#/common/elements/HeaderCustom'
import CardIterable from '#/common/fields/CardIterable'
import AlertDialog from '#/common/elements/AlertDialog'
import CalendarField from '#/common/fields/Calendar'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'

import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { SelectOptionProps } from '@/interfaces/props.interface'
import DetailsCV from '@/hooks/format/curriculum/useDetailsCV'
import { useFormUtils } from '@/hooks/core/useFormUtils'
import { defaultWarranty } from '@/utils/constants'

interface DetailsEquipmentProps extends ThemeContextProps {
  options: { suppliers: SelectOptionProps[], representatives: SelectOptionProps[], manufacturers: SelectOptionProps[] }
}

const DetailsEquipmentSection = ({ theme, options }: DetailsEquipmentProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { hasErrors, isDirtyField, ConfirmTrigger } = useFormUtils()
  const { onSubmit: onSubmitRep } = DetailsCV.useRepresentative()
  const { onSubmit: onSubmitMan } = DetailsCV.useManufacturer()
  const { onSubmit: onSubmitSup } = DetailsCV.useSupplier()
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
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
            name="datePurchase"
            label="Fecha compra"
            placeholder="Seleccione la fecha"
          />
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
            name="dateInstallation"
            label="Fecha instalación"
            placeholder="Seleccionar fecha"
          />
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
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
              { label: "alquiler", value: "alquiler" },
              { label: "comodato", value: "comodato" }
            ]}
          />
          <SelectField
            isAnother
            theme={theme}
            name="warranty"
            label="Garantía"
            options={defaultWarranty}
            placeholder="Seleccionar garantía"
          />
          <InputField
            theme={theme}
            name="price"
            label="Valor"
            span="opcional"
            placeholder="Valor del equipo"
          />
        </div>

        {/* ---------------------- information references ---------------------- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              disabled={!isDirtyField('newManufacturer', ['name', 'phone', 'country']) || hasErrors('newManufacturer')}
              fields={manufacturerFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
              onSubmit={() => ConfirmTrigger({
                resetData: { name: '', phone: '', country: '' },
                description: '¿Deseas añadir un fabricante?',
                fieldName: 'newManufacturer',
                title: 'Agregar fabricante',
                onSubmit: onSubmitMan,
              })}
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
              disabled={!isDirtyField('newSupplier', ['name', 'phone', 'city']) || hasErrors('newSupplier')}
              fields={supplierFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
              onSubmit={() => ConfirmTrigger({
                resetData: { name: '', phone: '', city: '' },
                description: '¿Deseas añadir un proveedor?',
                fieldName: 'newSupplier',
                title: 'Agregar proveedor',
                onSubmit: onSubmitSup,
              })}
            />
          </div>

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
              disabled={!isDirtyField('newRepresentative', ['name', 'phone', 'city']) || hasErrors('newRepresentative')}
              fields={representativeFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
              onSubmit={() => ConfirmTrigger({
                resetData: { name: '', phone: '', city: '' },
                description: '¿Deseas añadir un representante?',
                fieldName: 'newRepresentative',
                title: 'Agregar representante',
                onSubmit: onSubmitRep,
              })}
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
  { name: "newSupplier.city", label: "Ciudad" }
]

const manufacturerFields = [
  { name: "newManufacturer.name", label: "Nombre" },
  { name: "newManufacturer.phone", label: "Teléfono" },
  { name: "newManufacturer.country", label: "País" }
]