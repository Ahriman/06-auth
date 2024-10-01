import { registerUser } from "./auth";
import { logout } from "./auth";
import { loginWithGoogle } from "./auth/login-google.action";
import { loginUser } from "./auth/login.action";



export const server = {
    // actions

    // Auth
    registerUser,
    logout,
    loginUser,
    loginWithGoogle
}