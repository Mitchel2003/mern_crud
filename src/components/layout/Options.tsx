import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "#/ui/dropdown-menu"
import { ThemeContextProps, User } from "@/interfaces/context.interface"
import { Avatar, AvatarFallback, AvatarImage } from "#/ui/avatar"
import { useAuthContext } from "@/context/AuthContext"
import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "#/ui/button"

const OptionsMenu = ({ }: ThemeContextProps) => {
  const { user = {} as User, logout } = useAuthContext()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage className="object-cover" src={user.metadata?.logo || '/placeholder.svg'} alt={user.username} />
            <AvatarFallback className="bg-muted-foreground font-medium text-background">
              {user.username.charAt(0).toUpperCase() + user.username.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OptionsMenu