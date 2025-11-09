import { OtpValidate } from "../../../Models/otpValidator.model.js"
import { User } from "../../../Models/user.model.js"
import { Queue } from "bullmq"
import { body, validationResult } from "express-validator"
import { Tempuser } from "../../../Models/tempUser.Model.js"



const verifyValidate = [
    body("email")
        .notEmpty()
        .withMessage("email is Required")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid Email Formet"),
    body("otp")
        .notEmpty()
        .withMessage("Otp is Required")
        .isLength({min: 6})
        .isNumeric()
        .withMessage("Otp Length is 6 and should be number")
]
const verifyOtp = async (req, res) => {
    try {

        const { email, otp, fullname, password } = req.body

        await Promise.all(verifyValidate.map((validate)=> validate.run(req)))
        let errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: errors.array()[0].msg
            })
        }

        const user = await OtpValidate.findOneAndDelete({ email: email, code: otp })
        if (!user) {
            return res.status(400).json({
                message: "Invalid Otp Or Expired"
            })
        }

        const findusertempdata = await Tempuser.findOne({email: email})
        if(!findusertempdata){
            return res.status(400).json({
                message: "Otp Verify but Your temp userdata not found! Please reRegistration"
            })
        };


        
        const newuser = new User({ username: findusertempdata.username , fullname: findusertempdata.fullname, email: findusertempdata.email,  password: findusertempdata.password})
        
        
        await newuser.save()

        await Tempuser.deleteOne({ email: email });

        const queue = new Queue("welcomeMessage")

        const queuedata = {
            fullname: findusertempdata.fullname,
            email: findusertempdata.email
        }

        const welcomemessagejob = async () => {
            await queue.add("welcomeMessage", { data: queuedata })
        }

        welcomemessagejob()



        return res.status(201).json({
            message: "User register Success",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error While Save User"
        })
    }
}


export { verifyOtp }