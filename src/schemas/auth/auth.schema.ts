import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Correo electronico invalido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
})

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.string().optional().default("engineer")
})

export type LoginFormProps = z.infer<typeof loginSchema>
export type RegisterFormProps = z.infer<typeof registerSchema>