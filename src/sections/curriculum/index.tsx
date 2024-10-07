import HeaderText from "#/reusables/elements/HeaderText"
import { Card, CardContent, CardFooter } from "#/ui/card"
import { Button } from "#/ui/button"
import { Form } from "#/ui/form"

import TechnicalCharacteristicsSection from "./TechnicalCharacteristicsSection"
import EquipmentClassificationSection from "./EquipmentClassificationSection"
import DetailsEquipmentSection from "./DetailsEquipmentSection"
import EngineerServiceSection from "./EngineerServiceSection"
import CharacteristicsSection from "./CharacteristicsSection"
import MaintenanceSection from "./MaintenanceSection"
import AccessoriesSection from "./AccessoriesSection"
import OfficeAreaSection from "./OfficeAreaSection"
import BasicDataSection from "./BasicDataSection"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { RenderFormat, SectionProps } from "@/utils/RenderFormat"
import { CheckSquare, Ban } from "lucide-react"
import { useForm } from "react-hook-form"

interface CurriculumProps extends ThemeContextProps { }
const Curriculum = ({ theme }: CurriculumProps) => {
  const form = useForm()

  const renderCurriculum: SectionProps[] = [
    { component: <OfficeAreaSection theme={theme} /> },
    { component: <BasicDataSection theme={theme} /> },
    { component: <DetailsEquipmentSection theme={theme} /> },
    { component: <EquipmentClassificationSection theme={theme} /> },
    { component: <TechnicalCharacteristicsSection theme={theme} /> },
    { component: <MaintenanceSection theme={theme} /> },
    { component: <AccessoriesSection theme={theme} /> },
    { component: <CharacteristicsSection theme={theme} /> },
    { component: <EngineerServiceSection theme={theme} /> }
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
            ${theme === 'dark' ? 'bg-zinc-900/50' : 'bg-zinc-300/30'}`}
          >
            <HeaderText
              theme={theme}
              title="CV - Equipo Biomédico"
              description="Formato de Curriculum Vitae para equipos biomedicos"
            />
          </Card>

          {/* Sections form */}
          <CardContent className="space-y-8 pt-6">
            <RenderFormat format={renderCurriculum} theme={theme} />
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

export default Curriculum