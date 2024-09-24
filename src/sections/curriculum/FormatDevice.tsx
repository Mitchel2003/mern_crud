import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "#/ui/card"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"

import TechnicalCharacteristicsSection from "./TechnicalCharacteristicsSection"
import EngineerReferenceSection from "./EngineerReferenceSection"
import EntityReferenceSection from "./EntityReferenceSection"
import CharacteristicsSection from "./CharacteristicsSection"
import DeviceDetailsSection from "./DeviceDetailsSection"
import GeneralDataSection from "./GeneralDataSection"
import MaintenanceSection from "./MaintenanceSection"
import AccessoriesSection from "./AccessoriesSection"
import EquipmentSection from "./EquipmentSection"

import { useForm } from "react-hook-form"
import { Form } from "#/ui/form"

const FormatDevice = () => {
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

              <EntityReferenceSection />

              <Separator className="my-8" />

              <GeneralDataSection />

              <Separator className="my-8" />

              <DeviceDetailsSection />

              <Separator className="my-8" />

              <TechnicalCharacteristicsSection />

              <Separator className="my-8" />

              <EquipmentSection />

              <Separator className="my-8" />

              <MaintenanceSection />

              <Separator className="my-8" />

              <AccessoriesSection />

              <Separator className="my-8" />

              <CharacteristicsSection />

              <Separator className="my-8" />

              <EngineerReferenceSection />

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

export default FormatDevice
