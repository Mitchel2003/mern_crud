import { ThemeContextProps } from '@/interfaces/context.interface'
import { FormItem, FormMessage } from '#/ui/form'

import { useFormContext, Controller } from 'react-hook-form'
import { Building2 } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'

interface ImagePreviewProps extends ThemeContextProps {
  sizeImage?: string
  className?: string
  label?: string
  name: string
  alt?: string
}

const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(({
  sizeImage = 'w-full h-full',
  className,
  theme,
  label,
  name,
  alt
}, ref) => {
  const { control } = useFormContext()

  return (
    <FormItem className='w-full h-full'>
      {/* Label */}
      {label && (
        <div className="flex w-full">
          <p className={cn('text-xs', theme === 'dark' ? 'text-zinc-300' : 'text-gray-500')}>
            {label}
          </p>
        </div>
      )}

      {/* Image preview with Controller */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <div
              ref={ref}
              className={cn(
                'flex items-center justify-center',
                'overflow-hidden border rounded-md shadow-sm',
                theme === 'dark' ? 'border-zinc-600' : 'border-gray-200',
                className ?? 'mt-1',
                sizeImage
              )}
            >
              {field.value ? (
                <img
                  src={field.value}
                  alt={alt ?? "Preview image"}
                  className={cn("object-cover", sizeImage)}
                />
              ) : (
                <div
                  className={cn('flex items-center justify-center w-full h-full',
                    theme === 'dark'
                      ? 'bg-zinc-700 text-zinc-100'
                      : 'bg-gray-50 text-gray-400'
                  )}
                >
                  <Building2 className={cn('w-16 h-16', theme === 'dark' ? 'text-zinc-300' : 'text-gray-400')} />
                </div>
              )}
            </div>

            {error && (
              <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                {error.message}
              </FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  )
})

ImagePreview.displayName = 'ImagePreview'

export default ImagePreview