import { type Filter } from "@/types/table-advanced.types"

/**
 * Filters out invalid or empty filters from an array of filters.
 * A filter is considered valid if:
 * - It has an 'isEmpty' or 'isNotEmpty' operator, or
 * - Its value is not empty (for array values, at least one element must be present;
 *   for other types, the value must not be an empty string, null, or undefined)
 */
export function getValidFilters<T>(filters: Filter<T>[]): Filter<T>[] {
  if (!Array.isArray(filters)) return []

  return filters.filter((filter) => {
    if (!filter) return false
    if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") return true
    if (Array.isArray(filter.value)) return filter.value.length > 0

    return filter.value !== ""
      && filter.value !== null
      && filter.value !== undefined
  })
}
