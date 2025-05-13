import { typeMaintenanceCollection as typesMaintenance } from "@/constants/values.constants"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { CheckProps } from "@/interfaces/props.interface"
import { useFormContext } from "react-hook-form"
import { Check, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

import HeaderCustom from "#/common/elements/HeaderCustom"
import ImagePreview from "#/common/fields/ImagePreview"
import CardIterable from "#/common/fields/CardIterable"
import StatusCheck from "#/common/fields/StatusCheck"
import CalendarField from "#/common/fields/Calendar"
import SelectField from "#/common/fields/Select"
import ImageField from "#/common/fields/Image"
import AreaField from "#/common/fields/Area"
import { Separator } from "#/ui/separator"

const statusOptions: CheckProps[] = [
  { name: 'funcionando', label: 'Funcionando', color: 'green', icon: Check },
  { name: 'en espera de repuestos', label: 'En espera de repuestos', color: 'yellow', icon: Clock },
  { name: 'fuera de servicio', label: 'Fuera de servicio', color: 'red', icon: X },
]

interface ObservationSectionProps extends ThemeContextProps { id: boolean }
const ObservationSection = ({ id, theme }: ObservationSectionProps) => {
  const { watch } = useFormContext() //inspect values on render
  const selectedMT = watch('typeMaintenance')
  const preview = watch('annexesPreview')
  return (
    <div className="space-y-4">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        theme={theme}
        to="component"
        iconSpan="info"
        title="Observaciones"
        className="text-2xl font-light"
        span="Detalles de la revisión"
      />

      <div className="grid grid-cols-1 gap-6">
        {/* -------------------- Description -------------------- */}
        <AreaField
          theme={theme}
          iconSpan="none"
          name="observations"
          label="Descripción"
          placeholder="Describa la rutina del mantenimiento"
          span="Informe sobre actividades u observaciones realizadas"
        />
        {/* -------------------- Status equipment -------------------- */}
        <StatusCheck
          theme={theme}
          options={statusOptions}
          name="statusEquipment"
          label="Estado del equipo"
          span="Indique la disponibilidad del equipo"
          iconSpan="warn"
        />
        {/* -------------------- Current date and next maintenance -------------------- */}
        <div className={cn('grid gap-4', selectedMT === 'preventivo' ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
          <SelectField
            theme={theme}
            name="typeMaintenance"
            label="Tipo de mantenimiento"
            placeholder="Seleccionar tipo de mantenimiento"
            options={typesMaintenance.filter(mt => mt !== 'predictivo').map(mt => ({ label: mt, value: mt }))}
          />
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
            name="dateMaintenance"
            label="Fecha mantenimiento"
            placeholder="Seleccione la fecha"
          />
          {selectedMT === 'preventivo' && (
            <CalendarField
              theme={theme}
              toYear={2030}
              fromYear={1950}
              name="dateNextMaintenance"
              label="Fecha próximo mantenimiento"
              placeholder="Seleccionar fecha"
            />
          )}
        </div>

        <Separator className={`my-3 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`} />

        <HeaderCustom
          to="component"
          theme={theme}
          iconSpan="info"
          title="Adjuntar imágenes"
          className="text-2xl font-light"
          span="puedes subir comprobante de pago, fotografías del equipo, etc. (maximo 3)"
        />

        <div className="space-y-2">
          {/* -------------------- Preview -------------------- */}
          <div className={cn(!id || preview?.length === 0 ? 'hidden' : 'block mb-6')}>
            <ImagePreview
              theme={theme}
              name="annexesPreview"
              label="Imagenes existentes"
              sizeImage='max-w-full max-h-72'
            />
          </div>
          {/* -------------------- cards images -------------------- */}
          <CardIterable
            theme={theme}
            name="newAnnexes"
            limit={3 - preview?.length}
            titleButton="Agregar imagen"
            fields={fields.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
          />
        </div>
      </div>
    </div>
  )
}

export default ObservationSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Fields for the iterable component */
const fields = [{ name: "newAnnexes.file", label: "Imagen referencial" }]