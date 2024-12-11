import { Home, User, Settings, LogOut } from 'lucide-react'
import { SidebarLink } from "@/types/sidebar.type"
import { Sidebar } from "./Sidebar"

const links: SidebarLink[] = [
  { label: "Dashboard", href: "#", icon: Home },
  { label: "Profile", href: "#", icon: User },
  { label: "Settings", href: "#", icon: Settings },
  { label: "Logout", href: "#", icon: LogOut },
]

export const SidebarDemo: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-800">
      <Sidebar
        links={links}
        logo={<span className="text-xl font-bold">Acet Labs</span>}
        logoIcon={<div className="w-8 h-8 bg-blue-500 rounded-full" />}
        userAvatar="https://github.com/shadcn.png"
        userName="John Doe"
      />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {/* Aquí iría el contenido principal de tu aplicación */}
      </main>
    </div>
  )
}