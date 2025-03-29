import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import FormEngineerSection from '../../flow/user/FormUserSection'
import TableEngineerSection from './TableEngineerSection'
const route = '/engineer'

interface EngineerSectionProps extends ThemeContextProps { id: string | undefined }

const EngineerSection = ({ theme, id }: EngineerSectionProps) => {
  const { tab, handle } = useTabs({ id, to: route })
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={cn('text-2xl font-bold tracking-tight', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          Ingenieros de servicio
        </h1>
      </div>

      <Tabs value={tab} onValueChange={handle}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          <TableEngineerSection theme={theme} onChange={handle} />
        </TabsContent>
        <TabsContent value="form">
          <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
            <FormEngineerSection id={id} theme={theme} onChange={() => handle('table')} role="engineer" />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EngineerSection