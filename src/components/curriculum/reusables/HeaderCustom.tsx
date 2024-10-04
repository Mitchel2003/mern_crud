import { InfoIcon, SirenIcon, TriangleAlertIcon } from "lucide-react"
import { FormLabel } from "#/ui/form"
import { ThemeContextProps } from "@/interfaces/context.interface";

interface HeaderCustomProps extends ThemeContextProps {
  to: 'section' | 'component';
  title: string;
  description?: string;
  icon?: 'info' | 'warn' | 'alert';
}
/**
 * This component is a "Header" that use a title at left side and an optional description with respective icon.
 * It can be used as a section header or as a component header.
 * @param {HeaderCustomProps} props - The properties of the component.
 * @param {string} props.to - Correspond where the header will be placed, it can be 'section' or 'component'.
 * @param {string} props.title - Corresponds to the label of the field.
 * @param {string} props.description - Its posicionated at the right of the title and are acompanied by an icon.
 * @param {string} props.icon - The icon that acompanie the description of the header, it can be ('info' | 'warn' | 'alert').
 */
const HeaderCustom = ({ to = 'section', title, description, icon, theme }: HeaderCustomProps) => {
  return (
    <div className="flex items-center justify-between">

      {/* -------------------- Header of section or component -------------------- */}
      {to === 'section' ? (
        <h3 className={`text-2xl font-bold
          ${theme === 'dark'
            ? 'text-zinc-300'
            : 'text-gray-700'
          }`}
        >
          {title}
        </h3>
      ) : (
        <FormLabel className={`mt-2 mb-3
          ${theme === 'dark'
            ? 'text-zinc-300'
            : 'text-gray-700'
          }`}
        >
          {title}
        </FormLabel>
      )}
      {/* ---------------------------------------------------------------- */}

      {/* -------------------- Description of section or component - remember that this is optional -------------------- */}
      {description && (
        <span className={`text-sm flex items-center gap-2
          ${theme === 'dark'
            ? 'text-zinc-300'
            : 'text-gray-500'
          }`}
        >
          {description}

          {icon === 'info'
            ? <InfoIcon className="w-4 h-4 text-sky-300" />
            : (icon === 'warn'
              ? <TriangleAlertIcon className="w-4 h-4 text-yellow-300" />
              : <SirenIcon className="w-4 h-4 text-red-300" />
            )
          }
        </span>
      )}
      {/* ---------------------------------------------------------------- */}

    </div>
  )
}
export default HeaderCustom