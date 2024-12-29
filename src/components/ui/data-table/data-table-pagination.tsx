import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Button } from "#/ui/button"

interface DataTablePaginationProps<TData> { table: Table<TData> }
export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between px-2">
      {/* selected rows */}
      <div className="hidden md:block md:col-span-3 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
      </div>

      {/* pagination */}
      <div className="flex md:col-span-3 justify-between items-center space-x-6 lg:space-x-8">
        {/* rows per page */}
        <div className="hidden md:flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          {/* number of pages */}
          <div className="flex w-[100px] items-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>

          {/* pagination buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="flex h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
} 