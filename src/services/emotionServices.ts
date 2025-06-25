import {emotionInstance} from "@/config/axiosConfig.ts";

export const collectEmotion = async (body: any) => {
    const response = await emotionInstance.post('emotion-collect/collect', body);
    return response.data;
}