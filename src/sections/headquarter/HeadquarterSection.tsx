import { defaultStyles, activeStyles, navigationTabs } from '@/utils/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useTabs, useTabNavigator } from '@/hooks/core/useTabs'
import { PlusCircle, TableProperties } from 'lucide-react'
import Skeleton from '#/common/skeletons/SkeletonLarge'
import { cn } from '@/lib/utils'

import TableHeadquarterSection from './TableHeadquarterSection'
import FormHeadquarterSection from './FormHeadquarterSection'
const route = '/location/headquarter'

interface HeadquarterSectionProps extends ThemeContextProps { id: string | undefined }

const HeadquarterSection = ({ theme, id }: HeadquarterSectionProps) => {
  const { getStateTab, handleTab } = useTabNavigator({ defaultStyles, activeStyles })
  const { tab, handle } = useTabs({ id, to: route })
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={cn('text-2xl font-bold tracking-tight', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          Sedes
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
          <TableHeadquarterSection
            onChange={handle}
            theme={theme}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormHeadquarterSection
            onChange={handle}
            theme={theme}
            id={id}
          />
        </TabsContent>
        <TabsContent value="clients"> <Skeleton theme={theme} /> </TabsContent>
        <TabsContent value="offices"> <Skeleton theme={theme} /> </TabsContent>
      </Tabs >
    </div >
  )
}

export default HeadquarterSection 