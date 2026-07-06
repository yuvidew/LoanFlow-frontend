const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiEndPoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  products: {
    products_list: "/products/list",
    create_product: "/products/create",
    update_product: (productId: string) => `/products/${productId}/update`,
  },
  users: {
    get_users_list: "/users/list",
    create_user: "/users/create-user",
  },
} as const;

export { BASE_URL, apiEndPoints };
