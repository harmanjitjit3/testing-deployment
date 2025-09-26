import axios from "axios";

const API_URI = import.meta.env.VITE_API_URI;

export const API = axios.create({
  baseURL: API_URI,
  withCredentials: true,
  headers: {
    "Content-Type": 'application/json',
  }
})

export default API;


