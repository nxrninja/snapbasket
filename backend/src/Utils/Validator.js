import { body, validationResult } from "express-validator";

export const validatedata = (your1value , your1message , your2mesage)=>[
    body(your1value)
        .notEmpty()
        .withMessage(your1message)
        .bail()
        .isString()
        .withMessage(your2mesage)
]

export const runvalidation =async (req , res , Validation)=>{
await Promise.all(validatedata.map((validate) => validate.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }
}