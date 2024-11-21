import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

interface NotificationProps {
  title?: string
  message: string
  type?: "success" | "error" | "warning" | "info"
}

export const useNotification = () => {
  const { toast } = useToast()

  const notify = useCallback(({ title, message, type = "info" }: NotificationProps) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "default",
      info: "default"
    } as const

    toast({
      title: title,
      description: message,
      variant: variants[type],
      duration: 3000,
    })
  }, [toast])

  return {
    notifySuccess: (props: Omit<NotificationProps, "type">) => 
      notify({ ...props, type: "success" }),
    notifyError: (props: Omit<NotificationProps, "type">) => 
      notify({ ...props, type: "error" }),
    notifyWarning: (props: Omit<NotificationProps, "type">) => 
      notify({ ...props, type: "warning" }),
    notifyInfo: (props: Omit<NotificationProps, "type">) => 
      notify({ ...props, type: "info" })
  }
} 