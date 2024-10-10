import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"

export interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  subItems?: NavItem[]
}

interface SidebarItemProps {
  item: NavItem
  isCollapsed: boolean
  depth?: number
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  depth = 0
}) => {
  const location = useLocation()

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${location.pathname === item.href ? 'bg-muted' : ''
                  } ${depth > 0 ? 'pl-8' : ''}`}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {item.subItems && !isCollapsed && (
        <div className="ml-4">
          {item.subItems.map(subItem => (
            <SidebarItem
              key={subItem.href}
              item={subItem}
              isCollapsed={isCollapsed}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}