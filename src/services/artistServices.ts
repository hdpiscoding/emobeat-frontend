import {instance} from "@/config/axiosConfig.ts";

export const getArtists = async (topN: number = 5) => {
    const response = await instance.get(`recommender/top-artist-today?topN=${topN}`);
    return response.data;
}

export const getArtistDetail = async (artistId: number) => {
    const response = await instance.post(`artist/search?page=1&rpp=1`,
        {
            "filters": [
                {
                    "operator": "equal",
                    "key": "id",
                    "value": artistId
                }
            ],
            "sorts": [
                {
                    "key": "id",
                    "type": "DESC"
                }
            ]
        });
    return response.data;
}