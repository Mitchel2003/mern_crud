import Section from "@/features/navigation/sections/equipmentHub/EquipHub"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Curriculum } from "@/interfaces/context.interface"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { Navigate, useParams } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"
import NotFound from "#/common/skeletons/NotFound"
import { useState } from "react"

const EquipmentHub = () => {
  const [regulationsDrawerOpen, setRegulationsDrawerOpen] = useState<string | undefined>(undefined)
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false)
  const { fetchFormatById } = useQueryFormat()
  const { isAuth, user } = useAuthContext()
  const { theme } = useThemeContext()
  const { id } = useParams()

  const { data: cv, isLoading } = fetchFormatById<Curriculum>('cv', id as string, { enabled: !!id })

  if (!id && !isAuth) return <Navigate to="/" />
  if (isLoading) return <Skeleton theme={theme} />
  if (!cv && !isLoading && id) return <NotFound theme={theme} />
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <Section.HeaderSection theme={theme} cv={cv} user={user} />{/** Header section, contain client and equipment information */}
      <Section.RegulationSection theme={theme} setOpen={setRegulationsDrawerOpen} />{/** Information section, contain regulations quality */}
      <Section.NavigationSection theme={theme} setOpen={setScheduleDrawerOpen} cv={cv} auth={isAuth} />{/** Nav section, contain navigation */}
      <Section.FooterHelp theme={theme} />{/** Footer Help, contain contact information */}

      {/** Drawers (toogleable) */}
      <Section.ScheduleDrawer theme={theme} isOpen={scheduleDrawerOpen} onClose={() => setScheduleDrawerOpen(false)} />{/* Drawer de cronogramas */}
      <Section.RegulationsDrawer theme={theme} tabOpen={regulationsDrawerOpen} setOpen={setRegulationsDrawerOpen} />{/* Drawer de regulaciones */}
    </main>
  )
}

export default EquipmentHub