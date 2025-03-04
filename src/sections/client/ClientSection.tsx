import { defaultStyles, activeStyles, navigationTabs } from '@/utils/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useTabs, useTabNavigator } from '@/hooks/core/useTabs'
import { PlusCircle, TableProperties } from 'lucide-react'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableClientSection from './TableClientSection'
import FormClientSection from './FormClientSection'
const route = '/client'

interface ClientSectionProps extends ThemeContextProps { id: string | undefined }

const ClientSection = ({ theme, id }: ClientSectionProps) => {
  const { getStateTab, handleTab } = useTabNavigator({ defaultStyles, activeStyles })
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useTabs({ id, setTab, to: route })

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={cn('text-2xl font-bold tracking-tight', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          Clientes
        </h1>
      </div>

      <Tabs value={tab} onValueChange={handle}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Navigation action tabs */}
          <TabsList className={cn("mb-4 md:mb-0",
            "bg-muted/60 backdrop-blur transition-all",
            "supports-[backdrop-filter]:bg-background/60"
          )}>
            {navigationTabs.map(({ value, label, icon, paths, baseRoute }) => (
              <TabsTrigger
                key={value}
                className={getStateTab(paths)}
                onClick={() => { handleTab(baseRoute) }}
                value={paths.includes(route) ? 'table' : value}
              >
                {label}
                <span className="duration-200 group-hover:scale-110"> {icon} </span>
              </TabsTrigger>
            ))}
          </TabsList>

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
          <TableClientSection
            onChange={handle}
            theme={theme}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormClientSection
            onChange={handle}
            theme={theme}
            id={id}
          />
        </TabsContent>
        <TabsContent value="headquarters"> <Skeleton theme={theme} /> </TabsContent>
        <TabsContent value="offices"> <Skeleton theme={theme} /> </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClientSection