import { User } from "../Models/user.model.js";

const GenerateAccessToken = async function (id, req) {
    try {
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");

        
        const userAgent = req.headers["user-agent"] || "unknown"; 
        const ip = req.ip || req.connection.remoteAddress || "0.0.0.0";

        
        const AccessToken = await user.generateAccessToken(userAgent, ip);


        return { AccessToken };
    } catch (error) {
        console.log("Error while creating token:", error);
        return null; // Ensure the function doesn't return undefined
    }
};

export { GenerateAccessToken };
