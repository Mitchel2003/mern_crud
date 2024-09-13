import { navAuth, navGuest, NavbarProps } from "../../interfaces/props.interface";
import { useAuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { isAuth, logout } = useAuthContext();
  const links = isAuth ? navAuth : navGuest

  return (
    <nav className="bg-zinc-700 flex justify-between my-3 py-5 px-10 rounded-lg">
      <Link to={isAuth ? '/tasks' : '/'}>
        <h1 className="text-2xl font-bold"> Tasks management </h1>
      </Link>
      <NavbarLinks path={links} isAuth={isAuth} method={logout} />
    </nav>
  )
}

export default Navbar

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Provide links to navbar main through an authentication condition
 * @param isAuth - is a boolean that helps us to put links on navbar that correspond to user state (in session or not)
 * @param path - refer a array string that contain the routes to redirect at user "/tasks"
 * @param method - is the action onClick in the button logout
 * @returns {JSX.Element} a HTML element
 */
const NavbarLinks = ({ isAuth, path, method }: NavbarProps): JSX.Element => {
  return (<ul className="flex gap-x-3">
    {
      path.map((e, i) => (
        <li key={i} className="bg-indigo-500 px-4 py-1 rounded-sm">
          <Link to={e}> {navString(e)} </Link>
        </li>
      ))
    }
    {
      isAuth ? (
        <li className="bg-indigo-500 px-4 py-1 rounded-sm">
          <Link to='/' onClick={method}> Logout </Link>
        </li>
      ) : (
        <> </>
      )
    }
  </ul>)
}

/**
 * Allows us build the title of the link into navbar
 * @param url - is a string to desfragment
 * @returns {string} name of link
 */
const navString = (url: string): string => {
  const array = url.split('/');
  const index = array.length - 1;
  const text = array[index];
  const uppercase = text.charAt(0).toUpperCase();
  const complement = text.slice(1); //start from second letter
  const link = uppercase + complement
  return link;
}