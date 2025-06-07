import { Curriculum, Headquarter, Office, ThemeContextProps, User } from "@/interfaces/context.interface"
import { getInspectionTags } from "@/constants/format.constants"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Metadata } from "@/interfaces/db.interface"
import { CheckCircle, Search } from "lucide-react"
import { useFormContext } from "react-hook-form"

import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface ReferenceProps extends ThemeContextProps {
  options: { clients: User[], offices: Office[], curriculums: Curriculum[], headquarters: Headquarter[] }
  autocomplete?: string
  id: boolean
}

const ReferenceSection = ({ id, theme, options, autocomplete }: ReferenceProps) => {
  const { watch, setValue } = useFormContext()
  const hqId = watch('headquarter')
  const clientId = watch('client')
  const officeId = watch('office')
  const cvId = watch('curriculum')

  //fetch on the component instead of hooks: by reactive find image of equipment selected
  const { data: img } = useQueryFormat().fetchAllFiles<Metadata>({ path: `files/${cvId}/preview`, enabled: !!cvId })
  const headquarters = (id || autocomplete) ? options.headquarters : options.headquarters?.filter(head => head.client?._id === clientId)
  const curriculums = (id || autocomplete) ? options.curriculums : options.curriculums?.filter(cv => cv.office?._id === officeId)
  const offices = (id || autocomplete) ? options.offices : options.offices?.filter(office => office.headquarter?._id === hqId)
  const selectedCv = curriculums?.find(cv => cv._id === cvId)

  useEffect(() => {
    if ((!headquarters || !curriculums || !offices) || !autocomplete) return
    const cv = options.curriculums?.find(cv => cv._id === autocomplete)
    if (!cv || id) return //if there is no cv or is editing, do nothing

    const office = cv.office?._id
    const headquarter = cv.office?.headquarter?._id
    const client = cv.office?.headquarter?.client?._id
    client && setValue('client', client) //set client
    headquarter && setValue('headquarter', headquarter)
    office && setValue('office', office) //also set office
    setValue('curriculum', cv._id) //finaly use autocomplete
  }, [autocomplete, options.curriculums, id])

  return (
    <div className="space-y-6">
      {/* -------------------- Selects -------------------- */}
      <div key="selects" className="space-y-4">
        <HeaderCustom
          to="component"
          theme={theme}
          iconSpan="alert"
          title="Mantenimiento para:"
          className="text-2xl font-light"
          span="Propocione la referencia de ubicacion"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <SelectField
            theme={theme}
            name="client"
            label="Cliente"
            placeholder="Seleccionar cliente"
            options={options.clients?.map((c) => ({ label: c.username, value: c._id })) || []}
          />
          <SelectField
            theme={theme}
            name="headquarter"
            label="Sede"
            placeholder="Seleccionar sede"
            options={headquarters?.map((h) => ({ label: h.name, value: h._id })) || []}
          />
          <SelectField
            theme={theme}
            name="office"
            label="Oficina"
            placeholder="Seleccionar oficina"
            options={offices?.map((o) => ({ label: o.name, value: o._id })) || []}
          />
          <SelectField
            theme={theme}
            name="curriculum"
            label="Seleccion de equipo"
            placeholder="Seleccionar equipo"
            options={curriculums?.map((c) => ({ label: `${c.name} => ${c.modelEquip}`, value: c._id })) || []}
          />
        </div>
      </div>

      <Separator className={`my-8 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`} />

      {/* -------------------- Equipment -------------------- */}
      <div key="equipment" className="space-y-4">
        <HeaderCustom
          to="component"
          theme={theme}
          iconSpan="warn"
          span="Campos automáticos"
          title="Referencia del equipo"
          className="text-2xl font-light"
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
                value={selectedCv?.name}
              />
            </div>
            <InputField
              readOnly
              theme={theme}
              name="cv.brand"
              label="Marca"
              placeholder="Marca del equipo"
              value={selectedCv?.brand}
            />
            <InputField
              readOnly
              theme={theme}
              label="Modelo"
              name="cv.modelEquip"
              placeholder="Modelo del equipo"
              value={selectedCv?.modelEquip}
            />
            <InputField
              readOnly
              theme={theme}
              label="Serie"
              name="cv.serie"
              placeholder="Número de serie"
              value={selectedCv?.serie}
            />
            <InputField
              readOnly
              theme={theme}
              name="cv.healthRecord"
              label="Registro Sanitario"
              placeholder="Número de registro (invima)"
              value={selectedCv?.healthRecord}
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

      {selectedCv?.inspection && <Separator />}

      {/* -------------------- Inspections -------------------- */}
      {selectedCv?.inspection && (
        <div key="inspections" className="space-y-4">
          <HeaderCustom
            to="component"
            theme={theme}
            iconSpan="info"
            title="Actividades"
            className="text-2xl font-light"
            span="Visualización de actividades"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCv?.inspection?.typeInspection?.map((inspection, index) => (
              <div key={index} className={cn("group relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md", theme === "dark"
                ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                : "bg-white border-purple-100"
              )}>
                <div className={cn("absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity", theme === "dark" ? "bg-zinc-700" : "bg-purple-50")} />
                <div className="flex items-start gap-4">
                  <div className={cn("flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm", theme === "dark" ? "bg-zinc-700 text-purple-300" : "bg-purple-100 text-purple-600")}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{inspection}</h4>
                    <div className="flex flex-wrap gap-2">
                      {getInspectionTags(inspection).map((tag, i) => (
                        <Badge key={i} variant="secondary" className={cn("text-xs", theme === "dark" ? "bg-zinc-700 text-zinc-300" : "bg-purple-50 text-purple-600")}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className={cn("opacity-0 group-hover:opacity-100 transition-opacity", theme === "dark" ? "hover:bg-zinc-700" : "")}>
                    <CheckCircle className={cn("w-4 h-4", theme === "dark" ? "text-purple-300" : "text-purple-600")} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferenceSection