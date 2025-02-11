import { Curriculum } from "@/interfaces/context.interface";
import { DeleteCurriculumDialog } from "./delete-dialog";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";
import { Download } from "lucide-react";

interface TasksTableToolbarActionsProps { table: Table<Curriculum> }

export function TasksTableToolbarActions({ table }: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0
        ? (
          <DeleteCurriculumDialog
            onSuccess={() => table.toggleAllRowsSelected(false)}
            cvs={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          />
        ) : null
      }

      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={() => exportTableToCSV(table, {
          excludeColumns: ["select", "actions"],
          filename: "curriculum"
        })}
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}