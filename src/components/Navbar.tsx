import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { navAuth, navGuest } from "../interfaces/components.interface";

function Navbar() {
  const { isAuth, logout } = useAuth();
  const links = isAuth ? navAuth : navGuest

  return (
    <nav className="bg-zinc-700 flex justify-between my-3 py-5 px-10 rounded-lg">
      <Link to={isAuth ? '/tasks' : '/'}>
        <h1 className="text-2xl font-bold"> Tasks management </h1>
      </Link>
      <ul className="flex gap-x-3">
        {
          links.map((e, i) => (
            <li key={i} className="bg-indigo-500 px-4 py-1 rounded-sm">
              <Link to={e}> {navString(e)} </Link>
            </li>
          ))
        }
        {
          isAuth ? (
            <li className="bg-indigo-500 px-4 py-1 rounded-sm">
              <Link to='/' onClick={logout}> Logout </Link>
            </li>
          ) : (
            <> </>
          )
        }
      </ul>
    </nav>
  )
}

export default Navbar

/*--------------------------------------------------tools--------------------------------------------------*/
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