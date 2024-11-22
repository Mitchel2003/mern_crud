import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { NavItemProps } from "@/interfaces/props.interface"
import { Button } from "#/ui/button"

interface ItemActionProps {
  depth?: number
  item: NavItemProps
  isCollapsed: boolean
}

const ItemAction = ({ item, isCollapsed, depth = 0 }: ItemActionProps) => {
  const handleAction = async (e: React.MouseEvent) => { e.preventDefault(); if (item.action) await item.action() }

  const content = (
    <Button
      variant="ghost"
      className={`w-full justify-start ${depth > 0 ? 'pl-8' : ''}`}
      onClick={handleAction}
    >
      {item.icon}
      {!isCollapsed && <span className="ml-2">{item.label}</span>}
    </Button>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            {isCollapsed ? content : <div className="w-full">{content}</div>}
          </div>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export default ItemAction