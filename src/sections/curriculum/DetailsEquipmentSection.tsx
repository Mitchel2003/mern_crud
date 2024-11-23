import IterableCustomCard from '@/components/common/fields/CardIterable'
import HeaderCustom from '@/components/common/elements/HeaderCustom'
import SelectField from '@/components/common/fields/Select'
import InputField from '@/components/common/fields/Input'
import DateField from '@/components/common/fields/Date'
import { Button } from '#/ui/button'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { CardFieldProps } from '@/interfaces/props.interface'
import { FormProvider, useForm } from 'react-hook-form'

interface DetailsEquipmentProps extends ThemeContextProps { }

const DetailsEquipmentSection = ({ theme }: DetailsEquipmentProps) => {
  const methods = useForm()

  {/* -------------------- Fields for the supplier -------------------- */ }
  {/* Contexto del problema; lo que pasa es que estoy tratando de  usar un form dentro de un iterableCard
    el detalle es que como tal se arroja este error "Warning: validateDOMNesting(...): <form> cannot appear as a descendant of <form>."
    esto sugiere que no se puede usar un form dentro de otro form, entonces ¿cómo le hago para que se pueda usar un form dentro de un iterableCard?
    
    estaba pensando en quizas hacer uso del famoso useController para poder controlar el input y el form por separado, pero no se si sera una buena práctica
    o si hay alguna otra forma de lograrlo
    
    quizas al usar este useController, con sus funcionalidades de onChange, onBlur, etc, pueda obtener el valor del input y enviarlo al form por separado
    y asi evitar que se genere este error

    por ell momento lo que tengo es un form global, que es el que esta siendo usado en el componente principal de este archivo, y este form global
    es el que se encarga de manejar los datos de todos los inputs, pero no se si este sea el mejor enfoque, ya que cada vez que se agrega un nuevo
    input, este se debe agregar al form global, lo cual puede llegar a ser un problema para la escalabilidad del proyecto

    de alguna manera quiero lograr ese grado de reactividad, dado que al llenar el formulario "que es algo extenso por cierto", puedo encontrar campos que necesito
    si o si crearlos antes de crear el curriculum del equipo, caso particular es el de los proveedores, porque por ejemplo, dado el caso que no hallan proveedores, o quizas
    no aparezca el proveedor que necesito "previamente creado" entonces tener la posibilidad de crearlo en ese preciso momento; ese es el grado de reactividad que busco, poder de
    alguna manera ir creando datos necesarios; porque no pienso que la persona llene todo el formulario y luego al hacer envio del curriculum, entonces primero crear los proveedores
    para despues crear el curriculum, porque el modelo relacional es que un equipo tiene 1 proveedor, 1 fabricante y 1 representante, entonces para poder crear el curriculum
    necesito tener los 3 datos, esto es porque necesito su id "llave foranea" para poder crear el curriculum

    hasta el momento solo tengo el modelo de card iterables, pero no tengo muy bien entendido como usarlo para crear o enviar solicitudes a una api,
    o mejor dicho datos que no necesariamente esten dentro de un iterable, si no que puedan ser creados en cualquier momento durante el llenado del formulario, quiero emplear
    los mecanismos mas profesionales para lograrlo, ya sea si uso useController o alguna otra herramienta
  */}
  const supplierFields = (name: string): CardFieldProps[] => [
    {
      name: name,
      component:
        <form className='flex flex-col gap-2' onSubmit={methods.handleSubmit(data => console.log(data))}>
          <InputField name="name" label="Nombre" theme={theme} />
          <InputField name="city" label="Ciudad" theme={theme} />
          <InputField name="phone" label="Teléfono" theme={theme} />
          <Button variant="outline" type="submit">Guardar</Button>
        </form>
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
              options={["compra", "comodato", "alquiler", "otro"]}
              placeholder="Seleccionar tipo"
            />
            <SelectField
              theme={theme}
              name="warranty"
              label="Garantía"
              options={["N/A", "6 months", "1 year", "2 years"]}
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
              options={["N/A"]}
              name="representative"
              label="Representante"
              className='text-2xl font-light'
              placeholder="Seleccionar representante"
            />
            <IterableCustomCard
              theme={theme}
              name="add-representative"
              fields={supplierFields("representative")}
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
              className='text-2xl font-light'
              placeholder="Seleccionar proveedor"
            />
            <IterableCustomCard
              theme={theme}
              name="add-provider"
              titleButton="Nuevo proveedor"
              fields={supplierFields("provider")}
            />
          </div>

          {/* info about the manufacturer */}
          <div className="flex flex-col gap-2">
            <SelectField
              theme={theme}
              options={["N/A"]}
              name="manufacturer"
              label="Fabricante"
              className='text-2xl font-light'
              placeholder="Seleccionar fabricante"
            />
            <IterableCustomCard
              theme={theme}
              name="add-manufacturer"
              titleButton="Nuevo fabricante"
              fields={supplierFields("manufacturer")}
            />
          </div>

        </div>
      </div>
    </FormProvider >
  )
}

export default DetailsEquipmentSection