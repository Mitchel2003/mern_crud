import { ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { FormItem, FormMessage } from '#/ui/form'

import { extractMetadataUrl } from '@/constants/format.constants'
import { useFormContext, Controller } from 'react-hook-form'
import HeaderCustom from '#/common/elements/HeaderCustom'
import { FileText, ExternalLink, X } from 'lucide-react'
import { Button } from '#/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

interface DocumentPreviewProps extends HeaderSpanProps, ThemeContextProps {
  className?: string
  label?: string
  name: string
  limit?: number
}

/**
 * Componente para mostrar la previsualización de documentos anexos existentes
 * Recibe un array de URLs y muestra cada documento con su nombre extraído
 */
const DocumentPreview = React.forwardRef<HTMLDivElement, DocumentPreviewProps>(({
  iconSpan = 'none',
  className,
  theme,
  label,
  name,
  span,
  limit
}, ref) => {
  const { control } = useFormContext()
  const openDocument = (url: string) => { window.open(url, '_blank') }

  return (
    <FormItem className='w-full'>
      {/* Header label */}
      <HeaderCustom
        to="component"
        span={span}
        theme={theme}
        title={label}
        iconSpan={iconSpan}
        className='ml-auto'
      />

      {/* Document preview with Controller */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          // Limitamos la cantidad de documentos a mostrar si se especifica
          const documents = Array.isArray(field.value) ? limit ? field.value.slice(0, limit) : field.value : [field.value]
          return (
            <>
              {/** If no documents, show placeholder */}
              {!field.value || (Array.isArray(field.value) && field.value.length === 0) ? (
                <div className={cn('flex flex-col items-center justify-center p-6 rounded-lg border', theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  : 'bg-gray-50 border-gray-200 text-gray-400',
                  className ?? 'mt-2'
                )}>
                  <FileText className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">No hay documentos anexos</p>
                </div>
              ) : (
                <>
                  <div ref={ref} className={cn('grid gap-4', documents.length > 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1', className ?? 'mt-2')}>
                    {documents.map((url: string, index: number) => (
                      <div
                        key={`${name}-${index}`}
                        className={cn('flex flex-col items-center p-4 rounded-lg border',
                          theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200',
                          'transition-all hover:shadow-md'
                        )}>
                        <div className="flex items-center justify-center w-16 h-16 mb-3">
                          <FileText className={cn('w-12 h-12', theme === 'dark' ? 'text-zinc-300' : 'text-gray-500')} />
                        </div>

                        <p className={cn(
                          'text-sm font-medium mb-3 text-center truncate w-full',
                          theme === 'dark' ? 'text-zinc-200' : 'text-gray-700'
                        )}>
                          {extractMetadataUrl([url])?.[0] || 'Documento sin nombre'}
                        </p>

                        <div className="flex gap-2 w-full">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openDocument(url)}
                            className={cn('flex items-center gap-2 flex-1', theme === 'dark'
                              ? 'text-blue-300 hover:text-blue-200'
                              : 'text-blue-600 hover:text-blue-700'
                            )}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Abrir</span>
                          </Button>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              // Obtener el valor actual (array de URLs)
                              const currentValue = Array.isArray(field.value) ? [...field.value] : [];
                              // Filtrar el array para eliminar la URL actual
                              const newValue = currentValue.filter(item => item !== url);
                              // Actualizar el valor en el formulario
                              field.onChange(newValue);
                            }}
                            className={cn('flex items-center justify-center', theme === 'dark'
                              ? 'bg-red-800 hover:bg-red-700'
                              : 'bg-red-600 hover:bg-red-500'
                            )}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div >

                  {error && (
                    <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                      {error.message}
                    </FormMessage>
                  )}
                </>
              )}
            </>
          )
        }}
      />
    </FormItem >
  )
})

DocumentPreview.displayName = 'DocumentPreview'

export default DocumentPreview