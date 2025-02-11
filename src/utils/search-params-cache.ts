import { z } from "zod"

// Definimos el schema para los filtros
// const filterSchema = z.object({ //this function dont is used, we need export him?
//   id: z.string(),
//   value: z.union([z.string(), z.array(z.string())]),
//   operator: z.enum(["equals", "contains", "startsWith", "endsWith", "isEmpty", "isNotEmpty", "in", "notIn"])
// })

// Define the search params schema
const searchParamsSchema = z.object({
  to: z.string().default(""),
  from: z.string().default(""),
  page: z.string().default("1"),
  title: z.string().default(""),
  perPage: z.string().default("10"),
  filters: z.string().default("[]"),
  joinOperator: z.enum(["and", "or"]).default("and"),
  flags: z.array(z.enum(["advancedTable", "floatingBar"])).default([]),
  sort: z.string().default("[]")
})

type SearchParamsType = z.infer<typeof searchParamsSchema>

// Parse and validate search params
export const searchParamsCache = {
  parse: (searchParams: URLSearchParams | Record<string, string>): SearchParamsType => {
    const params = searchParams instanceof URLSearchParams ?
      Object.fromEntries(searchParams.entries()) :
      searchParams

    return searchParamsSchema.parse({
      to: params.to ?? "",
      from: params.from ?? "",
      page: params.page ?? "1",
      title: params.title ?? "",
      perPage: params.perPage ?? "10",
      filters: params.filters ?? "[]",
      joinOperator: params.joinOperator ?? "and",
      flags: params.flags ? JSON.parse(params.flags) : [],
      sort: params.sort ?? "[]"
    })
  }
}