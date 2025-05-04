import { Curriculum, Maintenance, Inspection, Accessory, User } from "@/interfaces/context.interface"
import Section from "@/features/documents/sections/preview/curriculum/PreviewCV"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { Card, CardContent } from "#/ui/card"
import { useParams } from "react-router-dom"
import { cn } from "@/lib/utils"

const PreviewCurriculumSection = () => {
  const { theme } = useThemeContext()
  const { id = '' } = useParams()
  const isMobile = useIsMobile()

  /** queries methods without desestructuring */
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  /** basic data equipment, references company and client */
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id)
  const { data: com, isLoading: isLoadingCom } = queryUser.fetchUserByQuery<User>({ role: 'company' })
  const { data: mt, isLoading: isLoadingMt } = queryFormat.fetchFormatByQuery<Maintenance>('maintenance', { curriculum: id })
  const client = cv?.office?.headquarter?.client
  const company = com?.[0] as User

  /** complementaries curriculum */
  const { data: ins, isLoading: isLoadingIns } = queryFormat.fetchFormatById<Inspection>('inspection', cv?.inspection._id as string, { enabled: !!cv })
  const { data: acc, isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const isLoadingData = isLoadingCv || isLoadingMt || isLoadingAcc || isLoadingIns || isLoadingCom
  if (isLoadingData) return <Skeleton theme={theme} />
  return (
    <div className="container p-2 space-y-4">
      {cv && (
        <>
          <Card className={cn('max-w-5xl mx-auto bg-gradient-to-br', theme === 'dark'
            ? 'border-zinc-800 from-zinc-900 to-zinc-800 shadow-md'
            : 'border-purple-100 from-white to-purple-50/30'
          )}>
            <Section.Header theme={theme} client={client} isMobile={isMobile} />
            <CardContent className="grid gap-6 px-4 sm:px-6">
              {/*** Info of client ***/}
              <Section.Client theme={theme} cv={cv} client={client} />
              {/*** Basic data, class biomedical and accessories associated ***/}
              <Section.Equipment theme={theme} cv={cv} accs={acc} />
              {/*** Details associated and stakeholders ***/}
              <Section.Details theme={theme} cv={cv} />
              {/*** Info of maintenance, inspection and specifications ***/}
              <Section.Maintenance theme={theme} cv={cv} ins={ins} />
              {/*** Characteristics and provider service information ***/}
              <Section.Footer theme={theme} cv={cv} com={company} />
            </CardContent>
          </Card>
          {mt && <Section.MaintenanceHistory theme={theme} mt={mt} company={company} />}
        </>
      )}
    </div>
  )
}

export default PreviewCurriculumSection
