import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { EquipmentSection } from './EquipmentSection'
import { OverviewSection } from './OverviewSection'
import { ReportSection } from './ReportSection'
import { UserSection } from './UserSection'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const AdminSection = ({ theme }: ThemeContextProps) => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1
        className={cn(
          'text-3xl font-bold',
          theme === 'dark' ? 'text-white' : 'text-black'
        )}>
        Panel de Administración
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="equipment">Equipos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection />
        </TabsContent>
        <TabsContent value="equipment">
          <EquipmentSection />
        </TabsContent>
        <TabsContent value="users">
          <UserSection />
        </TabsContent>
        <TabsContent value="reports">
          <ReportSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminSection