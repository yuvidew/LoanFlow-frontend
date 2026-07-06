import { api } from "@/constants/instance";
import { apiEndPoints } from "@/lib/api-end-points";
import type {
  CreateProductRequest,
  EmploymentType,
  GetProductsParams,
  Pagination,
  Product,
  ProductResponse,
  ProductsResponse,
  SalaryType,
  UpdateProductRequest,
} from "./types";

type ProductApiResponse = Omit<
  Product,
  "allowedEmploymentTypes" | "allowedSalaryTypes" | "minSalary"
> & {
  allowedEmploymentTypes: string[];
  allowedSalaryTypes: string[];
  minSalary: number | string;
};

type GetProductsApiResponse = Omit<ProductsResponse, "data"> & {
  data: {
    pagination: Pagination;
    products: ProductApiResponse[];
  };
};

type ProductApiResult = Omit<ProductResponse, "data"> & {
  data: ProductApiResponse;
};

const normalizeProduct = (product: ProductApiResponse): Product => ({
  ...product,
  allowedEmploymentTypes: product.allowedEmploymentTypes as EmploymentType[],
  allowedSalaryTypes: product.allowedSalaryTypes as SalaryType[],
  minSalary: Number(product.minSalary),
});

export const getProducts = async (
  params: GetProductsParams,
): Promise<ProductsResponse> => {
  const { data } = await api.get<GetProductsApiResponse>(
    apiEndPoints.products.products_list,
    { params },
  );

  return {
    ...data,
    data: {
      ...data.data,
      products: data.data.products.map(normalizeProduct),
    },
  };
};

export const createProduct = async (
  payload: CreateProductRequest,
): Promise<ProductResponse> => {
  const { data } = await api.post<ProductApiResult>(
    apiEndPoints.products.create_product,
    payload,
  );

  return {
    ...data,
    data: normalizeProduct(data.data),
  };
};

export const updateProduct = async ({
  productId,
  payload,
}: UpdateProductRequest): Promise<ProductResponse> => {
  const { data } = await api.put<ProductApiResult>(
    apiEndPoints.products.update_product(productId),
    payload,
  );

  return {
    ...data,
    data: normalizeProduct(data.data),
  };
};
