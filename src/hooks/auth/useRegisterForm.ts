import { registerSchema, RegisterFormProps } from "@/schemas/auth.schema"
import { useAuthContext } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const defaultValues = {
  role: '',
  email: '',
  username: '',
  password: ''
}

export const useRegisterForm = () => {
  const { signup } = useAuthContext()

  const methods = useForm<RegisterFormProps>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues
  })

  const onSubmit = methods.handleSubmit(async (data: object) => await signup(data))
  return { methods, onSubmit }
}