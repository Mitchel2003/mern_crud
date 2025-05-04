import Section from "@/features/navigation/sections/documentsHub/DocsHub"
import { useThemeContext } from "@/context/ThemeContext"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

const DocumentsHub = () => {
  const [regulationsDrawerOpen, setRegulationsDrawerOpen] = useState<string | undefined>(undefined)
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false)
  const { theme } = useThemeContext()
  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div className="mb-8 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className={cn("text-3xl md:text-4xl font-bold mb-2", theme === "dark" ? "text-white" : "text-gray-800")}>
          Centro de Recursos
        </h1>
        <p className={cn("text-lg max-w-3xl mx-auto", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
          Acceda a toda la información técnica de sus equipos médicos, mantenimientos y cronogramas en un solo lugar
        </p>
      </motion.div>

      <Section.InformationCard theme={theme} setOpen={setRegulationsDrawerOpen} />{/** Information Card */}
      <Section.NavCard theme={theme} setOpen={setScheduleDrawerOpen} />{/** Nav Card */}
      <Section.FooterHelp theme={theme} />{/** Footer Help, contain contact information */}
      <Section.ScheduleDrawer theme={theme} isOpen={scheduleDrawerOpen} onClose={() => setScheduleDrawerOpen(false)} />{/* Drawer de cronogramas */}
      <Section.RegulationsDrawer theme={theme} tabOpen={regulationsDrawerOpen} setOpen={setRegulationsDrawerOpen} />{/* Drawer de regulaciones */}
    </main>
  )
}

export default DocumentsHub
