import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type DataTableConfig, dataTableConfig } from "@/config/data-table";
import { Props } from "@/interfaces/props.interface";

import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import * as React from "react";

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"];

interface TasksTableContextProps {
  setFeatureFlags: (value: FeatureFlagValue[]) => void;
  featureFlags: FeatureFlagValue[];
}

const TasksTableContext = React.createContext<TasksTableContextProps>({ setFeatureFlags: () => { }, featureFlags: [] });

export function useTasksTable() {
  const context = React.useContext(TasksTableContext)
  if (!context) throw new Error("useTasksTable must be used within a TasksTableProvider")
  return context
}

export function TasksTableProvider({ children }: Props) {
  const [featureFlags, setFeatureFlags] = useQueryState<FeatureFlagValue[]>("featureFlags",
    {
      defaultValue: [],
      clearOnDefault: true,
      serialize: (value) => value.join(","),
      parse: (value) => value.split(",") as FeatureFlagValue[],
      eq: (a, b) => a.length === b.length && a.every((value, index) => value === b[index]),
    }
  )

  return (
    <TasksTableContext.Provider value={{
      setFeatureFlags: (value) => void setFeatureFlags(value),
      featureFlags
    }}>
      <div className="w-full overflow-x-auto">
        <ToggleGroup
          size="sm"
          type="multiple"
          variant="outline"
          className="w-fit"
          value={featureFlags}
          onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}
        >
          {dataTableConfig.featureFlags.map((flag) => (
            <Tooltip key={flag.value}>
              <ToggleGroupItem
                className="whitespace-nowrap px-3 text-xs"
                value={flag.value}
                asChild
              >
                <TooltipTrigger>
                  <flag.icon className="mr-2 size-3.5 shrink-0" aria-hidden="true" />
                  {flag.label}
                </TooltipTrigger>
              </ToggleGroupItem>
              <TooltipContent
                align="start"
                side="bottom"
                sideOffset={6}
                className={cn("flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground")}
              >
                <div>{flag.tooltipTitle}</div>
                <div className="text-muted-foreground text-xs">
                  {flag.tooltipDescription}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
      {children}
    </TasksTableContext.Provider>
  )
}