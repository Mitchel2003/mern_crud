import { Task } from "./context.interface"

export interface ErrorResponse {
  response: { data: string[] }
}

export function isErrorResponse(e: unknown): e is ErrorResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}