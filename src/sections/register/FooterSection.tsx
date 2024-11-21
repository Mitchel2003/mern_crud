import { LoginComponentsProps } from "@/interfaces/props.interface";
import { CardFooter } from "#/ui/card";
import { cn } from "@/lib/utils";

const FooterSection = ({ theme }: LoginComponentsProps) => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <div className="text-sm text-center">
        <p
          className={cn(
            'font-medium transition-colors duration-300',
            theme === 'dark' ? 'text-purple-100' : 'text-purple-400'
          )}
        >
          Recuerda que debes iniciar sesión para acceder a la plataforma
        </p>
      </div>
    </CardFooter>
  )
}

export default FooterSection