import { typeClassCollection as typeClassification } from "@/constants/values.constants"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useFormContext } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/es"
dayjs.locale("es")

import IterableCard from "#/common/fields/CardIterable"
import SignatureField from "#/common/fields/Signature"
import MultiSelect from "#/common/fields/SelectMulti"
import CalendarField from "#/common/fields/Calendar"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import AreaField from "#/common/fields/Area"

const ClassificationSection = ({ theme }: ThemeContextProps) => {
  const { watch } = useFormContext()
  const type = watch('typeSchedule')
  const currentYear = 2024
  return (
    <>
      {type === 'acta de asistencia' && (
        <>
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
            iconSpan="alert"
            span="Importante"
            name="dateAttendance"
            label="Fecha acta de asistencia"
            placeholder="Seleccione la fecha"
          />
          <AreaField
            theme={theme}
            name="subject"
            label="Asunto"
            placeholder="Indique los temas a tratar"
          />
          <AreaField
            theme={theme}
            name="message"
            label="Personal a capacitar"
            placeholder="Indique el personal a capacitar"
          />
          <IterableCard
            limit={20}
            theme={theme}
            name="newRowAttendance"
            titleButton="Añadir asistente"
            fields={attendanceFields({ theme })}
          />
        </>
      )}

      {type === 'mantenimiento' && (
        <MultiSelect
          theme={theme}
          name="yearOperation"
          label="Año del mantenimiento"
          placeholder="Seleccione el año previsto para el mantenimiento"
          options={Array.from({ length: 20 }, (_, i) => {
            const year = currentYear + i
            return { value: year.toString(), label: year.toString(), icon: CalendarIcon }
          })}
        />
      )}
      {(type === 'capacitación' || type === 'mantenimiento') && (
        <MultiSelect
          theme={theme}
          name="monthOperation"
          label="Meses de realización"
          placeholder="Seleccione los meses de acuerdo al periodo"
          options={Array.from({ length: 12 }, (_, i) => {
            const monthName = dayjs().month(i).format("MMMM")
            return { value: monthName.toLowerCase(), label: monthName.charAt(0).toUpperCase() + monthName.slice(1), icon: CalendarIcon }
          })}
        />
      )}

      {type === 'mantenimiento' && (
        <>
          <SelectField
            theme={theme}
            name="typeClassification"
            label="Tipo de clasificación"
            placeholder="Seleccione el tipo de clasificación"
            options={typeClassification.map(e => ({ label: e, value: e }))}
          />
        </>
      )}
    </>
  )
}

export default ClassificationSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const attendanceFields = ({ theme }: ThemeContextProps) => [{
  name: "newRowAttendance.name",
  component:
    <InputField
      theme={theme}
      label="Nombre"
      name="newRowAttendance.name"
      placeholder="Nombre de la sede"
    />
}, {
  name: "newRowAttendance.position",
  component:
    <InputField
      theme={theme}
      label="Cargo"
      placeholder="Cargo"
      name="newRowAttendance.position"
    />
}, {
  name: "newRowAttendance.document",
  component:
    <InputField
      theme={theme}
      label="Número de documento"
      placeholder="Número de documento"
      name="newRowAttendance.document"
    />
}, {
  name: "newRowAttendance.signature",
  component:
    <SignatureField
      theme={theme}
      label="Firma"
      height={150}
      showDownload={false}
      name="newRowAttendance.signature"
    />
}]