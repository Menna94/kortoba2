import { Joi } from "express-validation";

export const AddProductValidation = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    shortDescription: Joi.string().required(),
    imgURL: Joi.string().required()
})