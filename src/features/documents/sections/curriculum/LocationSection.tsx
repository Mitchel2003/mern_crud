import { Headquarter, Office, ThemeContextProps, User } from "@/interfaces/context.interface"
import { groupCollection as groups } from "@/constants/values.constants"
import InputSearchableField from "#/common/fields/InputSearchable"
import HeaderCustom from "#/common/elements/HeaderCustom"
import { useFormContext } from "react-hook-form"

interface LocationSectionProps extends ThemeContextProps {
  options: { headquarters: Headquarter[], offices: Office[], clients: User[] }
  id: boolean
}

const LocationSection = ({ id, theme, options }: LocationSectionProps) => {
  const { watch } = useFormContext()
  const hqId = watch('headquarter')
  const clientId = watch('client')
  const officeId = watch('office')

  const headquarters = id ? options.headquarters : options.headquarters?.filter((head) => head.client?._id === clientId)
  const offices = id ? options.offices : options.offices?.filter((office) => office.headquarter?._id === hqId)
  const services = groups.flatMap(group => group.services).filter(service => {
    const office = offices?.find(office => office._id === officeId)
    return !id ? office?.services.includes(service) : true
  })

  return (
    <div className="space-y-6">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        iconSpan="warn"
        title="Referencia del equipo"
        className="text-2xl font-light"
        span="Propocione la referencia de ubicacion"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

        {/* -------------------- Selects -------------------- */}
        <InputSearchableField
          label="Cliente"
          theme={theme}
          name="client"
          placeholder="Seleccionar cliente"
          options={options.clients?.map((c) => ({ label: c.username, value: c._id })) || []}
        />
        <InputSearchableField
          label="Sede"
          theme={theme}
          name="headquarter"
          placeholder="Seleccionar sede"
          options={headquarters?.map((h) => ({ label: `${h.name} - ${h.address}`, value: h._id })) || []}
        />
        <InputSearchableField
          theme={theme}
          name="office"
          label="Consultorio"
          placeholder="Seleccionar consultorio"
          options={offices?.map((o) => ({ label: o.name, value: o._id })) || []}
        />
        <InputSearchableField
          theme={theme}
          name="service"
          label="Servicio"
          placeholder="Seleccionar servicio"
          options={services?.map((s) => ({ label: s, value: s })) || []}
        />
      </div>
    </div>
  )
}

export default LocationSection