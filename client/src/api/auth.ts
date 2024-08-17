import axios from "./axios";

export const loginRequest = async (user: object) => axios.post('/login', user);
export const registerRequest = async (user: object) => axios.post('/register', user);
export const tokenCredentialsRequest = async () => axios.get('/verify');