import HeaderCustom from '#/common/elements/HeaderCustom'
import { FormItem, FormMessage } from '#/ui/form'
import { Button } from '#/ui/button'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'

import React, { useCallback, useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentFieldProps extends HeaderSpanProps, ThemeContextProps {
  label: string
  name: string
}

const DocumentField = React.forwardRef<HTMLInputElement, DocumentFieldProps>(({
  iconSpan = 'none',
  label,
  theme,
  span,
  name
}, ref) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const { control } = useFormContext()

  const processFile = useCallback((file: File | null) => {
    if (!file) { setPreview(null); setFileName(null); return }
    setFileName(file.name)

    // Si es una imagen, mostrar vista previa
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else { setPreview(null) }
  }, [])

  return (
    <FormItem>
      {/* Header label */}
      <HeaderCustom
        to="component"
        theme={theme}
        title={label}
        span={span}
        iconSpan={iconSpan}
        className='ml-auto'
      />

      {/* Document */}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
          useEffect(() => { processFile(value) }, [value, processFile]) // Sync preview
          return (
            <>
              <div className={cn(
                'flex px-auto justify-center rounded-lg border border-dashed',
                fileName ? 'py-[2vh]' : 'py-[6vh]',
                error && 'border-red-500',
                theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-600'
                  : 'bg-purple-50/20 border-gray-900/25',
              )}>
                {fileName ? (
                  <PreviewDocument
                    theme={theme}
                    preview={preview}
                    fileName={fileName}
                    onRemove={() => onChange(null)}
                  />
                ) : (
                  <UploadPrompt
                    {...field}
                    ref={ref}
                    name={name}
                    theme={theme}
                    onChange={(file) => onChange(file)}
                  />
                )}
              </div>

              {error && (
                <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                  {error.message}
                </FormMessage>
              )}
            </>
          )
        }}
      />
    </FormItem>
  )
})

DocumentField.displayName = 'DocumentField'

export default DocumentField

/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface PreviewDocumentProps extends ThemeContextProps {
  onRemove: () => void
  preview: string | null
  fileName: string
  size?: string
}

const PreviewDocument = ({ preview, fileName, size, theme, onRemove }: PreviewDocumentProps) => (
  <div className="relative flex flex-col items-center">
    {preview ? (
      // Si hay una vista previa (para imágenes)
      <img
        src={preview}
        alt="Vista previa"
        className={cn(size ?? 'w-40 h-40', 'object-cover rounded-md')}
      />
    ) : (
      // Para documentos sin vista previa (PDF, DOC, etc.)
      <div className={cn(
        'flex flex-col items-center justify-center',
        size ?? 'w-40 h-40',
        'rounded-md bg-gray-100',
        theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-100'
      )}>
        <FileText className={cn('w-16 h-16', theme === 'dark' ? 'text-zinc-300' : 'text-gray-500')} />
      </div>
    )}

    {/* Nombre del archivo */}
    <p className={cn(
      'mt-2 text-sm truncate max-w-[150px]',
      theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'
    )}>
      {fileName}
    </p>

    <Button
      size="icon"
      type="button"
      variant="destructive"
      className={cn(
        'absolute top-2 right-2',
        theme === 'dark' ? 'bg-red-800' : 'bg-red-500'
      )}
      onClick={onRemove}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
)

interface UploadPromptProps extends ThemeContextProps {
  onChange: (file: File | null) => void
  name: string
}

const UploadPrompt = React.forwardRef<HTMLInputElement, UploadPromptProps>(({
  name,
  theme,
  onChange
}, ref) => (
  <div className="text-center">
    <FileText className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />
    <div className="flex w-full mt-4 text-sm justify-center leading-6">
      <label
        htmlFor={`${name}-file`}
        className={cn(
          'relative font-semibold rounded-md cursor-pointer',
          theme === 'dark' ? 'bg-zinc-800' : 'bg-white'
        )}
      >
        <span className={cn(
          theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'
        )}>
          Subir documento
        </span>
        <input
          ref={ref}
          id={`${name}-file`}
          name={name}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            file && onChange(file)
          }}
        />
      </label>
    </div>
    <p className={cn(
      'text-xs leading-5',
      theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'
    )}>
      PDF, DOC, DOCX, XLS, XLSX hasta 5MB
    </p>
  </div>
))

UploadPrompt.displayName = 'UploadPrompt'