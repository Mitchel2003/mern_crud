import EquipmentDetailDialog from "@/features/preview/sections/client/EquipmentDetailDialog"
import ClientHeaderSection from "@/features/preview/sections/client/ClientHeaderSection"
import TabsContentSection from "@/features/preview/sections/client/TabsContentSection"
import { useClientPreview } from "@/features/preview/hooks/useClientPreview"
import StatsSection from "@/features/preview/sections/client/StatsSection"
import BadgeWarning from "@/components/common/skeletons/BadgeWarning"
import { Curriculum } from "@/interfaces/context.interface"
import { useNavigate, useParams } from "react-router-dom"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import BadgeError from "#/common/skeletons/BadgeError"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Main client preview page
 * Integrates all sections and manages the global page state
 */
const ClientPreviewPage = () => {
  const [selectedCv, setSelectedCv] = useState<Curriculum & { status: string } | null>(null)
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false)
  const { theme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams()

  const { clientData, loading, error, getEstadoBadgeColor, navigateToMaintenance, navigateToCurriculum } = useClientPreview(id)

  /** Opens the equipment detail dialog */
  const open = (curriculum: Curriculum & { status: string }) => { setSelectedCv(curriculum); setIsCurriculumOpen(true) }

  if (loading) return <Skeleton theme={theme} />
  if (error) return (
    <BadgeError
      variant="default"
      hideBackButton={false}
      text="Cliente no encontrado"
      error="No se encontró información para el cliente solicitado."
    />
  )
  if (!id) return (
    <BadgeWarning
      variant="subtle"
      title="ID de cliente no proporcionado"
      onActionClick={() => navigate('/clients')}
      actionLabel="Regresar a lista de clientes"
      textContent="Es necesario proporcionar un ID de cliente válido en la URL para visualizar su información."
    />
  )
  return (
    <div className="p-6">
      <motion.div className={cn("max-w-7xl mx-auto space-y-6")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <ClientHeaderSection clientData={clientData} />
        <StatsSection clientData={clientData} />
        <TabsContentSection
          clientData={clientData}
          onOpenCurriculum={open}
          getEstadoBadgeColor={getEstadoBadgeColor}
          onNavigateToCurriculum={navigateToCurriculum}
          onNavigateToMaintenance={navigateToMaintenance}
        />

        {/* Dialog details */}
        <EquipmentDetailDialog
          isOpen={isCurriculumOpen}
          selectedCurriculum={selectedCv}
          onOpenChange={setIsCurriculumOpen}
          getEstadoBadgeColor={getEstadoBadgeColor}
        />
      </motion.div>
    </div>
  )
}

export default ClientPreviewPage