import { CheckCircle2, Download, Loader, Trash2, X } from "lucide-react";
import { useFormatMutation } from "@/hooks/query/useFormatQuery";
import { groupCollection as groups } from "@/utils/constants";
import { Curriculum } from "@/interfaces/context.interface";
import { getErrorMessage } from "@/errors/handle-error";
import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { exportTableToCSV } from "@/lib/export";
import * as React from "react";
import { toast } from "sonner";

import { Select, SelectItem, SelectGroup, SelectContent } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { Kbd } from "@/components/ui/kbd";

interface TasksTableFloatingBarProps { table: Table<Curriculum> }

export function TasksTableFloatingBar({ table }: TasksTableFloatingBarProps) {
  const [action, setAction] = React.useState<"update-service" | "export" | "delete">();
  const { updateFormat, deleteFormat } = useFormatMutation("cv");
  const [isPending, startTransition] = React.useTransition();
  const rows = table.getFilteredSelectedRowModel().rows;

  // Clear selection on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { event.key === "Escape" && table.toggleAllRowsSelected(false) }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [table]);

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
        <div className="w-full overflow-x-auto">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow">
            <div className="flex h-7 items-center rounded-md border border-dashed pr-1 pl-2.5">
              <span className="whitespace-nowrap text-xs">
                {rows.length} selected
              </span>
              <Separator orientation="vertical" className="mr-1 ml-2" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-5 hover:border"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className="size-3.5 shrink-0" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                  <p className="mr-2">Clear selection</p>
                  <Kbd abbrTitle="Escape" variant="outline">
                    Esc
                  </Kbd>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="hidden h-5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Select
                onValueChange={(value: Curriculum["service"]) => {
                  setAction("update-service");
                  startTransition(() => {
                    toast.promise(
                      async () => { Promise.all(rows.map(row => updateFormat({ id: row.original._id, data: { service: value } }))) },
                      { loading: "Updating...", success: "Curriculum updated", error: (err) => getErrorMessage(err) }
                    )
                  })
                }}
              >
                <Tooltip>
                  <SelectTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        disabled={isPending}
                        className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      >
                        {isPending && action === "update-service" ? (
                          <Loader
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircle2
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </SelectTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Update service</p>
                  </TooltipContent>
                </Tooltip>
                <SelectContent align="center">
                  <SelectGroup>
                    {/**
                     *  i need remove this
                     *  i can send to props the services
                     */}
                    {groups.flatMap(group => group.services).map((service) => (
                      <SelectItem
                        key={service}
                        value={service}
                        className="capitalize"
                      >
                        {service}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled={isPending}
                    className="size-7 border"
                    onClick={() => {
                      setAction("export")
                      startTransition(() => {
                        exportTableToCSV(table, { excludeColumns: ["select", "actions"], onlySelected: true })
                      })
                    }}
                  >
                    {isPending && action === "export"
                      ? <Loader aria-hidden="true" className="size-3.5 animate-spin" />
                      : <Download className="size-3.5" aria-hidden="true" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Export curriculum</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled={isPending}
                    className="size-7 border"
                    onClick={() => {
                      setAction("delete")
                      startTransition(() => {
                        Promise.all(rows.map((row) => deleteFormat({ id: row.original._id })))
                          .then((data) => {
                            if (data.some((d) => !d)) return toast.error("One or more curriculums could not be deleted")
                            table.toggleAllRowsSelected(false)
                          })
                          .catch(() => toast.error("An error occurred while deleting curriculums"))
                      })
                    }}
                  >
                    {isPending && action === "delete"
                      ? <Loader aria-hidden="true" className="size-3.5 animate-spin" />
                      : <Trash2 className="size-3.5" aria-hidden="true" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Delete curriculum</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}