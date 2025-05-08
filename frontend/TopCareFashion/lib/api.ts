import axios from "axios";

const API = axios.create({
  baseURL: "http://172.20.10.2:3000/api",   // ← replace with your laptop’s IP
  headers: { "Content-Type": "application/json" },
});

export default API;
