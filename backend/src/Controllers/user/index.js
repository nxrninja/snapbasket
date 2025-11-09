import { getUserProfile , updateUserProfile , changePassword , updateAddress } from "./slice/user.controller.js";

export const user = {
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    changePassword: changePassword,
    updateAddress: updateAddress
}