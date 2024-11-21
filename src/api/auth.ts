import axios from "./axios";

//Authentication requests
export const loginRequest = async (user: object) => axios.post('/auth/login', user);
export const registerRequest = async (user: object) => axios.post('/auth/register', user);

//Verify requests
export const verifyAuthRequest = async () => axios.get('/auth/verify-auth');
export const verifyActionRequest = async (mode: string, body: object) => axios.post(`/auth/verify-action/${mode}`, body);