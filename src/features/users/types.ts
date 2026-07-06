
export type ApplicantStatus = "ACTIVE" | "REJECTED";

export type UserStatus = "ACTIVE" | "REJECTED";

export type User = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  creditScore: number;
  employmentType:
  | "SALARIED"
  | "SELF_EMPLOYED";

  salaryType:
  | "BANK_TRANSFER"
  | "CASH"
  | "CHEQUE";
  monthlySalary: number;
  status: UserStatus;
  createdAt: string;
};

const statusFilters = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Rejected", value: "REJECTED" },
] as const;

export type StatusFilter = (typeof statusFilters)[number]["value"];

export interface CreateUserRequest {
  fullName: string;
  dateOfBirth: string;
  creditScore: number;
  employmentType: "SALARIED" | "SELF_EMPLOYED";
  salaryType: "BANK_TRANSFER" | "CASH" | "CHEQUE";
  monthlySalary: number;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: UsersData;
}

export interface UsersData {
  users: User[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "REJECTED";
}

export interface EligibleProductsResponse {
  success: boolean;
  message: string;
  data: EligibleProduct[];
}

export interface EligibleProduct {
  id: string;
  name: string;
  description: string | null;
}

export type UserStatusFilter = "ALL" | "ACTIVE" | "REJECTED";
