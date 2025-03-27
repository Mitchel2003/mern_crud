import { ThemeContextProps } from "@/interfaces/context.interface"
import { Calendar, Home, Settings } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TabsClientSectionProps {
  theme: ThemeContextProps['theme']
}

const TabsClientSection = ({ theme }: TabsClientSectionProps) => {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className={cn('p-1 rounded-lg flex items-center justify-between shadow-sm border', theme === 'dark'
      ? 'bg-zinc-950 border-zinc-700'
      : 'bg-white border-gray-100'
    )}>
      <div className="flex items-center">
        <TabButton
          icon={<Home className="h-4 w-4" />}
          label="Resumen"
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          theme={theme}
        />
        <TabButton
          icon={<Settings className="h-4 w-4" />}
          label="Mantenimiento"
          active={activeTab === "maintenance"}
          onClick={() => setActiveTab("maintenance")}
          theme={theme}
        />
        <TabButton
          icon={<Calendar className="h-4 w-4" />}
          label="Calendario"
          active={activeTab === "calendar"}
          onClick={() => setActiveTab("calendar")}
          theme={theme}
        />
      </div>
    </div>
  )
}

interface TabButtonProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  theme: 'dark' | 'light'
}

function TabButton({ icon, label, active, onClick, theme }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? theme === 'dark'
            ? "bg-zinc-800 text-white"
            : "bg-zinc-100 text-zinc-900"
          : theme === 'dark'
            ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

export default TabsClientSection