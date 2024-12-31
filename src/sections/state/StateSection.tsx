import DashboardSkeleton from '#/common/skeletons/DashboardSkeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useStateForm } from '@/hooks/auth/useLocationForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableStateSection from './TableStateSection'
import FormStateSection from './FormStateSection'

interface StateSectionProps extends ThemeContextProps { id: string | undefined }

const StateSection = ({ theme, id }: StateSectionProps) => {
  const { methods, onSubmit, options, isLoading } = useStateForm(id)
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useStateSection({ id, setTab })

  if (isLoading) return <DashboardSkeleton theme={theme} />

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={tab} onValueChange={handle}>
        {/* tabs header */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className={cn('text-3xl font-roboto-slab font-bold', theme === 'dark' ? 'text-white' : 'text-black')}> Departamentos </h1>
          <TabsList>
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="form">Formulario</TabsTrigger>
          </TabsList>
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          <TableStateSection
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormStateSection
            theme={theme}
            isUpdate={!!id}
            methods={methods}
            options={options}
            onChange={handle}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StateSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para manejar las secciones "tabs"
 * @param id - ID del estado a actualizar
 * @param setTab - Función para cambiar el tab actual
 * @returns handle - Función para cambiar el tab actual
 */
interface UseStateSectionProps { id?: string; setTab: (value: string) => void }
export const useStateSection = ({ id, setTab }: UseStateSectionProps) => {
  const navigate = useNavigate()
  const handle = (value: string) => {
    if (value === 'form') navigate(`/location/state${id ? `/${id}` : ''}`)
    else navigate('/location/states')
    setTab(value)
  }
  return { handle }
}
/*---------------------------------------------------------------------------------------------------------*/