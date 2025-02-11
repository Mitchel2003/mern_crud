import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useTabs } from '@/hooks/core/useTabs'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableCurriculumSection from './TableCurriculumSection'
import FormCurriculumSection from './FormCurriculumSection'
import { Card } from '@/components/ui/card'
const route = '/form/curriculum'

interface CurriculumSectionProps extends ThemeContextProps { id: string | undefined }

const CurriculumSection = ({ theme, id }: CurriculumSectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useTabs({ id, setTab, to: route })

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={cn('text-2xl font-bold tracking-tight', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          Curriculum
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
          <TableCurriculumSection theme={theme} onChange={handle} />
        </TabsContent>
        <TabsContent value="form">
          <CardForm id={id} theme={theme} onChange={() => handle('table')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CurriculumSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface CardFormCurriculumSectionProps extends ThemeContextProps { id: string | undefined, onChange: () => void }
const CardForm = ({ id, theme, onChange }: CardFormCurriculumSectionProps) => (
  <div className="flex justify-center">
    <Card
      className={cn(
        'relative w-[calc(100%-1rem)] md:max-w-[calc(100%-5rem)]',
        'backdrop-filter backdrop-blur-lg',
        theme === 'dark'
          ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
          : 'bg-white hover:shadow-purple-500/60'
      )}
    >
      <FormCurriculumSection id={id} theme={theme} onChange={onChange} />
    </Card>
  </div>
)