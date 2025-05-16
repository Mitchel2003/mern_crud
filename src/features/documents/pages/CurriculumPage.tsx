import TableCurriculumSection from '@/features/documents/sections/curriculum/TableCurriculumSection'
import FormCurriculumSection from '@/features/documents/sections/curriculum/FormCurriculumSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useAuthContext } from "@/context/AuthContext"
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import { createTheme, ThemeProvider } from "@mui/material"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useParams } from "react-router-dom"
import { Suspense } from "react"
const route = '/form/curriculum'

const CurriculumPage = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  const { id } = useParams()

  const table = createTheme({ palette: { mode: theme } }) //theme table
  const { tab, isQuery, handle } = useTabs({ id, to: route }) //handle tabs
  const params = id && isQuery ? JSON.parse(decodeURIComponent(id)) : null
  const userAllowed = user?.role === 'company' || user?.role === 'collaborator'
  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <main className="container p-2 sm:p-4">
          <Tabs value={tab} onValueChange={handle}>
            {/* Local action tabs */}
            <TabsList className={cn(
              !userAllowed && 'hidden',
              "bg-muted/60 backdrop-blur transition-all",
              "supports-[backdrop-filter]:bg-background/60",
            )}>
              <TabsTrigger
                value="table"
                className={cn(
                  'flex px-6 gap-2 items-center',
                  'duration-200 hover:scale-105 hover:bg-accent/50'
                )}
              >
                Tabla <TableProperties className='h-4 w-4' />
              </TabsTrigger>
              <TabsTrigger
                value="form"
                className={cn(
                  'flex px-6 gap-2 items-center',
                  'duration-200 hover:scale-105 hover:bg-accent/50'
                )}
              >
                Añadir <PlusCircle className='h-4 w-4' />
              </TabsTrigger>
            </TabsList>

            {/* tabs content */}
            <TabsContent value="table">
              <TableCurriculumSection theme={theme} onChange={() => handle('form')} credentials={user!} params={params} />
            </TabsContent>
            <TabsContent value="form">
              <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
                <FormCurriculumSection id={id} theme={theme} onChange={() => handle('table')} />
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </ThemeProvider>
    </Suspense>
  )
}
export default CurriculumPage