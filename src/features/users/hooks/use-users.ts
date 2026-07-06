import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createUser, getEligibleProducts, getUsersList } from "../api";
import type { GetUsersParams } from "../types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-users-list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-users-eligible-products"],
      });
    },
  });
};

export const useUserList = (params: GetUsersParams) => {
  return useQuery({
    queryKey: [
      "get-users-list",
      params.page,
      params.limit,
      params.search ?? "",
      params.status ?? "ALL",
    ],
    queryFn: () => getUsersList(params),
    placeholderData: keepPreviousData,
  });
};

export const useUserEligibleProducts = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["get-users-eligible-products", userId],
    queryFn: () => getEligibleProducts(userId),
    enabled,
  });
};
