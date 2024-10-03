import Header from "./login/Header"
import Footer from "./login/Footer"
import Form from "./login/Form"

import { Card } from "#/ui/card"
import { LoginComponentsProps } from "@/interfaces/props.interface"

const Login = ({ theme }: LoginComponentsProps) => {
  return (
    <Card className={`relative w-full transition-all duration-300 backdrop-filter backdrop-blur-lg
      ${theme === 'dark'
        ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
        : 'bg-white hover:shadow-purple-500/60'
      }`}
    >
      <Header theme={theme} />
      <Form theme={theme} />
      <Footer theme={theme} />
    </Card >
  )
}

export default Login