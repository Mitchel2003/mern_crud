import type { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from "@/types/table-advanced.types";
import { DataTableAdvancedToolbar } from "@/components/ui/data-table-advanced/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/ui/data-table-advanced/data-table-toolbar";
import { DataTable } from "@/components/ui/data-table-advanced/data-table";

import { riskCollection as risks, groupCollection as groups } from "@/utils/constants";
import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface";
import { getRiskIcon, toSentenceCase } from "@/lib/utils";
import { Handshake } from "lucide-react";
import * as React from "react";

import { useDataTable } from "@/hooks/core/data-table-advanced/use-data-table";
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions";
import { TasksTableFloatingBar } from "./tasks-table-floating-bar";
import { useFeatureFlagsContext } from "./feature-flags-provider";
import { DeleteCurriculumDialog } from "./delete-dialog";
import { getColumns } from "./tasks-table-columns";
import { UpdateTaskSheet } from "./update-sheet";

interface CurriculumTableProps extends ThemeContextProps {
  data: any[]
  pageCount: number
  // state: {
  //   columnFilters: ColumnFiltersState
  //   pagination: PaginationState
  //   sorting: SortingState
  // }
  // totalCount: number
  // isLoading: boolean
  // onSortingChange: (sorting: SortingState) => void
  // onPaginationChange: (pagination: PaginationState) => void
  // onColumnFiltersChange: (filters: ColumnFiltersState) => void
}

export const CurriculumTable = ({
  pageCount,
  theme,
  data,
}: CurriculumTableProps) => {
  const { featureFlags } = useFeatureFlagsContext();

  // Calculate counts for filters
  const riskCounts = React.useMemo(() =>
    data.reduce((acc, curr) => {
      acc[curr.riskClassification] = (acc[curr.riskClassification] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    , [data])

  const serviceCounts = React.useMemo(() =>
    data.reduce((acc, curr) => {
      acc[curr.service] = (acc[curr.service] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    , [data])

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Curriculum> | null>(null)
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<any>[] = React.useMemo(() => [
    {
      id: "name",
      value: "name",
      label: "Nombre",
      placeholder: "Filtrar nombres...",
    },
    {
      id: "service",
      label: "Servicio",
      value: "service",
      options: groups.flatMap(e => e.services).map((service) => ({
        label: toSentenceCase(service),
        count: serviceCounts[service],
        icon: Handshake,
        value: service
      }))
    },
    {
      label: "Nivel de Riesgo",
      id: "riskClassification",
      value: "riskClassification",
      options: risks.map((risk) => ({
        label: toSentenceCase(risk),
        count: riskCounts[risk],
        icon: getRiskIcon(risk),
        value: risk,
      }))
    }
  ], [riskCounts, serviceCounts])

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */
  const advancedFilterFields: DataTableAdvancedFilterField<any>[] = React.useMemo(() => [
    {
      id: "name",
      type: "text",
      value: "name",
      label: "Nombre",
    },
    {
      id: "service",
      type: "select",
      label: "Servicio",
      value: "service",
      options: groups.flatMap(e => e.services).map((service) => ({
        label: toSentenceCase(service),
        count: serviceCounts[service],
        icon: Handshake,
        value: service
      }))
    },
    {
      type: "select",
      label: "Riesgo",
      id: "riskClassification",
      value: "riskClassification",
      options: risks.map((risk) => ({
        label: toSentenceCase(risk),
        count: riskCounts[risk],
        icon: getRiskIcon(risk),
        value: risk,
      }))
    },
    {
      type: "date",
      id: "createdAt",
      value: "createdAt",
      label: "Created at",
    }
  ], [])

  const enableAdvancedTable = featureFlags.includes("advancedTable");
  const enableFloatingBar = featureFlags.includes("floatingBar");

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    enableAdvancedFilter: enableAdvancedTable,
    getRowId: (originalRow) => originalRow._id,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    }
  })

  return (
    <>
      <DataTable
        table={table}
        floatingBar={enableFloatingBar ? <TasksTableFloatingBar table={table} /> : null}
      >
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            filterFields={advancedFilterFields}
            shallow={false}
            table={table}
          >
            <TasksTableToolbarActions table={table} />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <TasksTableToolbarActions table={table} />
          </DataTableToolbar>
        )}
      </DataTable>

      <UpdateTaskSheet
        theme={theme}
        open={rowAction?.type === "update"}
        cv={rowAction?.row.original ?? null}
        onOpenChange={() => setRowAction(null)}
      />
      <DeleteCurriculumDialog
        showTrigger={false}
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        cvs={rowAction?.row.original ? [rowAction?.row.original] : []}
      />
    </>
  )
}