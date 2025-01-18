import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useTabs } from '@/hooks/core/useTabs'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableCurriculumSection from './TableCurriculumSection'
import FormCurriculumSection from './FormCurriculumSection'
const route = '/form/curriculum'

interface CurriculumSectionProps extends ThemeContextProps { id: string | undefined }

const CurriculumSection = ({ theme, id }: CurriculumSectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useTabs({ id, setTab, to: route })

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={tab} onValueChange={handle}>
        {/* tabs header */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className={cn('text-3xl font-roboto-slab font-bold', theme === 'dark' ? 'text-white' : 'text-black')}> Curriculum </h1>
          <TabsList>
            <TabsTrigger value="table">Listado</TabsTrigger>
            <TabsTrigger value="form">Nuevo</TabsTrigger>
          </TabsList>
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          <TableCurriculumSection
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormCurriculumSection
            id={id}
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CurriculumSection 