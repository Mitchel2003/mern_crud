import HeaderCustom from "#/common/elements/HeaderCustom"
import CardIterable from "#/common/fields/CardIterable"
import ImageField from "#/common/fields/Image"
import AreaField from "#/common/fields/Area"

import { CircleNotifications, CrisisAlert } from "@mui/icons-material"
import { ThemeContextProps } from "@/interfaces/context.interface"
import StatusCheck from "@/components/common/fields/StatusCheck"
import { CheckProps } from "@/interfaces/props.interface"

interface ObservationSectionProps extends ThemeContextProps { }

const ObservationSection = ({ theme }: ObservationSectionProps) => {
  return (
    <div className="space-y-4">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        title="Detalles de la solicitud"
        className="text-2xl font-light"
      />

      {/* -------------------- Basic data -------------------- */}
      <div className="grid gap-6">
        <StatusCheck
          theme={theme}
          name="priority"
          options={priorityOptions}
          label="Prioridad de la solicitud"
          span="Indique el nivel de urgencia"
          iconSpan="warn"
        />
        <AreaField
          theme={theme}
          name="message"
          label="Observaciones"
          placeholder="Observaciones de la solicitud"
        />
        <CardIterable
          limit={1}
          theme={theme}
          name="photoUrl"
          titleButton="Agregar imagen"
          fields={fields.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
        />
      </div>
    </div>
  )
}

export default ObservationSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fields = [{ name: "photoUrl.file", label: "Imagen del equipo", sizeImage: "w-60 h-60" }]
const priorityOptions: CheckProps[] = [
  { name: 'high', label: 'Urgente', color: 'red', icon: CrisisAlert },
  { name: 'low', label: 'Normal', color: 'yellow', icon: CircleNotifications },
]