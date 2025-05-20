import { AlertDialogDescription, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialog as Dialog } from '#/ui/alert-dialog'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { useState, useRef, useEffect } from 'react'
import { useIsMobile } from '@/hooks/ui/use-mobile'
import { cn } from '@/lib/utils'
// @ts-ignore
import { Pen, Save, Trash2, ArrowRightCircle } from 'lucide-react'
import SignatureCanvas from "react-signature-canvas"
import { Button } from '#/ui/button'

interface SignatureDialogProps extends ThemeContextProps, HeaderSpanProps {
  // Control props
  onConfirm: (signatureData: string | null) => void
  onOpenChange: (isOpen: boolean) => void
  open: boolean

  // Content props
  confirmLabel?: string
  cancelLabel?: string
  description?: string
  className?: string
  title?: string
}

const SignatureDialog = ({
  // Control props
  onOpenChange,
  onConfirm,
  open,

  // Content props
  description = 'Utilice el panel a continuación para crear su firma digital',
  confirmLabel = 'Guardar Firma',
  cancelLabel = 'Cancelar',
  title = 'Firma Digital',
  className,
  theme,
}: SignatureDialogProps) => {
  const [canvasWidth, setCanvasWidth] = useState<number>(0)
  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [preview, setPreview] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sigCanvas = useRef<any>(null)
  const isMobile = useIsMobile()

  /** Actualiza las dimensiones del canvas cuando cambia el tamaño de la ventana o se abre el diálogo */
  useEffect(() => {
    if (!open) return
    updateCanvasDimensions()
    const timeout = setTimeout(updateCanvasDimensions, 300)
    window.addEventListener('resize', updateCanvasDimensions)
    return () => { clearTimeout(timeout); window.removeEventListener('resize', updateCanvasDimensions) }
  }, [open])

  /** Guarda la firma en el estado */
  const save = () => {
    if (!sigCanvas.current) return
    if (sigCanvas.current.isEmpty()) return alert("Por favor realiza tu firma antes de continuar.")
    try { //Intentamos usar getTrimmedCanvas primero (elimina espacios en blanco)
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
      setPreview(dataURL)
    } catch (e) {
      console.error("Error al obtener trimmedCanvas:", e)
      try { //Fallback: usar el canvas completo
        const dataURL = sigCanvas.current.toDataURL("image/png")
        setPreview(dataURL)
      } catch (fallback) {
        console.error("Error en fallback:", fallback)
        alert("Hubo un error al guardar la firma. Por favor intenta nuevamente.")
      }
    }
  }

  /** Confirma y cierra el diálogo */
  const handleConfirm = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      save() //Await for the preview to update, helps us get the correct signature data
      setTimeout(() => { const signatureData = preview || (sigCanvas.current ? sigCanvas.current.toDataURL('image/png') : null); onConfirm(signatureData) }, 100)
    } else { onConfirm(preview) }
  }
  /** Actualiza las dimensiones del canvas */
  const updateCanvasDimensions = () => { if (containerRef.current) setCanvasWidth(containerRef.current.clientWidth || 300) }
  /** Limpia la firma */
  const clear = () => { if (sigCanvas.current) sigCanvas.current.clear(); setPreview(null) }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn('sm:max-w-[600px] max-h-[90vh] overflow-y-auto',
        theme === 'dark' ? 'bg-zinc-900 text-zinc-50' : 'bg-white',
        className
      )}>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(theme === 'dark' ? 'text-zinc-50' : 'text-gray-900')}>
            {!isMobile ? title : ''}
          </AlertDialogTitle>

          <AlertDialogDescription className={cn(theme === 'dark' ? 'text-zinc-400' : 'text-gray-500')}>
            {!isMobile ? description : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Contenido del canvas de firma */}
        <div className="space-y-4" ref={containerRef}>
          <div className={cn("w-full border rounded-lg overflow-hidden relative", theme === 'dark'
            ? "border-zinc-600 bg-zinc-800"
            : "border-gray-300 bg-white"
          )}>
            <SignatureCanvas
              ref={sigCanvas}
              minWidth={2}
              maxWidth={4}
              canvasProps={{
                height: 300,
                onMouseDown: () => setIsSigning(true),
                onMouseUp: () => setIsSigning(false),
                onTouchStart: () => setIsSigning(true),
                onTouchEnd: () => setIsSigning(false),
                className: "signature-canvas max-w-full",
                width: canvasWidth || containerRef.current?.clientWidth || 300, // Usar ancho del contenedor o un valor por defecto
              }}
            />

            {/* Mensaje de placeholder */}
            {!isSigning && !preview && (
              <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", theme === 'dark' ? "text-zinc-400" : "text-gray-400")}>
                <Pen className="h-5 w-5 mr-2" />
                <span>Firma aquí</span>
              </div>
            )}

            {/* Vista previa de la firma */}
            {preview && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <img src={preview} alt="Firma guardada" className="max-h-[300px]" />
              </div>
            )}
          </div>

          {/* Botones de acción para el canvas */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              onClick={clear}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpiar
            </Button>

            <Button
              type="button"
              onClick={save}
              variant="success"
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-1" />
              {isMobile ? 'Guardar' : 'Guardar firma'}
            </Button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className={cn(theme === 'dark' ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-50' : 'bg-white hover:bg-gray-100')}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleConfirm} className={cn(!preview && 'hidden', 'bg-blue-600 hover:bg-blue-700', theme === 'dark' && 'text-white')}>
            {confirmLabel} <ArrowRightCircle className="h-4 w-4 mr-1" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Dialog>
  )
}

export default SignatureDialog