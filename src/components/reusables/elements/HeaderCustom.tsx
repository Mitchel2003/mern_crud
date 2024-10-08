import { ThemeContextProps } from "@/interfaces/context.interface";
import { HeaderSpanProps } from "@/interfaces/form.interface";

import { InfoIcon, SirenIcon, TriangleAlertIcon } from "lucide-react"
import { FormLabel } from "#/ui/form"

interface HeaderCustomProps extends ThemeContextProps, HeaderSpanProps {
  to: 'section' | 'component';
  title?: string;
  className?: string;
}
/**
 * This component is a customizable "Header" that use a title at left side and an optional description with respective icon.
 * It can be used as a section header or as a component header.
 * @param {HeaderCustomProps} props - The properties of the component.
 * @param {string} props.to - Correspond where the header will be placed, it can be 'section' or 'component'.
 * @param {string} props.title - Corresponds to the label of the field.
 * @param {string} props.description - Its posicionated at the right of the title and are acompanied by an icon.
 * @param {string} props.icon - The icon that acompanie the description of the header, it can be ('info' | 'warn' | 'alert').
 * @param {string} props.theme - Have the current theme, could be 'ligth' or 'dark'
 */
const HeaderCustom = ({
  theme,
  title,
  className,
  to = 'section',
  iconSpan = 'none',
  span,
}: HeaderCustomProps) => {
  return (
    <div className="flex items-center justify-between">

      {/* -------------------- Header of section or component -------------------- */}
      {to === 'section' ? (
        <h3 className={`text-2xl font-bold
          ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-700'}
          ${className}
          `}
        >
          {title}
        </h3>
      ) : (
        <FormLabel className={`
          ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-700'}
          ${className}
          `}
        >
          {title}
        </FormLabel>
      )}
      {/* ---------------------------------------------------------------- */}

      {/* -------------------- Description of section or component - remember that this is optional -------------------- */}
      {span && (
        <span className={`text-sm flex items-center gap-2
          ${theme === 'dark'
            ? 'text-zinc-300'
            : 'text-gray-500'
          }`}
        >
          {span}
          {iconSpan !== 'none' ? (<RenderIconSpan iconSpan={iconSpan} />) : (<></>)}
        </span>
      )}
      {/* ---------------------------------------------------------------- */}

    </div >
  )
}
export default HeaderCustom

interface RenderIconSpanProps extends HeaderSpanProps { }
const RenderIconSpan = ({ iconSpan }: RenderIconSpanProps) => {
  return (
    <>
      {iconSpan === 'info'
        ? <InfoIcon className="w-4 h-4 text-sky-300" />
        : (iconSpan === 'warn'
          ? <TriangleAlertIcon className="w-4 h-4 text-yellow-300" />
          : <SirenIcon className="w-4 h-4 text-red-300" />
        )
      }
    </>
  )
}
