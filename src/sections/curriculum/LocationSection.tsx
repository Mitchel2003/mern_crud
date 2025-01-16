import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumForm } from "@/hooks/auth/useFormatForm"
import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"
import { useFormContext } from "react-hook-form"

interface LocationSectionProps extends ThemeContextProps { }

const LocationSection = ({ theme }: LocationSectionProps) => {
  const { locationData: options } = useCurriculumForm()
  const { watch } = useFormContext()

  const headquarterId = watch('headquarter')
  const clientId = watch('client')
  const officeId = watch('office')
  const areaId = watch('area')

  const headquarters = options.headquarters?.filter((head) => head.client?._id === clientId)
  const areas = options.areas?.filter((area) => area.headquarter?._id === headquarterId)
  const offices = options.offices?.filter((office) => office.area?._id === areaId)
  const services = options.services?.filter((service) => {
    const office = offices?.find((office) => office._id === officeId)
    return office?.services.includes(service.name)
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">

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
          name="area"
          label="Area"
          theme={theme}
          options={areas?.map((a) => ({ label: a.name, value: a._id })) || []}
          placeholder="Seleccionar area"
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
          options={services?.map((s) => ({ label: s.name, value: s.name })) || []}
          placeholder="Seleccionar servicio"
        />
      </div>
    </div>
  )
}

export default LocationSection