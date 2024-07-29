import axios from "axios";
const path = 'http://localhost:4000/api';

export const requestRegister = async (data: object) => { axios.post(`${path}/register`, data) }
export const requestLogin = async (req: object) => { axios.post(`${path}/login`, req) }