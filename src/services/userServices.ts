import {instance} from "@/config/axiosConfig.ts";

export const getMySetting = async () => {
    const response = await instance.get('/user-setting');
    return response.data;
};

export const updateMySetting = async (body: any) => {
    const response = await instance.put('/user-setting', body);
    return response.data;
};