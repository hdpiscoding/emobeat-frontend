import axios from "axios";

export const listenerLogin = async (usernameOrEmail: string, password: string) => {
    const response = await axios.post("https://api-emobeat.sonata.io.vn/api/v1/listener/login", {
        usernameOrEmail,
        password,
    });
    return response.data;
}

export const register = async (email: string, password: string, username: string, fullname: string, gender: string, nationality: string, birthdate: string) => {
    const response = await axios.post("https://api-emobeat.sonata.io.vn/api/v1/listener/register", {
        email,
        password,
        username,
        fullname,
        gender,
        nationality,
        birthdate
    });
    return response.data;
}

export const activateEmail = async (email: string, otp: string) => {
    const response = await axios.get(`https://api-emobeat.sonata.io.vn/api/v1/listener/activate/email?otp=${otp}&email=${email}`);
    return response.data;
}

export const adminLogin = async (email: string, password: string) => {
    const response = await axios.post("https://api-emobeat.sonata.io.vn/api/v1/admin/login", {
        email,
        password,
    });
    return response.data;
}