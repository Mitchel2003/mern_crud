import { type ColumnFiltersState, type PaginationState, type SortingState } from "@tanstack/react-table"
import { useDebounce } from "@/hooks/core/data-table-advanced/use-debounce"
import { searchParamsCache } from "@/utils/search-params-cache"
import { getValidFilters } from "@/utils/get-valid-filters"
import { SearchParams } from "@/types/table-advanced.types"
import { Curriculum } from "@/interfaces/context.interface"
import { useQueryFormat } from "./query/useFormatQuery"
import { useSearchParams } from "react-router-dom"
import { useCallback, useMemo } from "react"

export interface CurriculumTableState {
  columnFilters: ColumnFiltersState
  pagination: PaginationState
  sorting: SortingState
}

export function useCurriculumTable() {
  // URL Search Params
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParamsCache.parse(searchParams)

  // Parse filters from URL
  const validFilters = useMemo(() => getValidFilters(
    typeof search.filters === 'string'
      ? JSON.parse(search.filters)
      : (search.filters ?? [])
  ), [search.filters])

  // Table state from URL
  const state = useMemo<CurriculumTableState>(() => ({
    pagination: {
      pageSize: Number(search.perPage) || 10,
      pageIndex: Math.max(0, Number(search.page) - 1)
    },
    columnFilters: validFilters,
    sorting: (() => typeof search?.sort === 'string' ? JSON.parse(search.sort) : [{ id: "createdAt", desc: true }])()
  }), [search.page, search.perPage, search.sort, validFilters])

  // Debounce state changes to prevent too many URL updates
  const debouncedState = useDebounce(state, 300)

  // Update URL when state changes
  const updateSearchParams = useCallback((newState: Partial<CurriculumTableState>) => {
    const currentState = { ...state, ...newState }

    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('page', String(currentState.pagination.pageIndex + 1))
      params.set('perPage', String(currentState.pagination.pageSize))
      params.set('sort', JSON.stringify(currentState.sorting))
      params.set('filters', JSON.stringify(currentState.columnFilters))
      return params
    }, { replace: true })
  }, [setSearchParams, state])

  // Build search params for API
  const buildSearchParams: SearchParams = useMemo(() => ({
    page: String(debouncedState.pagination.pageIndex + 1),
    filters: JSON.stringify(debouncedState.columnFilters),
    perPage: String(debouncedState.pagination.pageSize),
    sort: JSON.stringify(debouncedState.sorting),
    joinOperator: search.joinOperator ?? 'and'
  }), [debouncedState, search.joinOperator])

  // Fetch data using React Query
  const { data = { data: [], totalCount: 0, pageCount: 0 }, isLoading } = useQueryFormat()
    .fetchFormatByPaginate<Curriculum>('cv', buildSearchParams, debouncedState.columnFilters)

  // Event handlers
  const onPaginationChange = useCallback((updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
    const newPagination = typeof updater === 'function' ? updater(state.pagination) : updater
    updateSearchParams({ pagination: newPagination })
  }, [state.pagination, updateSearchParams])

  const onSortingChange = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(state.sorting) : updater
    updateSearchParams({ sorting: newSorting })
  }, [state.sorting, updateSearchParams])

  const onFiltersChange = useCallback((updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
    const newFilters = typeof updater === 'function' ? updater(state.columnFilters) : updater
    updateSearchParams({ columnFilters: newFilters })
  }, [state.columnFilters, updateSearchParams])

  return {
    // Data
    data: data.data,
    pageCount: data.pageCount,
    totalCount: data.totalCount,
    isLoading,

    // State
    state: debouncedState,

    // Event handlers
    onPaginationChange,
    onSortingChange,
    onFiltersChange
  }
}