import { Curriculum, Inspection, Accessory, ThemeContextProps, User } from "@/interfaces/context.interface"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { Metadata } from "@/interfaces/db.interface"

import MaintenancePreviewCV from "#/pages/documents/curriculum/MaintenancePreviewCV"
import EquipmentPreviewCV from "#/pages/documents/curriculum/EquipmentPreviewCV"
import DetailsPreviewCV from "#/pages/documents/curriculum/DetailsPreviewCV"
import ClientPreviewCV from "#/pages/documents/curriculum/ClientPreviewCV"
import FooterPreviewCV from "#/pages/documents/curriculum/FooterPreviewCV"
import HeaderPreviewCV from "#/pages/documents/curriculum/HeaderPreviewCV"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { Card, CardContent } from "#/ui/card"
import { cn } from "@/lib/utils"

interface PreviewCurriculumSectionProps extends ThemeContextProps {
  isMobile: boolean
  id: string
}

const PreviewCurriculumSection = ({ id, theme, isMobile }: PreviewCurriculumSectionProps) => {
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id)
  const { data: com, isLoading: isLoadingCom } = queryUser.fetchUserByQuery<User>({ role: 'company' })
  const { data: ins, isLoading: isLoadingIns } = queryFormat.fetchFormatById<Inspection>('inspection', cv?.inspection._id as string)
  const { data: acc, isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const idClient = cv?.office?.headquarter?.user?._id
  const idCompany = com?.[0]?._id

  const { data: imgCom = [], isLoading: isLoadingImgCom } = queryFormat.fetchAllFiles<Metadata>({ path: `company/${idCompany}/preview`, enabled: !!idCompany })
  const { data: imgCli = [], isLoading: isLoadingImgCl } = queryFormat.fetchAllFiles<Metadata>({ path: `client/${idClient}/preview`, enabled: !!idClient })
  const { data: imgCv = [], isLoading: isLoadingImgCv } = queryFormat.fetchAllFiles<Metadata>({ path: `files/${id}/preview`, enabled: !!id })
  const isLoadingData = isLoadingCv || isLoadingIns || isLoadingAcc || isLoadingCom
  const isLoadingFile = isLoadingImgCv || isLoadingImgCl || isLoadingImgCom

  if (isLoadingData || isLoadingFile) return <Skeleton theme={theme} />
  return (
    <div className="container p-2">
      {cv && (
        <Card className={cn(
          'max-w-5xl mx-auto bg-gradient-to-br',
          theme === 'dark'
            ? 'border-purple-100 from-gray-800 to-gray-900'
            : 'border-purple-100 from-white to-purple-50/30'
        )}>
          <HeaderPreviewCV theme={theme} client={imgCli?.[0]?.url} isMobile={isMobile} />
          <CardContent className="grid gap-6 px-4 sm:px-6">
            {/*** Info of client ***/}
            <ClientPreviewCV theme={theme} cv={cv} client={imgCli?.[0]?.url} />
            {/*** Basic data, class biomedical and accessories associated ***/}
            <EquipmentPreviewCV theme={theme} cv={cv} accs={acc} imgCv={imgCv?.[0]?.url} />
            {/*** Details associated and stakeholders ***/}
            <DetailsPreviewCV theme={theme} cv={cv} />
            {/*** Info of maintenance, inspection and specifications ***/}
            <MaintenancePreviewCV theme={theme} cv={cv} ins={ins} />
            {/*** Characteristics and provider service information ***/}
            <FooterPreviewCV theme={theme} cv={cv} com={com?.[0]} imgCom={imgCom?.[0]?.url} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PreviewCurriculumSection