import TableMaintenanceSection from '@/features/documents/sections/maintenance/TableMaintenanceSection'
import FormMaintenanceSection from '@/features/documents/sections/maintenance/FormMaintenanceSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { PlusCircle, TableProperties } from 'lucide-react'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { useAuthContext } from "@/context/AuthContext"
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import { createTheme, ThemeProvider } from '@mui/material'
import { useParams, useLocation } from 'react-router-dom'
import { useThemeContext } from '@/context/ThemeContext'
import { Suspense } from 'react'
const route = '/form/maintenance'

const MaintenancePage = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  const location = useLocation()
  const { id } = useParams()

  const isHistory = location.pathname.includes('history')
  const table = createTheme({ palette: { mode: theme } })

  /* ------------------------------------------------------------------
   * Detect when the encoded param corresponds to a curriculum context.
   * we want the UI to open directly on the FORM tab instead of the table
   * ------------------------------------------------------------------ */
  const isEncoded = id ? id.startsWith('%7B') || id.startsWith('{') : false
  const params = isEncoded ? JSON.parse(decodeURIComponent(id!)) : null
  const startOn = params?.curriculumId ? 'form' : undefined //to form 

  /** handle tabs behavior, support encoded params to table */
  const { tab, isQuery, handle } = useTabs({ id, to: route, startOn })
  const userAllowed = user?.role === 'company' || user?.role === 'collaborator'
  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ThemeProvider theme={table}>
        <main className="container p-2 sm:p-4">
          <Tabs value={tab} onValueChange={handle}>
            {/* Local action tabs */}
            <TabsList className={cn(
              isHistory && 'hidden',
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
              <TableMaintenanceSection theme={theme} credentials={user!} isHistory={isHistory} params={isQuery ? params : null} onChange={() => handle('form')} />
            </TabsContent>
            <TabsContent value="form">
              <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
                <FormMaintenanceSection id={id} theme={theme} onChange={() => handle('table')} autocomplete={params?.curriculumId} />
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </ThemeProvider>
    </Suspense>
  )
}

export default MaintenancePage