import {instance} from "@/config/axiosConfig.ts";

export const getAlbums = async (topN: number = 5) => {
    const response = await instance.get(`recommender/popular-albums?topN=${topN}`);
    return response.data;
}

export const getAlbumDetail = async (albumId: number) => {
    const response = await instance.get(`album/${albumId}`);
    return response.data;
}