import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useCountryForm } from '@/hooks/auth/useLocationForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableCountrySection from './TableCountrySection'
import FormCountrySection from './FormCountrySection'

interface CountrySectionProps extends ThemeContextProps { id: string | undefined }

const CountrySection = ({ theme, id }: CountrySectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useCountrySection({ id, setTab })
  const { methods, onSubmit } = useCountryForm(id)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={tab} onValueChange={handle}>
        {/* tabs header */}
        <div className="flex items-center justify-between">
          <h1 className={cn('text-3xl font-roboto-slab font-bold', theme === 'dark' ? 'text-white' : 'text-black')}> Países </h1>
          <TabsList>
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="form">Formulario</TabsTrigger>
          </TabsList>
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          <TableCountrySection
            theme={theme}
            onChange={handle}
          />
        </TabsContent>
        <TabsContent value="form">
          <FormCountrySection
            theme={theme}
            methods={methods}
            onChange={handle}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CountrySection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para manejar las secciones "tabs"
 * @param id - ID del país a actualizar
 * @param setTab - Función para cambiar el tab actual
 * @returns handle - Función para cambiar el tab actual
 */
interface UseCountrySectionProps { id?: string; setTab: (value: string) => void }
export const useCountrySection = ({ id, setTab }: UseCountrySectionProps) => {
  const navigate = useNavigate()
  const handle = (value: string) => {
    if (value === 'form') navigate(`/location/country${id ? `/${id}` : ''}`)
    else navigate('/location/countries')
    setTab(value)
  }
  return { handle }
}
/*---------------------------------------------------------------------------------------------------------*/