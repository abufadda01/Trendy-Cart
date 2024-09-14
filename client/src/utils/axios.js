import axios from "axios"

export const axiosObj = axios.create({
    baseURL : import.meta.mode === "development" ? "http://localhost:5500/api" : "/api" ,
    withCredentials : true // send cookies to the server
})