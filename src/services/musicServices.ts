/* eslint-disable */
import {instance} from "@/config/axiosConfig.ts";

interface searchBody {
    filters: Array<{
        operator: string;
        key: string;
        value: any;
    }>;
    sorts: Array<{
        key: string;
        type: string;
    }>;
}

export const searchMusic = async (
    body: searchBody,
    page: number,
    limit: number = 10
) => {
    const response = await instance.post(
        `music/search?rpp=${limit}&page=${page}`,
        body
    );
    return response.data;
}

export const getMyfavorites = async (page: number, limit: number = 10) => {
    const response = await instance.post(
        `favorite-list/me?rpp=${limit}&page=${page}`,
        {
            "sorts": [
                {
                    "key": "createAt",
                    "type": "DESC"
                }
            ]
        }
    );
    return response.data;
}

export const addToFavorites = async (songId: number) => {
    const response = await instance.post(`favorite-list/add`, {musicId: songId});
    return response.data;
}

export const removeFromFavorites = async (songId: number) => {
    const response = await instance.delete(`favorite-list/remove`, {
        data: { musicId: songId }
    });
    return response.data;
}

export const checkFavorite = async (musicId: number) => {
    const response = await instance.get(`favorite-list/check/${musicId}`);
    return response.data;
}

export const getRecommendedQueue = async (limit: number) => {
    const response = await instance.get(`recommender/songs?topN=${limit}`);
    return response.data;
}