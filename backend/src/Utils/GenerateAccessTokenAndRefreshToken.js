import { User } from "../Models/user.model.js";

const GenerateAccessTokenAndRefreshToken = async function (id) {
    try {
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");


        const AccessToken = await user.generateAccessToken();
        const RefreshToken = await user.generateRefreshToken();

    
        user.refrestoken = RefreshToken;
        await user.save({ validateBeforeSave: false });

        return { AccessToken, RefreshToken };
    } catch (error) {
        console.log("Error while creating token:", error);
        return null; // Ensure the function doesn't return undefined
    }
};

export { GenerateAccessTokenAndRefreshToken };
