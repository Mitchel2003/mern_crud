import axios from "./axios";

//Authentication requests
export const logoutRequest = async () => axios.post('/auth/logout');
export const loginRequest = async (user: object) => axios.post('/auth/login', user);
export const registerRequest = async (user: object) => axios.post('/auth/register', user);

//verification requests
export const getOnAuthRequest = async () => axios.get('/auth/on-auth');
export const forgotPasswordRequest = async (data: object) => axios.post('/auth/forgot-password', data);