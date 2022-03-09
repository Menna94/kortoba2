import { Joi } from "express-validation";

export const RegisterValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    cpassword: Joi.string().required(),
})