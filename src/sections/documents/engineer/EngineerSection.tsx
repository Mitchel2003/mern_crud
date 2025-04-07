import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useAuthContext } from "@/context/AuthContext"
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

import TableEngineerSection from '@/sections/flow/user/TableUserSection'
import FormEngineerSection from '@/sections/flow/user/FormUserSection'
const route = '/engineer'

interface EngineerSectionProps extends ThemeContextProps { id: string | undefined }

const EngineerSection = ({ id, theme }: EngineerSectionProps) => {
  const { tab, isQuery, handle } = useTabs({ id, to: route }) //handle tabs
  const params = id && isQuery ? JSON.parse(decodeURIComponent(id)) : null
  const { user } = useAuthContext()
  return (
    <main className="container p-2 sm:p-4">
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
          <TableEngineerSection theme={theme} onChange={() => handle('form')} credentials={user!} params={params} to="engineer" />
        </TabsContent>
        <TabsContent value="form">
          <Card className={cn('relative w-full', theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
            <FormEngineerSection id={id} theme={theme} onChange={() => handle('table')} to="engineer" />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default EngineerSection