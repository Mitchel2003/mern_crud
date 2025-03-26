import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useAuthContext } from "@/context/AuthContext"
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import TableCurriculumSection from './TableCurriculumSection'
import FormCurriculumSection from './FormCurriculumSection'
const route = '/form/curriculum'

interface CurriculumSectionProps extends ThemeContextProps { id: string | undefined }

const CurriculumSection = ({ id, theme }: CurriculumSectionProps) => {
  const { tab, handle } = useTabs({ id, to: route })
  const { user } = useAuthContext()
  return (
    <main className="container p-6">
      <Tabs value={tab} onValueChange={handle}>
        {/* Local action tabs */}
        <TabsList className={cn(
          "bg-muted/60 backdrop-blur transition-all",
          "supports-[backdrop-filter]:bg-background/60",
          user?.role === 'client' && 'hidden'
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
          <TableCurriculumSection theme={theme} onChange={() => handle('form')} credentials={user} />
        </TabsContent>
        <TabsContent value="form">
          <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
            <FormCurriculumSection id={id} theme={theme} onChange={() => handle('table')} />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default CurriculumSection