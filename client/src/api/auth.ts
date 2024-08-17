import { AxiosResponse } from "axios";
import axios from "./axios";

import { UserCredentials } from "../interfaces/context.interface";

export const loginRequest = async (user: object) => axios.post('/login', user);
export const registerRequest = async (user: object) => axios.post('/register', user);
export const tokenCredentialsRequest = async (): Promise<AxiosResponse<UserCredentials>> => axios.get<UserCredentials>('/verify');