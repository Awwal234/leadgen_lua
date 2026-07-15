import axios from "axios";

const api = axios.create({
  baseURL: "https://cycling-garlic-dinginess.ngrok-free.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

