import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumForm } from "@/hooks/auth/useFormatForm"
import { groupCollection as groups } from "@/utils/constants"
import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"
import { useFormContext } from "react-hook-form"

interface LocationSectionProps extends ThemeContextProps { id: boolean }

const LocationSection = ({ id, theme }: LocationSectionProps) => {
  const { locationData: options } = useCurriculumForm()
  const { watch } = useFormContext()

  const headquarterId = watch('headquarter')
  const clientId = watch('client')
  const officeId = watch('office')

  const headquarters = id ? options.headquarters : options.headquarters?.filter((head) => head.user?._id === clientId)
  const offices = id ? options.offices : options.offices?.filter((office) => office.headquarter?._id === headquarterId)
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
        <SelectField
          label="Cliente"
          theme={theme}
          name="client"
          options={options.clients?.map((c) => ({ label: c.name, value: c._id })) || []}
          placeholder="Seleccionar cliente"
        />
        <SelectField
          label="Sede"
          theme={theme}
          name="headquarter"
          options={headquarters?.map((h) => ({ label: `${h.name} - ${h.address}`, value: h._id })) || []}
          placeholder="Seleccionar sede"
        />
        <SelectField
          theme={theme}
          name="office"
          label="Consultorio"
          options={offices?.map((o) => ({ label: o.name, value: o._id })) || []}
          placeholder="Seleccionar consultorio"
        />
        <SelectField
          theme={theme}
          name="service"
          label="Servicio"
          options={services?.map((s) => ({ label: s, value: s })) || []}
          placeholder="Seleccionar servicio"
        />
      </div>
    </div>
  )
}

export default LocationSection