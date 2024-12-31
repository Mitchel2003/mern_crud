import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { ThemeContextProps } from '@/interfaces/context.interface'
// import { useCurriculumForm } from '@/hooks/auth/useFormatForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// import TableCurriculumSection from './TableCurriculumSection'
import FormCurriculumSection from './FormCurriculumSection'
import { useForm } from 'react-hook-form'

interface CurriculumSectionProps extends ThemeContextProps { id: string | undefined }

const CurriculumSection = ({ theme, id }: CurriculumSectionProps) => {
  const [tab, setTab] = useState(id ? 'form' : 'table')
  const { handle } = useCurriculumSection({ id, setTab })
  // const { methods, onSubmit } = useCurriculumForm(id)

  const methods = useForm() //temporal
  const onSubmit = (data: any) => {
    console.log(data)
  }
  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={tab} onValueChange={handle}>
        {/* tabs header */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className={cn('text-3xl font-roboto-slab font-bold', theme === 'dark' ? 'text-white' : 'text-black')}> Curriculum </h1>
          <TabsList>
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="form">Formulario</TabsTrigger>
          </TabsList>
        </div>

        {/* tabs content */}
        <TabsContent value="table">
          {/* <TableCurriculumSection
            theme={theme}
            onChange={handle}
          /> */}
        </TabsContent>
        <TabsContent value="form">
          <FormCurriculumSection
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

export default CurriculumSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para manejar las secciones "tabs"
 * @param id - ID del estado a actualizar
 * @param setTab - Función para cambiar el tab actual
 * @returns handle - Función para cambiar el tab actual
 */
interface UseCurriculumSectionProps { id?: string; setTab: (value: string) => void }
export const useCurriculumSection = ({ id, setTab }: UseCurriculumSectionProps) => {
  const navigate = useNavigate()
  const handle = (value: string) => {
    if (value === 'form') navigate(`/form/curriculum${id ? `/${id}` : ''}`)
    else navigate('/form/curriculums')
    setTab(value)
  }
  return { handle }
}
/*---------------------------------------------------------------------------------------------------------*/