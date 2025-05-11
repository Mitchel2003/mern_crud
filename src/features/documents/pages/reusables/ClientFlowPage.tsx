import HeadquarterFormFlow from "@/features/documents/sections/reusables/client/HeadquarterFormFlow"
import ClientFormFlow from "@/features/documents/sections/reusables/client/ClientFormFlow"
import OfficeFormFlow from "@/features/documents/sections/reusables/client/OfficeFormFlow"
import SuccessMessage from "#/ui/step-form/step-form-success-message"
import SideBar, { Step } from "#/ui/step-form/step-form-sidebar"
import { useThemeContext } from "@/context/ThemeContext"
import AlertDialog from "#/common/elements/AlertDialog"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { Button } from "#/ui/button"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useClientFlow } from "@/hooks/core/form/useAuthForm"
import { useStepForm } from "@/hooks/core/useStepForm"
import { AnimatePresence } from "framer-motion"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

const CLIENT_FORM_STEPS: Step[] = [
  { id: 0, label: "Paso 1", title: "Información del Cliente" },
  { id: 1, label: "Paso 2", title: "Sede Principal" },
  { id: 2, label: "Paso 3", title: "Consultorios" },
]

const validationFields = {
  0: ['client.email', 'client.password', 'client.username', 'client.position', 'client.phone', 'client.nit', 'client.role', 'client.photoUrl'],
  1: [{ subfield: 'headquarter' }],
  2: [{ subfield: 'office' }]
}

export const ClientFlowPage = () => {
  const { open, methods, options, onConfirm, setOpen, handleSubmit } = useClientFlow()
  const { goTo, next, previous, index, showMessage, isLastStep, isFirstStep } = useStepForm({ validationFields, steps: 3, methods })
  const { theme } = useThemeContext()
  return (
    <>
      <Suspense fallback={<Skeleton theme={theme} />}>
        <div className="container mx-auto p-6">
          <div className={cn('flex w-full p-4 justify-between rounded-lg border',
            theme === 'dark' ? 'bg-zinc-800' : 'bg-white'
          )}>
            {/** SideBar */}
            {!showMessage ? <SideBar goTo={goTo} theme={theme} currentStepIndex={index} steps={CLIENT_FORM_STEPS} /> : null}

            {/** Main */}
            <main className={cn('w-full', !showMessage && 'md:mt-5 md:w-[70%]')}>
              {showMessage ? (
                <AnimatePresence mode="wait">
                  <SuccessMessage />
                </AnimatePresence>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit} className="flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      {index === 0 && <ClientFormFlow key="step1" {...methods} theme={theme} />}
                      {index === 1 && <HeadquarterFormFlow key="step2" {...methods} theme={theme} options={options?.headquarter || []} />}
                      {index === 2 && <OfficeFormFlow key="step3" {...methods} theme={theme} />}
                    </AnimatePresence>

                    <WrapperNextStep
                      next={next}
                      theme={theme}
                      previous={previous}
                      isLastStep={isLastStep}
                      isFirstStep={isFirstStep}
                    />
                  </form>
                </FormProvider>
              )}
            </main>
          </div>
        </div>
      </Suspense>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? Se creará un nuevo cliente`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default ClientFlowPage
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface WrapperNextStepProps extends ThemeContextProps {
  isFirstStep: boolean
  isLastStep: boolean
  previous: () => void
  next: () => void
}
const WrapperNextStep = ({ theme, isFirstStep, isLastStep, previous, next }: WrapperNextStepProps) => {
  return (
    <div className="w-full items-center flex justify-between mt-6">
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={previous}
          className={cn(isFirstStep && 'invisible', 'transition-all duration-300 transform hover:scale-105',
            theme === 'dark'
              ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-900 shadow-md border border-zinc-700'
              : 'bg-white text-gray-900 hover:bg-zinc-100 shadow-md border border-gray-200 '
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Atras
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          type={isLastStep ? "submit" : "button"}
          onClick={(e) => { if (!isLastStep) { e.preventDefault(); next() } }}
          className={cn('transition-all duration-300 transform hover:scale-105',
            theme === 'dark'
              ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-900 shadow-md border border-zinc-700'
              : 'bg-white text-gray-900 hover:bg-zinc-100 shadow-md border border-gray-200 '
          )}
        >
          {isLastStep ? 'Confirmar' : 'Siguiente'}
          {isLastStep ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}