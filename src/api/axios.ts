import axios from "axios";

const instance = axios.create({
    //baseURL: 'http://localhost:4000/api', /* to mode development */
    baseURL: 'https://rest-api-qvo9.onrender.com/api',
    withCredentials: true
})

export default instance