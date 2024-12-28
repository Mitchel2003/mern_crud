import { useAuthContext } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  loginSchema, LoginFormProps,
  forgotPasswordSchema, ForgotPasswordFormProps
} from "@/schemas/auth.schema"

/*--------------------------------------------------useLoginForm--------------------------------------------------*/
const loginDefaultValues = {
  email: '',
  password: ''
}
const forgotPasswordDefaultValues = {
  email: '',
}

/** Hook personalizado para manejar el formulario de inicio de sesión */
export const useLoginForm = () => {
  const { signin } = useAuthContext()

  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = methods.handleSubmit(async (data: object) => await signin(data))
  return { methods, onSubmit }
}

/** Hook personalizado para manejar el formulario de recuperación de contraseña */
export const useForgotPasswordForm = () => {
  const { sendResetPassword } = useAuthContext()

  const methods = useForm<ForgotPasswordFormProps>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = methods.handleSubmit(async (data: ForgotPasswordFormProps) => {
    await sendResetPassword(data.email)
    methods.reset()
  })
  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/