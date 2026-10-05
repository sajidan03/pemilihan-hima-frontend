import axios from "axios";

const api = axios.create({
  baseURL: "https://pemilihan-hima-backend.vercel.app/api",
});

export default api;