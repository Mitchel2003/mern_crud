import { Dialog as DialogPrimitive, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "#/ui/dialog"
import HeaderCustom from "#/common/elements/HeaderCustom"
import AlertDialog from "#/common/elements/AlertDialog"
import { Button } from "#/ui/button"

import { HeaderSpanProps, DialogField } from "@/interfaces/props.interface"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { CheckIcon } from "lucide-react"
import { cloneElement } from "react"
import { cn } from "@/lib/utils"

interface DialogProps extends ThemeContextProps, HeaderSpanProps {
  methods: UseFormReturn<any>
  fields: DialogField[]
  description?: string
  labelSubmit?: string
  title: string

  //handler dialog
  open: boolean
  onOpenChange: (open: boolean) => void

  //handler alert dialog
  openAlertDialog: boolean
  onConfirm: () => Promise<void>
  handleSubmit: (e?: React.FormEvent) => void
  onOpenAlertDialogChange: (open: boolean) => void
}

const Dialog = ({
  onOpenAlertDialogChange,
  openAlertDialog,
  handleSubmit,
  onConfirm,

  labelSubmit = 'Subir',
  onOpenChange,
  description,
  iconSpan,
  methods,
  fields,
  title,
  theme,
  span,
  open
}: DialogProps) => (
  <>
    <DialogPrimitive open={open} onOpenChange={onOpenChange} aria-hidden={!open}>
      <DialogContent aria-describedby={undefined} className={cn(theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>
            <HeaderCustom
              to="component"
              span={span}
              theme={theme}
              title={title}
              iconSpan={iconSpan}
              className="text-left"
            />
          </DialogTitle>
          {description && (
            <DialogDescription id="dialog-description">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, index) => (
              <div key={`${field.name}-${index}`}>
                {cloneElement(field.component, {
                  'aria-describedby': field.name ?? `field-description-${index}`,
                  name: field.name,
                  theme
                })}
                {field.name && <div id={`field-description-${index}`} className="sr-only">{field.name}</div>}
              </div>
            ))}

            {/* Submit button */}
            <Button type="submit" variant="success" className="w-full">
              {labelSubmit}
              <CheckIcon className="h-4 w-4" />
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </DialogPrimitive>

    <AlertDialog
      theme={theme}
      title={title}
      variant={"default"}
      onConfirm={onConfirm}
      open={openAlertDialog}
      cancelLabel="Cancelar"
      confirmLabel="Confirmar"
      onOpenChange={onOpenAlertDialogChange}
      description={"¿Esta seguro?, esta acción no se puede revertir"}
    />
  </>
)

export default Dialog