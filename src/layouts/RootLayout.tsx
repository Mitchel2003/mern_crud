import { useThemeContext } from '@/context/ThemeContext';
import { Outlet } from 'react-router-dom';
import Navbar from '#/global/Navbar';

const RootLayout = () => {
  const { theme } = useThemeContext();

  return (
    <>
      {/* background animation */}
      <div className={`flex flex-col min-h-screen bg-gradient-to-br bg-[length:400%_200%] animate-gradient-shift
        ${theme === 'dark'
          ? 'from-zinc-800/60 via-purple-800/40 to-purple-950/70'
          : 'from-white via-purple-100 to-white'
        }`}
      >
        <Navbar />
        <main className="flex flex-grow items-center justify-center p-4">
          <Outlet />
        </main>
      </div>
    </>
  )
}


export default RootLayout