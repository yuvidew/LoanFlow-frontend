import {api} from "@/constants/instance";
import { CreateUserRequest, CreateUserResponse, GetUsersParams, GetUsersResponse, EligibleProductsResponse} from "./types";
import { apiEndPoints } from "@/lib/api-end-points";

// calling a api to create user

export const createUser = async (
    payload : CreateUserRequest
) : Promise<CreateUserResponse> => {
    const {data} = await api.post<CreateUserResponse>(apiEndPoints.users.create_user, payload);

    return data;
};

// calling a api to create user
export const getUsersList = async (
    params : GetUsersParams
) : Promise<GetUsersResponse>  => {
    const {data} = await api.get<GetUsersResponse>(apiEndPoints.users.get_users_list , { params });

    return data;
};

// calling api to get eligible user for products 
export const getEligibleProducts = async (
  userId: string
): Promise<EligibleProductsResponse> => {
  const response = await api.get<EligibleProductsResponse>(
    `${apiEndPoints.users.get_users_list}/${userId}/eligible-products`
  );

  return response.data;
};