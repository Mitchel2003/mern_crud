import { ThemeContextProps } from "@/interfaces/context.interface"
import { Calendar, BarChart3, Activity } from "lucide-react"
import { Button } from "#/ui/button"
import { useState } from "react"

const TabsClientSection = ({ }: ThemeContextProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Button
        variant="outline"
        className={`flex items-center justify-center py-6 ${activeTab === "overview" ? "bg-blue-50 border-blue-200 text-blue-700" : ""}`}
        onClick={() => setActiveTab("overview")}
      >
        <BarChart3 className="mr-2 h-5 w-5" />
        Vista General
      </Button>
      <Button
        variant="outline"
        className={`flex items-center justify-center py-6 ${activeTab === "maintenance" ? "bg-blue-50 border-blue-200 text-blue-700" : ""}`}
        onClick={() => setActiveTab("maintenance")}
      >
        <Activity className="mr-2 h-5 w-5" />
        Mantenimientos
      </Button>
      <Button
        variant="outline"
        className={`flex items-center justify-center py-6 ${activeTab === "calendar" ? "bg-blue-50 border-blue-200 text-blue-700" : ""}`}
        onClick={() => setActiveTab("calendar")}
      >
        <Calendar className="mr-2 h-5 w-5" />
        Calendario
      </Button>
    </div>
  )
}

export default TabsClientSection