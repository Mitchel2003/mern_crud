import PreviewCurriculumSection from "@/sections/curriculum/PreviewCurriculumSection"
import CurriculumSection from "@/sections/curriculum/CurriculumSection"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { useThemeContext } from "@/context/ThemeContext"
import { useParams } from "react-router-dom"
import { Shell } from "#/ui/shell"
import { Suspense } from "react"

import { FeatureFlagsProvider } from "@/components/pages/curriculum/data-table-advanced/feature-flags-provider"
import { DataTableSkeleton } from "@/components/ui/data-table-advanced/data-table-skeleton"
import { DateRangePicker } from "@/components/ui/data-table-advanced/date-range-picker"
import { CurriculumTable } from "@/components/pages/curriculum/data-table-advanced/tasks-table"
import { useCurriculumTable } from "@/hooks/use-curriculum-table"
import { type Curriculum } from "@/interfaces/context.interface"
import { Skeleton } from "#/ui/skeleton"

const Curriculum = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <CurriculumSection theme={theme} id={id} />
    </Suspense>
  )
}
export default Curriculum
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------preview--------------------------------------------------*/
export const PreviewCurriculum = () => {
  const { theme } = useThemeContext()
  const { id } = useParams()

  return (
    <Suspense fallback={<DashboardSkeleton theme={theme} />}>
      <PreviewCurriculumSection theme={theme} id={id as string} />
    </Suspense>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------data-table-advanced--------------------------------------------------*/
export const IndexPage = () => {
  const { data, pageCount } = useCurriculumTable()
  const { theme } = useThemeContext()

  return (
    <Shell className="gap-2">
      <FeatureFlagsProvider>
        <Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerClassName="ml-auto w-56 sm:w-60"
            triggerSize="sm"
            shallow={false}
            align="end"
          />
        </Suspense>
        <Suspense
          fallback={
            <DataTableSkeleton
              shrinkZero
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
            />
          }
        >
          <CurriculumTable
            pageCount={pageCount}
            theme={theme}
            data={data}
          />
        </Suspense>
      </FeatureFlagsProvider>
    </Shell>
  )
}