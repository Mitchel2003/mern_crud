import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "#/ui/card"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"

import TechnicalCharacteristicsSection from "./curriculum/TechnicalCharacteristicsSection"
import EquipmentClassificationSection from "./curriculum/EquipmentClassificationSection"
import DetailsEquipmentSection from "./curriculum/DetailsEquipmentSection"
import EngineerServiceSection from "./curriculum/EngineerServiceSection"
import CharacteristicsSection from "./curriculum/CharacteristicsSection"
import MaintenanceSection from "./curriculum/MaintenanceSection"
import AccessoriesSection from "./curriculum/AccessoriesSection"
import OfficeAreaSection from "./curriculum/OfficeAreaSection"
import BasicDataSection from "./curriculum/BasicDataSection"

import { useForm } from "react-hook-form"
import { Form } from "#/ui/form"

const Curriculum = () => {
  const form = useForm()

  return (
    <>
      {/* CV - Curriculum Vitae */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => console.log(data))}>
          <Card className="w-full max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-white shadow-lg">

            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-3xl font-bold text-center">Formato CV - Equipo Biomédico</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
              <CurriculumSection section={<OfficeAreaSection />} />
              <CurriculumSection section={<BasicDataSection />} />
              <CurriculumSection section={<DetailsEquipmentSection />} />
              <CurriculumSection section={<EquipmentClassificationSection />} />
              <CurriculumSection section={<TechnicalCharacteristicsSection />} />
              <CurriculumSection section={<MaintenanceSection />} />
              <CurriculumSection section={<AccessoriesSection />} />
              <CurriculumSection section={<CharacteristicsSection />} />
              <CurriculumSection section={<EngineerServiceSection />} />
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </CardFooter>

          </Card>
        </form>
      </Form >
    </>
  )
}

export default Curriculum
/* --------------------------------------------------------------------------------------------------------- */

/*--------------------------------------------------tools--------------------------------------------------*/
type CurriculumSectionProps = { section: React.ReactNode }
const CurriculumSection = ({ section }: CurriculumSectionProps) => {
  return (
    <>
      {section}
      <Separator className="my-8" />
    </>
  )
}