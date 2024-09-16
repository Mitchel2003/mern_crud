export interface AxiosResponse { response: { data: string } }
export interface ApiResponse { data: string }

export function isAxiosResponse(e: unknown): e is AxiosResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}

export function isApiResponse(e: unknown): e is ApiResponse {
  return (typeof e === "object" && e !== null && "data" in e)
}