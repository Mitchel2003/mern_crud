import { ColumnSort, type Row, } from "@tanstack/react-table"
import type { DataTableConfig } from "@/config/data-table"
import { filterSchema } from "@/lib/parsers"
import { z } from "zod"

export type Prettify<T> = { [K in keyof T]: T[K] } & {}
export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface SearchParams {
  [key: string]: any
}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & { id: StringKeyOf<TData> }
>

// export type TableState = {
//   pagination: { pageIndex: number, pageSize: number }
//   columnFilters: ColumnFiltersState
//   sorting: SortingState
// }

export type ColumnType = DataTableConfig["columnTypes"][number]
export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]
export type FilterOperator = DataTableConfig["globalOperators"][number]
export type JoinOperator = DataTableConfig["joinOperators"][number]["value"]

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>
}

export interface DataTableAdvancedFilterField<TData> extends DataTableFilterField<TData> {
  type: ColumnType
}

export interface DataTableRowAction<TData> {
  type: "update" | "delete"
  row: Row<TData>
}

export interface Option {
  icon?: React.ComponentType<{ className?: string }>
  count?: number
  label: string
  value: string
}
export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  placeholder?: string
  options?: Option[]
  label: string
}

// export type SearchParams = {
//   joinOperator?: "and" | "or"
//   perPage?: string
//   filters?: string
//   title?: string
//   from?: string
//   page?: string
//   sort?: string
//   to?: string
// }

// export interface SearchParams {
//   [key: string]: string | string[] | undefined
// }

// export interface QueryBuilderOpts {
//   // where?: SQL;
//   // orderBy?: SQL;
//   distinct?: boolean;
//   nullish?: boolean;
// }

// export interface Filter<TData = any> {
//   type?: "number" | "boolean" | "date" | "text" | "select" | "multi-select"
//   value: string | string[]
//   operator: FilterOperator
//   id: StringKeyOf<TData>
//   rowId?: string
// }