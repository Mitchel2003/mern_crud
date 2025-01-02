import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useTabs } from '@/hooks/core/useTabs'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableCitySection from './TableCitySection'
import FormCitySection from './FormCitySection'
const route = '/location/city'

interface CitySectionProps extends ThemeContextProps { id: string | undefined }

const CitySection = ({ theme, id }: CitySectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useTabs({ id, setTab, to: route })

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={tab} onValueChange={handle}>
        {/* tabs header */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className={cn('text-3xl font-roboto-slab font-bold', theme === 'dark' ? 'text-white' : 'text-black')}> Ciudades </h1>
          <TabsList>
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="form">Formulario</TabsTrigger>
          </TabsList>
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          <TableCitySection
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormCitySection
            id={id}
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CitySection