// import { z } from "zod"

// export const sortingItemSchema = z.object({ id: z.string(), desc: z.boolean() })

// export const filterSchema = z.object({
//   id: z.string(),
//   operator: z.enum([
//     "eq", "ne", "gt", "gte", "lt", "lte",
//     "in", "notIn", "contains", "startsWith",
//     "endsWith", "isEmpty", "isNotEmpty"
//   ]),
//   value: z.union([z.string(), z.array(z.string())])
// })

// export const searchParamsSchema = z.object({
//   to: z.string().optional(),
//   sort: z.string().optional(),
//   page: z.string().optional(),
//   from: z.string().optional(),
//   title: z.string().optional(),
//   perPage: z.string().optional(),
//   filters: z.string().optional(),
//   joinOperator: z.enum(["and", "or"]).optional()
// })
