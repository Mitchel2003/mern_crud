import axios from "axios";
const path = 'http://localhost:4000/api';

export const loginRequest = async (user: object) => axios.post(`${path}/login`, user);
export const registerRequest = async (user: object) => axios.post(`${path}/register`, user);
