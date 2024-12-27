import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import TableCountrySection from './TableCountrySection'
import FormCountrySection from './FormCountrySection'

const CountrySection = ({ theme }: ThemeContextProps) => {
  const [activeTab, setActiveTab] = useState('table')

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className={cn(
        'text-3xl font-bold',
        theme === 'dark' ? 'text-white' : 'text-black'
      )}> Países </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="form">Formulario</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <TableCountrySection />
        </TabsContent>
        <TabsContent value="form">
          <FormCountrySection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CountrySection