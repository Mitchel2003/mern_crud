import { ThemeContextProps } from "@/interfaces/context.interface"
import { ReactElement, cloneElement } from "react"
import { Separator } from "#/ui/separator"

/*--------------------------------------------------tools--------------------------------------------------*/
export interface SectionProps { component: ReactElement }
export interface FormatSectionProps extends ThemeContextProps { format: SectionProps[] }
export const RenderFormat = ({ format, theme }: FormatSectionProps) => {
  return format.map((e) => (
    <>
      {cloneElement(e.component)}
      <Separator className={`my-8 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`} />
    </>
  ))
}
/*---------------------------------------------------------------------------------------------------------*/