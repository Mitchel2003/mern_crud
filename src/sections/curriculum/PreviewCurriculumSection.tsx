import { Curriculum, Inspection, Accessory, ThemeContextProps, Company } from "@/interfaces/context.interface"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useUserQuery"
import { Metadata } from "@/interfaces/db.interface"

import MaintenancePreviewCV from "#/pages/curriculum/preview/MaintenancePreviewCV"
import EquipmentPreviewCV from "#/pages/curriculum/preview/EquipmentPreviewCV"
import DetailsPreviewCV from "#/pages/curriculum/preview/DetailsPreviewCV"
import ClientPreviewCV from "#/pages/curriculum/preview/ClientPreviewCV"
import FooterPreviewCV from "#/pages/curriculum/preview/FooterPreviewCV"
import HeaderPreviewCV from "#/pages/curriculum/preview/HeaderPreviewCV"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { Card, CardContent } from "#/ui/card"
import { Button } from "#/ui/button"

import CurriculumPDF from '@/lib/export/CurriculumPDF'
import { PDFDownloadLink } from "@react-pdf/renderer"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreviewCurriculumSectionProps extends ThemeContextProps { id: string }

const PreviewCurriculumSection = ({ theme, id }: PreviewCurriculumSectionProps) => {
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  const { data: com, isLoading: isLoadingCom } = queryUser.fetchAllUsers<Company>('company')
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id)
  const { data: ins, isLoading: isLoadingIns } = queryFormat.fetchFormatById<Inspection>('inspection', cv?.inspection._id as string)
  const { data: acc, isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const idClient = cv?.office?.headquarter?.client._id
  const idCompany = com?.[0]?._id

  const { data: imgCli = [], isLoading: isLoadingImgCl } = queryFormat.fetchAllFiles<Metadata>('file', { path: `client/${idClient}/preview`, enabled: !!idClient })
  const { data: imgCom = [], isLoading: isLoadingImgCom } = queryFormat.fetchAllFiles<Metadata>('file', { path: `company/${idCompany}/preview`, enabled: !!idCompany })
  const { data: imgCv = [], isLoading: isLoadingImgCv } = queryFormat.fetchAllFiles<Metadata>('file', { path: `files/${id}/preview`, enabled: !!id })
  const isLoadingData = isLoadingCv || isLoadingIns || isLoadingAcc || isLoadingCom
  const isLoadingFile = isLoadingImgCv || isLoadingImgCl || isLoadingImgCom

  if (isLoadingData || isLoadingFile) return <DashboardSkeleton theme={theme} />
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/** PDF download link ***/}
      {cv && (
        <PDFDownloadLink
          fileName={`cv-${cv._id}.pdf`}
          document={<CurriculumPDF companyLogo={imgCom?.[0]?.url} clientLogo={imgCli?.[0]?.url} accessories={acc} inspection={ins} cv={cv} />}
        >
          {({ loading }) => (
            <Button variant="default" disabled={loading} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      )}

      {/** Curriculum preview ***/}
      {cv && (
        <Card className={cn(
          'max-w-5xl mx-auto bg-gradient-to-br',
          theme === 'dark'
            ? 'border-purple-100 from-gray-800 to-gray-900'
            : 'border-purple-100 from-white to-purple-50/30'
        )}>
          <HeaderPreviewCV theme={theme} client={imgCli?.[0]?.url} />
          <CardContent className="grid gap-8 px-6">
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