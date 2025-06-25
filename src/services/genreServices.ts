import {instance} from "@/config/axiosConfig.ts";

export const getGenres = async () => {
    const response = await instance.get("/genre");
    return response.data;
};

export const getGenreDetail = async (genreId: number) => {
    const response = await instance.get(`/genre/${genreId}`);
    return response.data;
};