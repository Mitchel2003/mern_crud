import axios from "axios";

const instance = axios.create({
  //baseURL: 'https://rest-api-qvo9.onrender.com/api', /* to mode production */
  baseURL: 'http://localhost:4000/api', /* to mode development */
  withCredentials: true
})

export default instance