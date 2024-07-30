import axios from "axios";
const path = 'http://localhost:4000/api';

export const loginRequest = async (req: object) => { axios.post(`${path}/login`, req) }
export const registerRequest = async (data: object) => { axios.post(`${path}/register`, data) }
