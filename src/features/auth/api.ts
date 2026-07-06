import { CurrentUserResponse, LoginPayload, LoginResponse } from "./types";
import { api } from "@/lib/axios";
import { apiEndPoints } from "@/lib/api-end-points";
import { AUTH_COOKIE_NAME, setCookie } from "@/lib/cookies";

// Login API call
export const login = async (
    payload: LoginPayload
): Promise<LoginResponse> => {
    const {data} = await api.post<LoginResponse>(apiEndPoints.auth.login, payload);

    setCookie(AUTH_COOKIE_NAME, data.token);
    
    return data;
};

// Logout API call
export const logout = async (): Promise<void> => {
    const {data} = await api.post(apiEndPoints.auth.logout);

    return data;
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
    const {data} = await api.get<CurrentUserResponse>(apiEndPoints.auth.me);

    return data;
};
