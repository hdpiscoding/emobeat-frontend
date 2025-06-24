import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";


const instance = axios.create({
    baseURL: "https://api-emobeat.sonata.io.vn/api/v1/",
    timeout: 100000
});

const emotionInstance = axios.create({
    baseURL: "https://api-emobeat.sonata.io.vn/emotion-collector-service/api/v1/",
    timeout: 100000
});

const getAccessToken = () => {
    const token = useAuthStore.getState().accessToken;
    return token ? `Bearer ${token}` : "";
}

instance.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = getAccessToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("API error", error);
        return Promise.reject(error);
    }
);
export {instance, emotionInstance};