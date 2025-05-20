import { Curriculum, Maintenance, Inspection, Accessory, User } from "@/interfaces/context.interface"
import Section from "@/features/documents/sections/preview/curriculum/PreviewCV"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { Card, CardContent } from "#/ui/card"
import { useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

const PreviewCurriculumSection = () => {
  const { isAuth } = useAuthContext()
  const { theme } = useThemeContext()
  const { id = '' } = useParams()
  const isMobile = useIsMobile()

  /** queries methods without desestructuring */
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  /** basic data equipment, references company and client */
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id)
  const { data: com, isLoading: isLoadingCom } = queryUser.fetchUserByQuery<User>({ role: 'company' })
  const { data: mts, isLoading: isLoadingMt } = queryFormat.fetchFormatByQuery<Maintenance>('maintenance', { curriculum: id, enabled: !!id && isAuth })
  const maintenances = useMemo(() => mts?.filter((mt) => mt.curriculum?._id === id), [mts])
  const company = useMemo(() => com?.filter((c) => !c?.belongsTo)[0] as User, [com])
  const client = useMemo(() => cv?.office?.headquarter?.client, [cv])

  /** complementaries curriculum */
  const { data: ins, isLoading: isLoadingIns } = queryFormat.fetchFormatById<Inspection>('inspection', cv?.inspection._id as string, { enabled: !!cv && isAuth })
  const { data: acc, isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id && isAuth })
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
              <Section.Equipment theme={theme} cv={cv} accs={acc} auth={isAuth} />
              {/*** Details associated and stakeholders ***/}
              <Section.Details theme={theme} cv={cv} />
              {/*** Info of maintenance, inspection and specifications ***/}
              <Section.Maintenance theme={theme} cv={cv} ins={ins} auth={isAuth} />
              {/*** Characteristics and provider service information ***/}
              <Section.Footer theme={theme} cv={cv} com={company} />
            </CardContent>
          </Card>
          {isAuth && maintenances && <Section.MaintenanceHistory theme={theme} mt={maintenances} company={company} />}
        </>
      )}
    </div>
  )
}

export default PreviewCurriculumSection
