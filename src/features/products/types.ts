export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "SALARIED", label: "Salaried" },
  { value: "SELF_EMPLOYED", label: "Self-employed" },
] as const;

export const SALARY_TYPE_OPTIONS = [
  { value: "BANK_TRANSFER", label: "DAT" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CASH", label: "Cash" },
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPE_OPTIONS)[number]["value"];

export type SalaryType = (typeof SALARY_TYPE_OPTIONS)[number]["value"];

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  minCreditScore: number;
  minSalary: number;
  allowedEmploymentTypes: EmploymentType[];
  allowedSalaryTypes: SalaryType[];
}

export type CreateProductRequest = ProductPayload;

export interface UpdateProductRequest {
  productId: string;
  payload: ProductPayload;
}

export interface ProductsResponse {
  data: Data;
  message: string;
  success: boolean;
}

export interface ProductResponse {
  data: Product;
  message: string;
  success: boolean;
}

export interface Data {
  pagination: Pagination;
  products: Product[];
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  minCreditScore: number;
  minSalary: number;
  allowedEmploymentTypes: EmploymentType[];
  allowedSalaryTypes: SalaryType[];
  createdAt: string;
  updatedAt: string;
}
