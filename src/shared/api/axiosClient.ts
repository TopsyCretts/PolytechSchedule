import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosClient = (baseUrl: string) =>
  axios.create({ baseURL: baseUrl, timeout: 10000 })

export { axiosClient, BASE_URL }
