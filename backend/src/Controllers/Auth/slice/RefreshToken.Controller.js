import jwt from 'jsonwebtoken'
import { User } from '../../../Models/user.model.js';
import { RefreshtokenOption } from '../../../Utils/option.js';
const RefreshToken = async (req ,res) => {
    try {
        const refrestoken = req.cookies?.RefreshToken;
        console.log(refrestoken)

        if(!refrestoken){
            return res.status(400).json({
                message: "RefresToken NOt Received"
            })
        }

        const verifytoken = jwt.verify(
            refrestoken,
            process.env.REFRESH_TOKEN_SECRET
        )

        if(!verifytoken){
            return res.status(400).json({
                message: "Invalid Token"
            })
        }

        const user = await User.findById(verifytoken._id);
        if(!user){
            return res.status(404).json({
                message: "Invalid User"
            })
        }

        if(user.refrestoken != refrestoken){
            return res.status(400).json({
                message: "Token Expired"
            })
        }

        const AccessToken = await user.generateAccessToken();


        return res.cookie("RefreshToken", refrestoken  , RefreshtokenOption)
        .json({
            accessToken: AccessToken
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Servver Error"
        })
    }   
}


export {RefreshToken}