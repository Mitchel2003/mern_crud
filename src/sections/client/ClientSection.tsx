import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useClientForm } from '@/hooks/auth/useUserForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableClientSection from './TableClientSection'
import FormClientSection from './FormClientSection'

interface ClientSectionProps extends ThemeContextProps { id: string | undefined }

const ClientSection = ({ theme, id }: ClientSectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useClientSection({ id, setTab })
  const { methods, onSubmit } = useClientForm(id)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={tab} onValueChange={handle}>
        {/* tabs header */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className={cn('text-3xl font-roboto-slab font-bold', theme === 'dark' ? 'text-white' : 'text-black')}> Clientes </h1>
          <TabsList>
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="form">Formulario</TabsTrigger>
          </TabsList>
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          <TableClientSection
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormClientSection
            theme={theme}
            isUpdate={!!id}
            methods={methods}
            onChange={handle}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClientSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para manejar las secciones "tabs"
 * @param id - ID del estado a actualizar
 * @param setTab - Función para cambiar el tab actual
 * @returns handle - Función para cambiar el tab actual
 */
interface UseClientSectionProps { id?: string; setTab: (value: string) => void }
export const useClientSection = ({ id, setTab }: UseClientSectionProps) => {
  const navigate = useNavigate()
  const handle = (value: string) => {
    if (value === 'form') navigate(`/client${id ? `/${id}` : ''}`)
    else navigate('/clients')
    setTab(value)
  }
  return { handle }
}
/*---------------------------------------------------------------------------------------------------------*/