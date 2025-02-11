import type { DataTableRowAction } from "@/types/table-advanced.types";
import { useFormatMutation } from "@/hooks/query/useFormatQuery";
import { Curriculum } from "@/interfaces/context.interface";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { getErrorMessage } from "@/errors/handle-error";
import { formatDate } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/ui/data-table-advanced/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuRadioItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Curriculum> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Curriculum>[] {
  return [
    {
      id: "select",
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      )
    },
    {
      accessorKey: "_id",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="_id" />,
      cell: ({ row }) => <div className="w-20"> {row.getValue("_id")} </div>
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader title="Name" column={column} />,
      cell: ({ row }) => {
        const service = row.original.office.services.find((s) => s === row.original.service)
        return (
          <div className="flex space-x-2">
            {service && <Badge variant="outline">{service}</Badge>}
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      size: 40,
      id: "actions",
      cell: ({ row }) => <ItemDropdown row={row} setRowAction={setRowAction} />,
    }
  ]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface ItemDropdownProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Curriculum> | null>>
  row: Row<Curriculum>
}

const ItemDropdown = ({ row, setRowAction }: ItemDropdownProps) => {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()
  const { updateFormat } = useFormatMutation("cv");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, type: "update" })}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Service</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={row.original.service}
              onValueChange={(value) => {
                startUpdateTransition(() => {
                  toast.promise(
                    updateFormat({ id: row.original._id, data: { service: value as Curriculum["service"] } }),
                    { loading: "Updating...", success: "Service updated", error: (err) => getErrorMessage(err) }
                  )
                })
              }}
            >
              {row.original.office.services.map((service) => (
                <DropdownMenuRadioItem
                  key={service}
                  value={service}
                  className="capitalize"
                  disabled={isUpdatePending}
                >
                  {service}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, type: "delete" })}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}