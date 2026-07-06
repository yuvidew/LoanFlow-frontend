import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProduct, getProducts, updateProduct } from "../api";
import type { GetProductsParams } from "../types";

export const useProductList = (params: GetProductsParams) => {
  return useQuery({
    queryKey: ["get-products-list", params],
    queryFn: () => getProducts(params),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-product"],
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-products-list"] });
      queryClient.invalidateQueries({
        queryKey: ["get-users-eligible-products"],
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-product"],
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-products-list"] });
      queryClient.invalidateQueries({
        queryKey: ["get-users-eligible-products"],
      });
    },
  });
};
