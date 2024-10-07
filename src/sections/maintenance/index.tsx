import HeaderCustom from "#/reusables/elements/HeaderCustom"
import HeaderText from "#/reusables/elements/HeaderText"
import { Card, CardContent, CardFooter } from "#/ui/card"
import { Button } from "#/ui/button"
import { Form } from "#/ui/form"

import ReferenceEquipmentSection from "./ReferenceEquipmentSection"
import MaintenanceSection from "./MaintenanceSection"
import InspectionSection from "./InspectionSection"
import EquipmentSection from "./EquipmentSection"
import ClientSection from "./ClientSection"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { RenderFormat, SectionProps } from "@/utils/RenderFormat"
import { CheckSquare, Ban } from "lucide-react"
import { useForm } from "react-hook-form"

interface MaintenanceProps extends ThemeContextProps { }
const Maintenance = ({ theme }: MaintenanceProps) => {
  const form = useForm()

  const renderMaintenance: SectionProps[] = [
    { component: <ClientSection theme={theme} /> },
    { component: <ReferenceEquipmentSection theme={theme} /> },
    { component: <EquipmentSection theme={theme} /> },
    { component: <MaintenanceSection theme={theme} /> },
    { component: <InspectionSection theme={theme} /> },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>

        {/* Component curriculum */}
        <Card className={`w-full max-w-6xl mx-auto shadow-lg backdrop-filter backdrop-blur-lg
          ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-50'}`}
        >
          {/* Header form */}
          <Card className={`border-none rounded-lg rounded-b-none shadow-none
            ${theme === 'dark' ? 'bg-zinc-950/40' : 'bg-zinc-300/30'}`}
          >
            <HeaderText
              theme={theme}
              title="Proceso de calidad - Equipos biomedicos"
              description="Formato de mantenimiento preventivo y correctivo"
            />
          </Card>

          {/* information breadcrumbs */}
          <Card className={`border-none rounded-none shadow-none
            ${theme === 'dark' ? 'bg-zinc-900/50' : 'bg-zinc-200/30'}`}
          >
            <div className="flex p-2 justify-between">
              <HeaderCustom
                to="component"
                theme={theme}
                title="Codigo formato: FMP-RL-01"
              />
              <HeaderCustom
                to="component"
                theme={theme}
                title="Versión: 02"
              />
            </div>
          </Card>

          {/* Sections form */}
          <CardContent className="space-y-8 pt-6">
            <RenderFormat format={renderMaintenance} theme={theme} />
          </CardContent>

          {/* Footer form (Buttons submit) */}
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className={`hover:scale-105
                ${theme === 'dark'
                  ? 'bg-zinc-700 border border-zinc-600 text-zinc-100 hover:bg-zinc-900'
                  : 'bg-white border border-gray-200 text-gray-900 hover:bg-white'
                }`}
            >
              <Ban className="text-red-600 mr-2 h-4 w-4" /> Cancelar
            </Button>

            <Button
              type="submit"
              className={`hover:scale-105
                ${theme === 'dark'
                  ? 'bg-zinc-700 border border-zinc-600 text-zinc-100 hover:bg-zinc-900'
                  : 'bg-white border border-gray-200 text-gray-900 hover:bg-white'
                }`}
            >
              <CheckSquare className="text-green-600 mr-2 h-4 w-4" /> Guardar
            </Button>
          </CardFooter>

        </Card>
      </form>
    </Form >
  )
}

export default Maintenance