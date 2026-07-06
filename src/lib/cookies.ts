const AUTH_COOKIE_NAME = "admin-token";

// Set a cookie with a specified name, value, and optional max-age (default is 1 day)
const setCookie = (name: string, value: string, maxAge = 60 * 60 * 24) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

// Delete a cookie by setting its max-age to 0
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export const getCookie = () => {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    const match = cookies.find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));
    return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

export { AUTH_COOKIE_NAME, setCookie, deleteCookie };

