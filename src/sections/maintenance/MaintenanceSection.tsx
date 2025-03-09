import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useTabs } from '@/hooks/core/useTabs'
import { useState } from 'react'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import TableMaintenanceSection from './TableMaintenanceSection'
import FormMaintenanceSection from './FormMaintenanceSection'
const route = '/form/maintenance'

interface MaintenanceSectionProps extends ThemeContextProps { id: string | undefined }

const MaintenanceSection = ({ theme, id }: MaintenanceSectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useTabs({ id, setTab, to: route })

  return (
    <main className="container p-6">
      <Tabs value={tab} onValueChange={handle}>
        {/* Local action tabs */}
        <TabsList className={cn(
          "bg-muted/60 backdrop-blur transition-all",
          "supports-[backdrop-filter]:bg-background/60"
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
          <TableMaintenanceSection theme={theme} onChange={() => handle('form')} />
        </TabsContent>
        <TabsContent value="form">
          <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
            <FormMaintenanceSection id={id} theme={theme} onChange={() => handle('table')} />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default MaintenanceSection