import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, login } from "../api";

// Custom hook for handling user login
export const useLogin = () => {
    return useMutation({
        mutationKey : ["login"],
        mutationFn: login,
    })
}

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        retry: false,
    });
};
