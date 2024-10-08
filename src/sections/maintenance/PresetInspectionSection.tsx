import HeaderCustom from "#/reusables/elements/HeaderCustom"
import SelectField from "#/reusables/fields/Select"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"

interface InspectionProps extends ThemeContextProps { }
const InspectionSection = ({ theme }: InspectionProps) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <HeaderCustom
          to="section"
          theme={theme}
          title="Inspección"
        />
        {/* working here... */}
        {/* al tener una cantidad considerable de checkbox "items" que corresponden a diferentes inspecciones;
        tenemos menester de crear nuestras propias configuraciones, en este orden de ideas parece tener mayor sentido
        gestionar esta "creacion de preset" desde el momento en que creamos el curricculum de un equipo;
        
        entonces la idea es mostrar todos los checkbox "items" y permitir al usuario seleccionar los que corresponde a la inspeccion
        de ese equipo en particular que esta creando, una vez seleccionado un patron, puede guardar este mismo con un nombre, es esto
        lo que se conoce como preset,

        en continuacion con la idea, al momento de crear el mantenimiento, no necesitamos disponer de elegir preset porque como tal esa
        informacion ya esta en el curriculum del equipo, entonces solo se mostrara los checks correspondientes a la inspeccion de ese equipo,
        de este modo logramos reducir la redundancia de datos, y agilizamos la creacion de un mantenimiento.
        */}
        <SelectField
          theme={theme}
          name="inspectionPreset"
          label="Campos de inspección - selección de preset"
          control={methods.control}
          options={['preventivo', 'correctivo']}
          placeholder="Seleccione una configuración"
        />
      </div>

    </FormProvider>
  )
}

export default InspectionSection