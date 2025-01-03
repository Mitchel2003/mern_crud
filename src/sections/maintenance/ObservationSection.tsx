import HeaderCustom from "#/common/elements/HeaderCustom"
import StatusCheck from "#/common/fields/StatusCheck"
import DateField from "#/common/fields/Date"
import AreaField from "#/common/fields/Area"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { CheckProps } from "@/interfaces/props.interface"
import { useForm, FormProvider } from 'react-hook-form'
import { Check, X, Clock } from "lucide-react"
import { useState, useEffect } from 'react'

const statusOptions: CheckProps[] = [
  { name: 'good', label: 'Buen estado', color: 'green', icon: Check },
  { name: 'wait', label: 'En espera de repuestos', color: 'yellow', icon: Clock },
  { name: 'out', label: 'Fuera de servicio', color: 'red', icon: X },
]

interface ObservationSectionProps extends ThemeContextProps { }
const ObservationSection = ({ theme }: ObservationSectionProps) => {
  const [currentDate, setCurrentDate] = useState<string>('')
  const methods = useForm()

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toISOString().split('T')[0])
  }, [])

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          title="Observaciones"
          className="text-2xl font-bold"
          span="Detalles de la revisión"
          iconSpan="info"
        />

        <div className="grid grid-cols-1 gap-6">
          {/* -------------------- Description -------------------- */}
          <AreaField
            theme={theme}
            name="description"
            label="Descripción"
            placeholder="Describa la rutina del mantenimiento"
            span="Informe sobre actividades u observaciones realizadas"
            iconSpan="none"
          />
          {/* -------------------- Status equipment -------------------- */}
          <StatusCheck
            theme={theme}
            options={statusOptions}
            name="equipmentStatus"
            label="Estado del equipo"
            span="Indique la disponibilidad del equipo"
            iconSpan="warn"
          />

          {/* -------------------- Current date and next maintenance -------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateField
              theme={theme}
              name="currentDate"
              label="Fecha actual"
              value={currentDate}
              readOnly={true}
            />
            <DateField
              theme={theme}
              name="nextMaintenanceDate"
              label="Fecha próximo mantenimiento"
              placeholder="Seleccione la fecha"
            />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default ObservationSection