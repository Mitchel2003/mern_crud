import { ThemeContextProps } from "@/interfaces/context.interface"
import { HeaderSpanProps } from "@/interfaces/form.interface"
import HeaderCustom from "./HeaderCustom"

interface FormHeaderProps extends ThemeContextProps, HeaderSpanProps {
  to: 'section' | 'component';
  label?: string;
}

const FormHeader = ({
  to,
  theme,
  label,
  span,
  iconSpan
}: FormHeaderProps) => {

  if (!label) return

  return span ? (
    <HeaderCustom
      to={to}
      span={span}
      theme={theme}
      title={label}
      iconSpan={iconSpan}
    />
  ) : (
    <HeaderCustom
      to={to}
      theme={theme}
      title={label}
    />
  )
}

export default FormHeader;