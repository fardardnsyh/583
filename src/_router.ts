export const LOGIN = "/login"
export const BASE_URL = "/"

export const authRoutes = [
    '/login',
    "/register",
    "/api/auth/callback/google",
    "/api/auth/callback/github",
]


export const publicRoutes = [
    "/",
    "/user/*",
]

export const privateRoutes = [
    "/dashboard",
    "/verify/*",
]