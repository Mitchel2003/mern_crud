import { Response } from "express";

export interface ErrorResponse extends Response {
    response: { data: string[] }
}