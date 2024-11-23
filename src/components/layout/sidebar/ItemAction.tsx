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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Show item collapsable */}
          <div className="w-full">
            <Content item={item} isCollapsed={isCollapsed} depth={depth} handler={handleAction} />
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface ContentProps extends ItemActionProps { handler: (e: React.MouseEvent) => Promise<void> }
const Content = ({ handler, item, isCollapsed, depth = 0 }: ContentProps) => (
  <Button
    variant="ghost"
    onClick={handler}
    className={`w-full justify-start ${depth > 0 ? 'pl-8' : ''}`}
  >
    {item.icon}
    {!isCollapsed && <span className="ml-2">{item.label}</span>}
  </Button>
)