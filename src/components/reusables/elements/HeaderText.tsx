import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeContextProps } from "@/interfaces/context.interface"

interface HeaderTextProps extends ThemeContextProps {
  title: string,
  description: string
}

const HeaderText = ({ title, description, theme }: HeaderTextProps) => {
  return (
    <CardHeader className="space-y-1">
      <CardTitle
        className={`text-2xl font-bold text-center
          ${theme === 'dark'
            ? 'text-zinc-100'
            : 'text-gray-900'
          }`}
      >
        {title}
      </CardTitle>

      <CardDescription
        className={`text-center
          ${theme === 'dark'
            ? 'text-zinc-400'
            : 'text-gray-500'
          }`}
      >
        {description}
      </CardDescription>
    </CardHeader>
  )
}

export default HeaderText