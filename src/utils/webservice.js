import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_API_KEY;
    config.headers = { Authorization: `Bearer ${token}` };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default instance;
