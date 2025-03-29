import { Bell, X, Info, AlertTriangle, CreditCard, TrendingUp, Gift } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "#/ui/card"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { ScrollArea } from "#/ui/scroll-area"
import { Button } from "#/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Notifications({ theme }: ThemeContextProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className={cn('relative rounded-full transition-colors duration-300', theme === 'dark'
          ? 'bg-zinc-700/40 text-yellow-700 hover:bg-zinc-600'
          : 'bg-gray-100 text-yellow-600 hover:bg-gray-200'
        )}
      >
        <Bell className="h-5 w-5 md:h-6 md:w-6" />
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
      </Button>
      {isOpen && (
        <Card className={cn('absolute mt-2 w-96 z-50', isMobile ? 'right-[-50px]' : 'right-0')}>
          <CardHeader className={cn("flex flex-row pb-2",
            "space-y-0 items-center justify-between",
            isMobile ? 'p-2' : 'p-4'
          )}>
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Cerrar notificaciones">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className={cn(isMobile ? 'p-2' : 'p-4')}>
            <ScrollArea className="h-[400px]">
              {notifications.map((notification) => (
                <Card key={notification.id} className="mb-4 last:mb-0 border shadow-sm">
                  <CardContent className="p-2">
                    <div className="flex items-start space-x-4">
                      <div className={`${notification.color} p-2 rounded-full bg-opacity-10`}>
                        <notification.icon className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const notifications = [
  {
    id: 1,
    title: "New Feature",
    message: "Check out our new budget tracking tool!",
    date: "2023-07-15",
    icon: Info,
    color: "text-blue-500",
  },
  {
    id: 2,
    title: "Account Alert",
    message: "Unusual activity detected on your account.",
    date: "2023-07-14",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: 3,
    title: "Payment Due",
    message: "Your credit card payment is due in 3 days.",
    date: "2023-07-13",
    icon: CreditCard,
    color: "text-red-500",
  },
  {
    id: 4,
    title: "Investment Update",
    message: "Your investment portfolio has grown by 5% this month.",
    date: "2023-07-12",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    id: 5,
    title: "New Offer",
    message: "You're eligible for a new savings account with higher interest!",
    date: "2023-07-11",
    icon: Gift,
    color: "text-purple-500",
  }
]