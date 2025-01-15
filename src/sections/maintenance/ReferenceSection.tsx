import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceForm } from "@/hooks/auth/useFormatForm"
import { useFormContext } from "react-hook-form"

interface ReferenceProps extends ThemeContextProps { }

const ReferenceSection = ({ theme }: ReferenceProps) => {
  const { referenceData: options } = useMaintenanceForm()
  const { watch } = useFormContext()
  const clientId = watch('client')

  const client = options.clients?.find((client) => client._id === clientId)
  const curriculum = options.curriculums?.filter((curriculum) => curriculum.office.area.headquarter?.client?._id === clientId)

  return (
    <div className="space-y-4">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        iconSpan="warn"
        title="Referencia del equipo"
        className="text-2xl font-light"
        span="Propocione la referencia de ubicacion"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* -------------------- Selects -------------------- */}
        <SelectField
          label="Cliente"
          theme={theme}
          name="client"
          options={options.clients?.map((c) => ({ label: c.name, value: c._id })) || []}
          placeholder="Seleccionar cliente"
        />
        <SelectField
          readOnly
          theme={theme}
          name="nameClient"
          label="Nombre cliente"
          value={client?.name}
          options={[]}
        />
        <SelectField
          readOnly
          theme={theme}
          name="nitClient"
          label="NIT cliente"
          value={client?.nit}
          options={[]}
        />
        <SelectField
          theme={theme}
          name="curriculum"
          label="Curriculum"
          options={curriculum?.map((c) => ({ label: c.name, value: c._id })) || []}
          placeholder="Seleccionar curriculum"
        />
      </div>
    </div>
  )
}

export default ReferenceSection