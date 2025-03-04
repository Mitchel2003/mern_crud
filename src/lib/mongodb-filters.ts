import { type SearchParams } from "@/interfaces/db.interface"
import { type SortingState } from "@tanstack/react-table"

export type MongoOperator =
  | "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte"
  | "$in" | "$nin" | "$exists" | "$regex" | "$options"

export type MongoQuery = { [key: string]: { [K in MongoOperator]?: any } | any }
export type MongoPaginationOptions = { skip: number, limit: number }
export type MongoSortOptions = { [key: string]: 1 | -1 }

const operatorMap = {
  eq: "$eq",
  ne: "$ne",
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  in: "$in",
  notIn: "$nin",
  contains: "$regex",
  startsWith: "$regex",
  endsWith: "$regex",
  isEmpty: "$exists",
  isNotEmpty: "$exists"
} as const
//validFilters dont is used, what i do with him?, we need use here?
export function convertToMongoQuery(searchParams: SearchParams, validFilters: any[] = []): MongoQuery {
  const query: MongoQuery = {}

  try {
    const filters = typeof searchParams.filters === 'string'
      ? JSON.parse(searchParams.filters)
      : searchParams.filters

    if (!Array.isArray(filters)) return validFilters

    filters.forEach(filter => {
      const { id, value, operator } = filter
      const mongoOperator = operatorMap[operator as keyof typeof operatorMap]
      if (!mongoOperator) return

      switch (operator) {
        case "contains":
          query[id] = {
            [mongoOperator]: value,
            $options: "i"
          }
          break
        case "startsWith":
          query[id] = {
            [mongoOperator]: `^${value}`,
            $options: "i"
          }
          break
        case "endsWith":
          query[id] = {
            [mongoOperator]: `${value}$`,
            $options: "i"
          }
          break
        case "isEmpty":
          query[id] = { [mongoOperator]: false }
          break
        case "isNotEmpty":
          query[id] = { [mongoOperator]: true }
          break
        case "in":
        case "notIn":
          query[id] = { [mongoOperator]: Array.isArray(value) ? value : [value] }
          break
        default:
          query[id] = { [mongoOperator]: value }
      }
    })
  } catch (e) { console.error("Error parsing filters:", e) }
  return query
}

export function buildSortOptions(sort: string | SortingState | undefined): MongoSortOptions {
  const options: MongoSortOptions = {}
  try {
    const sorting = typeof sort === 'string' ? JSON.parse(sort) : sort
    if (!Array.isArray(sorting)) return options
    sorting.forEach(({ id, desc }) => { options[id] = desc ? -1 : 1 })
  } catch (e) { console.error("Error parsing sort options:", e) }
  return options
}

export function buildPaginationOptions(page: number, perPage: number): MongoPaginationOptions {
  const sanitizedPage = Math.max(1, Number(page) || 1)
  const sanitizedPerPage = Math.max(1, Math.min(100, Number(perPage) || 10))

  return {
    limit: sanitizedPerPage,
    skip: (sanitizedPage - 1) * sanitizedPerPage
  }
}