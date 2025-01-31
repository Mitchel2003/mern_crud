import SuccessMessage from "@/components/ui/step-form/step-form-success-message";
import SideBar, { Step } from "@/components/ui/step-form/step-form-sidebar";
import { ThemeContextProps } from "@/interfaces/context.interface";
import { useClientFlow } from "@/hooks/auth/useAuthForm";
import AlertDialog from "#/common/elements/AlertDialog";
import { useStepForm } from "@/hooks/core/useStepForm";
import { AnimatePresence } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { Button } from "#/ui/button";

import HeadquarterFormFlow from "./HeadquarterFormFlow"
import ClientFormFlow from "./ClientFormFlow"
import OfficeFormFlow from "./OfficeFormFlow"

interface ClientFLowSectionProps extends ThemeContextProps { }

const ClientFlowSection = ({ theme }: ClientFLowSectionProps) => {
  const { goTo, next, previous, index, showMessage, isLastStep, isFirstStep } = useStepForm(3)
  const { open, methods, options, onConfirm, setOpen, handleSubmit } = useClientFlow()

  return (
    <>
      <div
        className={`flex justify-between ${index === 1 ? "h-[600px] md:h-[500px]" : "h-[500px]"}
        w-11/12 max-w-4xl relative m-1 rounded-lg border border-neutral-700 bg-[#262626] p-4`}
      >
        {!showMessage ? (<SideBar goTo={goTo} currentStepIndex={index} steps={CLIENT_FORM_STEPS} />) : null}
        <main className={`${showMessage ? "w-full" : "w-full md:mt-5 md:w-[65%]"}`}>
          {showMessage ? (
            <AnimatePresence mode="wait">
              <SuccessMessage />
            </AnimatePresence>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit} className="w-full flex flex-col justify-between h-full">
                <AnimatePresence mode="wait">
                  {index === 0 && <ClientFormFlow key="step1" {...methods} theme={theme} />}
                  {index === 1 && <HeadquarterFormFlow key="step2" {...methods} theme={theme} options={options?.headquarter || []} />}
                  {index === 2 && <OfficeFormFlow key="step3" {...methods} theme={theme} options={options?.office || []} />}
                </AnimatePresence>

              </form>
            </FormProvider>
          )}
          <WrapperNextStep
            next={next}
            theme={theme}
            previous={previous}
            isLastStep={isLastStep}
            isFirstStep={isFirstStep}
          />
        </main>
      </div>

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

export default ClientFlowSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface WrapperNextStepProps extends ThemeContextProps {
  isFirstStep: boolean
  isLastStep: boolean
  previous: () => void
  next: () => void
}
const WrapperNextStep = ({ isFirstStep, isLastStep, previous, next }: WrapperNextStepProps) => {
  return (
    <div className="w-full items-center flex justify-between">
      <div className="">
        <Button
          type="button"
          variant="ghost"
          onClick={previous}
          className={`${isFirstStep ? "invisible" : "visible p-0 text-neutral-200 hover:text-white"}`}
        >
          Atras
        </Button>
      </div>
      <div className="flex items-center">
        <div className="relative after:pointer-events-none after:absolute after:inset-px after:rounded-[11px] after:shadow-highlight after:shadow-white/10 focus-within:after:shadow-[#77f6aa] after:transition">
          {isLastStep ? (
            <Button
              type="submit"
              className="relative text-neutral-200 bg-neutral-900 border border-black/20 shadow-black/10 rounded-xl hover:text-white"
            >
              Confirmar
            </Button>
          ) : (
            <Button
              type="button"
              onClick={(e) => { e.preventDefault(); next() }}
              className="relative text-neutral-200 bg-neutral-900 border border-black/20 shadow-black/10 rounded-xl hover:text-white"
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const CLIENT_FORM_STEPS: Step[] = [
  { id: 0, label: "Paso 1", title: "Información del Cliente" },
  { id: 1, label: "Paso 2", title: "Sede Principal" },
  { id: 2, label: "Paso 3", title: "Consultorios" },
]