import { Eye, EyeOff, Lock, LogIn, ChevronRight, UserPlus } from "lucide-react";
import { LoginComponentsProps } from "@/interfaces/props.interface";
import { useAuthContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Checkbox } from "#/ui/checkbox";
import { CardContent } from "#/ui/card";
import { Button } from "#/ui/button";
import { Input } from "#/ui/input";
import { Label } from "#/ui/label";

const Form = ({ theme }: LoginComponentsProps) => {
  const { register, handleSubmit, formState: { errors: errsForm } } = useForm();
  const { signin, errors: authErrors = [] } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = handleSubmit(async (data) => signin(data));

  return (
    <CardContent className="space-y-6">
      <form onSubmit={onSubmit}>
        {authErrors.map((e, i) => <div key={i} className="bg-red-500 text-white text-center my-2 p-2 rounded"> {e} </div>)}

        {/* Email section */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className={theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}
          >
            Correo electrónico
          </Label>

          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="@example.com"
              className={`pl-10
                ${theme === 'dark'
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                  : 'bg-white'
                }`}
              {...register('email', { required: true })}
            />

            <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {errsForm.email && (<p className="text-red-500 text-sm mt-1"> El correo electrónico es obligatorio </p>)}
        </div>

        {/* Password section */}
        <div className="space-y-2 mt-4">
          <Label
            htmlFor="password"
            className={theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}
          >
            Contraseña
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`pl-10
                ${theme === 'dark'
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                  : 'bg-white'
                }`}
              {...register('password', { required: true })}
            />

            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? (<EyeOff className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'}`} aria-hidden="true" />)
                : (<Eye className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'}`} aria-hidden="true" />)
              }
            </button>
          </div>

          {errsForm.password && (<p className="text-red-500 text-sm mt-1"> La contraseña es obligatoria </p>)}
        </div>

        {/* Remember me section */}
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox id="remember" />

          <Label
            htmlFor="remember"
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
              ${theme === 'dark'
                ? 'text-zinc-300'
                : 'text-gray-700'
              }`}
          >
            Recordarme
          </Label>
        </div>

        {/* Submit section */}
        <Button
          type="submit"
          className={`w-full mt-6 transition-all duration-300 transform hover:scale-105 text-white
            ${theme === 'dark'
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-purple-800 hover:bg-purple-900'
            }`}
        >
          Iniciar sesión <ChevronRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          type="button"
          className={`w-full mt-3 transition-all duration-300 transform hover:scale-105 text-white
            ${theme === 'dark'
              ? 'bg-purple-800 hover:bg-purple-900'
              : 'bg-purple-400 hover:bg-purple-500'
            }`}
        >
          Registrarse <UserPlus className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </CardContent>
  )
}

export default Form