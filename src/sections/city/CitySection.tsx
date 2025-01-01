import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
// import { useCityForm } from '@/hooks/auth/useLocationForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableCitySection from './TableCitySection'
import FormCitySection from './FormCitySection'

interface CitySectionProps extends ThemeContextProps { id: string | undefined }

const CitySection = ({ theme, id }: CitySectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useCitySection({ id, setTab })
  // const { methods, onSubmit } = useCityForm(id)

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
          {/* <FormCitySection
            theme={theme}
            isUpdate={!!id}
            methods={methods}
            onChange={handle}
            onSubmit={onSubmit}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CitySection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para manejar las secciones "tabs"
 * @param id - ID del estado a actualizar
 * @param setTab - Función para cambiar el tab actual
 * @returns handle - Función para cambiar el tab actual
 */
interface UseCitySectionProps { id?: string; setTab: (value: string) => void }
export const useCitySection = ({ id, setTab }: UseCitySectionProps) => {
  const navigate = useNavigate()
  const handle = (value: string) => {
    if (value === 'form') navigate(`/location/city${id ? `/${id}` : ''}`)
    else navigate('/location/cities')
    setTab(value)
  }
  return { handle }
}
/*---------------------------------------------------------------------------------------------------------*/