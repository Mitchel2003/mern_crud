export interface AxiosResponse {
  response: { data: { message: string, code: string } }
}

export function isAxiosResponse(e: unknown): e is AxiosResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}