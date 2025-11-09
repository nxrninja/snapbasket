import { Login } from "./slice/Login.controller.js"
import { RefreshToken } from "./slice/RefreshToken.Controller.js"
import { Registration } from "./slice/registration.controller.js"
import { verifyOtp } from "./slice/verify_OTP.Controller.js"

const auth = {
    registration: Registration,
    verifyOtp: verifyOtp,
    refreshToken: RefreshToken,
    login: Login
}

export {auth}