import { RoughNotation } from "react-rough-notation";
import { cn } from "@/lib/utils";

// Definición de tipos
export interface Step { title: string, label: string, id: number }

interface StepFormSidebarProps {
  goTo: (index: number) => void
  currentStepIndex: number
  className?: string
  steps: Step[]
}

interface StepFormSidebarItemProps {
  onClick: () => void
  isActive: boolean
  color: string
  step: Step
}

// Colores para los diferentes pasos
const STEP_COLORS: Record<number, string> = {
  0: "#f5d6ff",
  1: "#bd284d",
  2: "#E7B8FF",
  3: "#6fe79f",
  4: "#3b82f6",
  5: "#fdba74",
  6: "#c4b5fd",
}

// Componente principal del SideBar
const StepFormSidebar = ({ steps, currentStepIndex, goTo, className }: StepFormSidebarProps) => {
  return (
    <div className={cn(
      "absolute -top-20 left-0 w-full md:w-[25%] md:relative md:top-0 md:left-0",
      className
    )}>
      <nav className="py-5 text-slate-200 bg-neutral-900 h-full rounded-md border border-neutral-700 md:p-5 md:sticky md:top-20">
        <ul className="flex justify-center gap-2 md:flex-col">
          {steps.map((step) => (
            <StepFormSidebarItem
              step={step}
              key={step.id}
              onClick={() => goTo(step.id)}
              isActive={currentStepIndex === step.id}
              color={STEP_COLORS[step.id] || STEP_COLORS[0]}
            />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default StepFormSidebar
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Componente para cada paso individual
const StepFormSidebarItem = ({ step, isActive, onClick, color }: StepFormSidebarItemProps) => (
  <li className="flex flex-col items-start font-medium">
    <span className="hidden text-neutral-500 uppercase text-sm md:flex">
      {step.label}
    </span>
    <button
      tabIndex={0}
      onClick={onClick}
      className={cn(
        "text-sm md:text-base",
        isActive ? "text-[" + color + "]" : "text-white"
      )}
    >
      <RoughNotation
        type="underline"
        show={isActive}
        color={color}
      >
        {step.title}
      </RoughNotation>
    </button>
  </li>
)