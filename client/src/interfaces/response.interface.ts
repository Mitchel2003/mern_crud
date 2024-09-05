import { Response } from "express";

export interface ErrorResponse extends Response {
    response: { data: string[] }
}

export function isErrorResponse(e: unknown): e is ErrorResponse {
    return (typeof e === "object" && e !== null && "response" in e)
}