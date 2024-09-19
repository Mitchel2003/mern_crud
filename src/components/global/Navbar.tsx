import { navAuth, navGuest, NavbarProps } from "@/interfaces/props.interface";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "#/ui/dropdown-menu";
import { Button } from "#/ui/button";
import ThemeToggle from "#/others/ThemeToggle";

/**
 * Componente principal de la barra de navegación.
 * Muestra un título dinámico y enlaces de navegación basados en el estado de autenticación del usuario.
 * @returns {JSX.Element} Elemento JSX que representa la barra de navegación.
 */
function Navbar(): JSX.Element {
  const { isAuth, logout } = useAuthContext();
  const { theme } = useThemeContext();
  const links = isAuth ? navAuth : navGuest;

  return (
    <nav className={`flex justify-between items-center py-3 px-6 transition-colors duration-300 backdrop-blur-md shadow-md
      ${theme === 'dark'
        ? 'bg-zinc-800/90 text-zinc-100'
        : 'bg-white/90 text-gray-900'
      }`}
    >
      <div className="flex items-center gap-x-4">
        <span className="flex items-center justify-center w-8 h-8">
          <img src="@/../public/gs_icon.ico" />
        </span>
        <h1 className="text-2xl">
          {isAuth ? "Dashboard" : "Gestión salud"}
        </h1>
      </div>

      {/* links "viewport pc" */}
      <div className="hidden md:flex items-center space-x-4">
        <NavbarLinks path={links} isAuth={isAuth} method={logout} />
        <ThemeToggle />
      </div>

      {/* dropmenu "viewport movile" */}
      <div className="md:hidden">
        <DropdownMenu>
          {/* button collapsible */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <NavbarLinksDropdown path={links} isAuth={isAuth} method={logout} />
            <DropdownMenuItem>
              <ThemeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Componente que renderiza los enlaces de navegación para pantallas medianas y grandes.
 * @param {boolean} props.isAuth - Indica si el usuario está autenticado.
 * @param {string[]} props.path - Array de rutas para los enlaces.
 * @param {Function} props.method - Función para cerrar sesión.
 * @returns {JSX.Element} Elemento JSX que contiene los enlaces de navegación.
 */
const NavbarLinks = ({ isAuth, path, method }: NavbarProps): JSX.Element => {
  return (
    <>
      {path.map((e, i) => (
        <Button key={i} variant="ghost" asChild>
          <Link to={e}>{navString(e)}</Link>
        </Button>
      ))}
      {isAuth && (
        <Button variant="outline" onClick={method}>
          Cerrar sesión
        </Button>
      )}
    </>
  )
}

/**
 * Componente que renderiza los enlaces de navegación para el menú desplegable "movile".
 * @param {boolean} props.isAuth - Indica si el usuario está autenticado.
 * @param {string[]} props.path - Array de rutas para los enlaces.
 * @param {Function} props.method - Función para cerrar sesión.
 * @returns {JSX.Element} Elemento JSX que contiene los elementos del menú desplegable.
 */
const NavbarLinksDropdown = ({ isAuth, path, method }: NavbarProps): JSX.Element => {
  return (
    <>
      {path.map((e, i) => (
        <DropdownMenuItem key={i} asChild>
          <Link to={e}>{navString(e)}</Link>
        </DropdownMenuItem>
      ))}
      {isAuth && (
        <DropdownMenuItem onClick={method}>
          Cerrar sesión
        </DropdownMenuItem>
      )}
    </>
  )
}

/**
 * Función auxiliar para formatear el texto de los enlaces de navegación, toma la última parte de la URL y capitaliza la primera letra.
 * @param {string} url - URL completa del enlace.
 * @returns {string} Texto formateado para el enlace.
 * @example const linkText = navString('/user/profile'); // Imprime: "Profile"
 */
const navString = (url: string): string => {
  const array = url.split('/');
  const index = array.length - 1;
  const text = array[index];
  return text.charAt(0).toUpperCase() + text.slice(1);
}