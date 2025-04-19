import { ThemeContextProps, User } from '@/interfaces/context.interface'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import TableScheduleSection from './TableScheduleSection'
import FormScheduleSection from './FormScheduleSection'
const route = '/form/schedule'

interface ScheduleSectionProps extends ThemeContextProps { id: string | undefined, credentials: User }

const ScheduleSection = ({ id, theme, credentials }: ScheduleSectionProps) => {
  const { tab, isQuery, handle } = useTabs({ id, to: route, startOn: credentials?.role === 'client' ? 'form' : 'table' })
  const params = id && isQuery ? JSON.parse(decodeURIComponent(id)) : null
  return (
    <main className="container p-2 sm:p-4">
      <Tabs value={tab} onValueChange={handle}>
        {/* Local action tabs */}
        <TabsList className={cn(
          "bg-muted/60 backdrop-blur transition-all",
          "supports-[backdrop-filter]:bg-background/60",
          credentials?.role === 'client' && 'hidden'
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
          <TableScheduleSection theme={theme} onChange={() => handle('form')} params={params} />
        </TabsContent>
        <TabsContent value="form">
          <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
            <FormScheduleSection theme={theme} onChange={() => handle('table')} />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default ScheduleSection