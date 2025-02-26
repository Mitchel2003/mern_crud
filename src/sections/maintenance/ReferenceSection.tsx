import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceForm } from "@/hooks/auth/useFormatForm"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Metadata } from "@/interfaces/db.interface"
import { useFormContext } from "react-hook-form"
import { Search } from "lucide-react"

import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"

interface ReferenceProps extends ThemeContextProps { }

const ReferenceSection = ({ theme }: ReferenceProps) => {
  const { referenceData: options } = useMaintenanceForm()
  const { watch } = useFormContext()
  const clientId = watch('client.name')
  const cvId = watch('curriculum')

  const { data: img } = useQueryFormat().fetchAllFiles<Metadata>('file', { path: `files/${cvId}/preview`, enabled: !!cvId })
  const curriculum = options.curriculums?.filter((cv: Curriculum) => cv.office.headquarter?.client?._id === clientId)
  const client = options.clients?.find((client) => client._id === clientId)

  const selectedCv: Curriculum = options.curriculums?.find((cv: Curriculum) => cv._id === cvId) || {}
  return (
    <div className="space-y-4">
      {/* -------------------- Selects -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        iconSpan="alert"
        title="Mantenimiento para:"
        className="text-2xl font-light"
        span="Propocione la referencia de ubicacion"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <SelectField
          theme={theme}
          label="Cliente"
          name="client.name"
          placeholder="Seleccionar cliente"
          options={options.clients?.map((c) => ({ label: c.name, value: c._id })) || []}
        />
        <SelectField
          readOnly
          options={[]}
          theme={theme}
          label="Email"
          name="client.email"
          value={client?.email}
          placeholder="Seleccionar email"
        />
        <SelectField
          readOnly
          label="NIT"
          options={[]}
          theme={theme}
          name="client.nit"
          value={client?.nit}
          placeholder="Seleccionar NIT"
        />
        <SelectField
          theme={theme}
          name="curriculum"
          label="Seleccion de equipo"
          placeholder="Seleccionar equipo"
          options={curriculum?.map((c: Curriculum) => ({ label: c.name, value: c._id })) || []}
        />
      </div>

      <Separator />

      {/* -------------------- Equipment -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        title="Referencia del equipo"
        className="text-2xl font-light"
        span="Campos automaticos"
        iconSpan="warn"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="grid gap-4 lg:col-span-3 lg:grid-cols-2">
          {/* input of 2 columns */}
          <div className="md:col-span-2">
            <InputField
              readOnly
              theme={theme}
              name="cv.name"
              label="Nombre"
              placeholder="Nombre del equipo"
              value={selectedCv.name}
            />
          </div>
          <InputField
            readOnly
            theme={theme}
            name="cv.brand"
            label="Marca"
            placeholder="Marca del equipo"
            value={selectedCv.brand}
          />
          <InputField
            readOnly
            theme={theme}
            label="Modelo"
            name="cv.modelEquip"
            placeholder="Modelo del equipo"
            value={selectedCv.modelEquip}
          />
          <InputField
            readOnly
            theme={theme}
            label="Serie"
            name="cv.serie"
            placeholder="Número de serie"
            value={selectedCv.serie}
          />
          <InputField
            readOnly
            theme={theme}
            name="cv.healthRecord"
            label="Registro Sanitario"
            placeholder="Número de registro (invima)"
            value={selectedCv.healthRecord}
          />
        </div>

        <div className="lg:col-span-2">
          <HeaderCustom
            to="input"
            theme={theme}
            iconSpan="info"
            span="Imagen del equipo"
          />
          <div className="relative group rounded-lg overflow-hidden">
            <img alt="Equipo" className="w-full max-h-52 object-cover" src={img?.[0]?.url || "https://placehold.co/200x200/e2e2e2/666666?text=Sin+imagen"} />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20" onClick={() => window.open(img?.[0]?.url, '_blank')}>
                <Search className="w-4 h-4 mr-2" />
                Ver imagen completa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferenceSection