import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "./cookies";

// Require authentication for a route
export const requireAuth = async () => {
    const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/sign-in");
  }

  return token;
}

// Require unauthenticated access for a route
export const requireUnAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    redirect("/users");
  }
};
