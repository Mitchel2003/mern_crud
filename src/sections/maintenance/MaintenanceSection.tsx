import { BarChart2, CalendarClock, Clock, AlertTriangle, Wrench } from 'lucide-react'
import { Maintenance, ThemeContextProps } from '@/interfaces/context.interface'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { PageHeader, Stat } from '#/common/elements/HeaderPage'
import { PlusCircle, TableProperties } from 'lucide-react'
import { useTabs } from '@/hooks/core/useTabs'
import { Card } from '@mui/material'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableMaintenanceSection from './TableMaintenanceSection'
import FormMaintenanceSection from './FormMaintenanceSection'
const route = '/form/maintenance'

interface MaintenanceSectionProps extends ThemeContextProps { id: string | undefined }

const MaintenanceSection = ({ theme, id }: MaintenanceSectionProps) => {
  const [data, setData] = useState<Maintenance[] | undefined>()
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useTabs({ id, setTab, to: route })

  // Calcular estadísticas
  const today = new Date().toISOString().split('T')[0];
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    value: data?.length || 0,
    href: '/mantenimiento/todos',
    title: 'Total Mantenimientos',
  }, {
    color: 'success',
    icon: CalendarClock,
    title: 'Creados Hoy',
    href: '/mantenimiento/hoy',
    value: data?.filter(m => new Date(m.createdAt).toISOString().split('T')[0] === today).length || 0,
  }, {
    icon: Clock,
    color: 'warning',
    title: 'En Espera',
    href: '/mantenimiento/espera',
    value: data?.filter(m => m.statusEquipment === 'pendiente').length || 0,
  }, {
    color: 'danger',
    icon: AlertTriangle,
    title: 'Fuera de Servicio',
    href: '/mantenimiento/fuera-servicio',
    value: data?.filter(m => m.statusEquipment === 'inactivo').length || 0,
  }]

  return (
    <main className="container p-6 space-y-4">
      {/* header page */}
      <PageHeader
        size="lg"
        icon={Wrench}
        stats={stats}
        variant="gradient"
        title="Mantenimiento"
        badge={{ text: "Sistema Activo", variant: "success", dot: true }}
      />

      {/* handle tabs */}
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
          <TableMaintenanceSection theme={theme} onChange={() => handle('form')} setOnFetch={setData} />
        </TabsContent>
        <TabsContent value="form">
          <Card className={cn('relative w-[calc(100%-1rem)] md:max-w-[calc(100%-5rem)]', 'backdrop-filter backdrop-blur-lg',
            theme === 'dark' ? 'bg-zinc-800/90 hover:shadow-purple-900/60' : 'bg-white hover:shadow-purple-500/60'
          )}>
            <FormMaintenanceSection id={id} theme={theme} onChange={() => handle('table')} />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default MaintenanceSection