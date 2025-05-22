import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/tooltip'
import HeaderCustom from '#/common/elements/HeaderCustom'
import { FormItem, FormMessage } from '#/ui/form'
import { Button } from '#/ui/button'
import { Card } from '#/ui/card'

import { Building2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { useFormContext, Controller } from 'react-hook-form'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

type FieldValue = string | string[] | null | undefined
interface ImagePreviewProps extends HeaderSpanProps, ThemeContextProps {
  sizeImage?: string
  className?: string
  label?: string
  name: string
  alt?: string
}

const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(({
  sizeImage = 'w-full h-full',
  iconSpan = 'none',
  className,
  theme,
  label,
  name,
  span,
  alt,
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { control } = useFormContext()

  return (
    <FormItem className='w-full h-full'>
      {/* Header label */}
      <HeaderCustom
        to="component"
        span={span}
        theme={theme}
        title={label}
        iconSpan={iconSpan}
        className='ml-auto'
      />

      {/* Image preview with Controller */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          // Determine if we have multiple images or a single image
          const value = field.value as FieldValue
          const isMultipleImages = Array.isArray(value) && value.length > 0
          const hasSingleImage = typeof value === 'string' && value.trim() !== ''
          const hasImages = isMultipleImages || hasSingleImage

          // For multiple images
          const images = isMultipleImages ? value : []
          const currentImage = isMultipleImages ? images[currentIndex] : ''
          const goToNext = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
          const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
          return (
            <>
              <Card
                ref={ref}
                className={cn(
                  'flex items-center justify-center relative overflow-hidden',
                  theme === 'dark' ? 'border-zinc-600 bg-zinc-800/40' : 'border-gray-200',
                  className ?? 'mt-1', sizeImage
                )}
              >
                <>
                  {hasImages ? (
                    <div className='flex items-center justify-center'>
                      <img
                        alt={alt ?? "Preview image"}
                        className={cn("object-cover", sizeImage)}
                        src={isMultipleImages ? currentImage : value as string}
                      />

                      {/** Navigation controls for multiple images */}
                      {isMultipleImages && images.length > 1 && (
                        <>
                          {/** Delete button */}
                          <div className="absolute top-2 right-2 z-10">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                    aria-label="Delete image"
                                    className={cn("rounded-full p-1.5 md:p-2", "bg-red-500/80 hover:bg-red-600 transition-colors", "text-white shadow-sm")}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (!isMultipleImages) return field.onChange(undefined)
                                      const newImages = [...images]
                                      newImages.splice(currentIndex, 1)
                                      field.onChange(newImages.length > 0 ? newImages : undefined)// Update field value
                                      currentIndex >= newImages.length && setCurrentIndex(Math.max(0, newImages.length - 1))
                                    }}
                                  >
                                    <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Eliminar imagen</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          {/** Navigation controls */}
                          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                            <Button
                              size="icon"
                              type="button"
                              variant="ghost"
                              onClick={goToPrevious}
                              aria-label="Previous image"
                              className={cn("rounded-full mx-2 bg-black/40 hover:bg-black/60 pointer-events-auto", "transition-all duration-200")}
                            >
                              <ChevronLeft className="w-5 h-5 text-white" />
                            </Button>
                            <Button
                              size="icon"
                              type="button"
                              variant="ghost"
                              onClick={goToNext}
                              aria-label="Next image"
                              className={cn("rounded-full mx-2 bg-black/40 hover:bg-black/60 pointer-events-auto", "transition-all duration-200")}
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </Button>
                          </div>

                          {/** Slide dots */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {images.map((_, index) => (
                              <Button
                                key={index}
                                size="icon"
                                type="button"
                                variant="ghost"
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to image ${index + 1}`}
                                className={cn("w-2 h-2 p-0 min-w-0 rounded-full pointer-events-auto", index === currentIndex
                                  ? (theme === 'dark' ? 'bg-white' : 'bg-black')
                                  : (theme === 'dark' ? 'bg-zinc-500/50' : 'bg-gray-300/70'),
                                  "hover:bg-opacity-80"
                                )}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={cn('flex flex-col items-center justify-center w-full h-full gap-2 p-4', theme === 'dark'
                      ? 'bg-zinc-700/50 text-zinc-100'
                      : 'bg-gray-50 text-gray-400'
                    )}>
                      <Building2 className={cn('w-12 h-12', theme === 'dark' ? 'text-zinc-300' : 'text-gray-400')} />
                      <p className="text-xs text-center text-muted-foreground">Sin imagen</p>
                    </div>
                  )}
                </>
              </Card>

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

ImagePreview.displayName = 'ImagePreview'

export default ImagePreview