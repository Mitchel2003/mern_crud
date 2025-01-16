//import IterableCustomCard from '#/common/fields/CardIterable'
import HeaderCustom from '#/common/elements/HeaderCustom'
//import AlertDialog from '#/common/elements/AlertDialog'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'
import DateField from '#/common/fields/Date'

//import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { ThemeContextProps } from '@/interfaces/context.interface'
//import { useCurriculumForm } from '@/hooks/auth/useFormatForm'
//import { useFormatMutation } from '@/hooks/query/useFormatQuery'
//import { Mail } from 'lucide-react'

interface DetailsEquipmentProps extends ThemeContextProps { }

const DetailsEquipmentSection = ({ theme }: DetailsEquipmentProps) => {
  //const { detailsData: options } = useCurriculumForm();
  //const { confirmAction } = useDialogConfirm();
  /*const { createFormat } = useFormatMutation('');
  
  // Función genérica para manejar la creación de stakeholders
  /*const handleCreateStakeholder = async (type: 'representative' | 'supplier' | 'manufacturer') => {
    const formData = methods.getValues(`new${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!formData) return;

    try {
      // Usar el hook existente para crear
      await createFormat(formData);
      
      // Limpiar campos después de crear
      methods.setValue(`new${type.charAt(0).toUpperCase() + type.slice(1)}`, undefined);
      
      // Recargar opciones
      await options.refetch();
      
    } catch (error) {
      console.error('Error creating stakeholder:', error);
    }
  };*/

  /*const stakeholderFields = {
    representative: [
      { name: "newRepresentative.name", label: "Nombre" },
      { name: "newRepresentative.email", label: "Email", type: "email" as InputType, icon: Mail },
      { name: "newRepresentative.phone", label: "Teléfono" },
      { name: "newRepresentative.city", label: "Ciudad" }
    ],
    supplier: [
      { name: "newSupplier.name", label: "Nombre" },
      { name: "newSupplier.email", label: "Email", type: "email" as InputType, icon: Mail },
      { name: "newSupplier.address", label: "Dirección" },
      { name: "newSupplier.phone", label: "Teléfono" },
      { name: "newSupplier.nit", label: "NIT" }
    ],
    manufacturer: [
      { name: "newManufacturer.name", label: "Nombre" },
      { name: "newManufacturer.email", label: "Email", type: "email" as InputType, icon: Mail },
      { name: "newManufacturer.phone", label: "Teléfono" },
      { name: "newManufacturer.city", label: "Ciudad" }
    ]
  };*/

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
        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
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
              name="newRepresentative"
              titleButton="Nuevo representante"
              fields={stakeholderFields.representative.map(field => ({
                name: field.name,
                component: <InputField {...field} theme={theme} />
              }))}
              onSubmit={() => {
                confirmAction({
                  title: 'Agregar representante',
                  action: () => handleCreateStakeholder('representative'),
                  description: '¿Deseas añadir un representante?'
                })
              }}
            />
          </div>

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
              name="newSupplier"
              titleButton="Nuevo proveedor"
              fields={stakeholderFields.supplier.map(field => ({
                name: field.name,
                component: <InputField {...field} theme={theme} />
              }))}
              onSubmit={() => {
                confirmAction({
                  title: 'Agregar proveedor',
                  action: () => handleCreateStakeholder('supplier'),
                  description: '¿Deseas añadir un proveedor?'
                });
              }}
            />
          </div>

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
              name="newManufacturer"
              titleButton="Nuevo fabricante"
              fields={stakeholderFields.manufacturer.map(field => ({
                name: field.name,
                component: <InputField {...field} theme={theme} />
              }))}
              onSubmit={() => {
                confirmAction({
                  title: 'Agregar fabricante',
                  action: () => handleCreateStakeholder('manufacturer'),
                  description: '¿Deseas añadir un fabricante?'
                });
              }}
            />
          </div>

        </div>
        */}
      </div>

      {/*<AlertDialog
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
      */}
    </>
  )
}

export default DetailsEquipmentSection