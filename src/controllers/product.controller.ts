import { Request, Response } from "express"
import { getManager } from "typeorm";
import bcrypt from 'bcryptjs';
import { Product } from "../entity/product.entity";
import { AddProductValidation } from "../validation/addProduct.validation";
import { User } from "../entity/user.entity";



//@desc     Fetch All Products
//@route    GET /api/v1/products
//@access   public
export const getProducts = async (req: Request, res: Response) => {
    try {

        const repository = getManager().getRepository(Product);
        const products = await repository.find({
            relations: ['user']
        });

        if (!products) {
            return res.status(404).send({
                success: false,
                message: 'No Products Were Found!',
                data: null
            })
        }

        res.status(200).send({
            success: true,
            message: 'Products Fetched Successfully',
            count: products.length,
            data: products
        })

    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Fetching Products!',
            data: err.message
        })
    }
}



//@desc     Fetch Single Product
//@route    GET /api/v1/products/:id
//@access   public
export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const repository = getManager().getRepository(Product);
        const product = await repository.findOne(id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'No Product Found!',
                data: null
            })
        }
        res.status(200).send({
            success: true,
            message: 'Product Fetched Successfully',
            data: product
        })

    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Fetching Product!',
            data: err.message
        })
    }
}



//@desc     Create Product
//@route    POST /api/v1/products
//@access   protected => @admin/ @user /@publisher
export const addProduct = async (req: Request, res: Response) => {
    try {
        const { user_id, ...data } = req.body;
        const reqUser: User = req['user'];

        const { error } = AddProductValidation.validate(data);

        //validate form inputs
        if (error) {

            return res.status(400).send({
                success: false,
                message: 'ValidationError!',
                data: error.details
            })
        }

        const repository = getManager().getRepository(Product);

        //create new product
        const product = await repository.save({
            title: data.title,
            price: data.price,
            shortDescription: data.shortDescription,
            imgURL: data.imgURL,
            user: {
                id: reqUser.id
            }
        })

        if (!product) {
            return res.status(400).send({
                success: false,
                message: 'Error Occured While Creating Product!',
                data: null
            })
        }
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            data: product
        })
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Creating Product',
            data: err.message,
        })
    }
}




//@desc     Update A Product
//@route    PUT /api/v1/products/:id
//@access   protected => @admin/ @publisher
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const userId = +req['user'].id;
        const productId = req.params.id;

        const repository = getManager().getRepository(Product);
        const product = await repository.findOne(productId, {
            relations: ['user']
        });

        if (userId !== product.user.id) {
            return res.status(401).send({
                success: false,
                message: 'Not Authorized To Update This Product',
                data: null
            })
        }

        const updated = await repository.update(productId, req.body);

        if (!updated) {
            return res.status(400).send({
                success: false,
                message: 'Error While Updating Product',
                data: null
            })
        }
        const newProduct = await repository.findOne(productId);
        res.status(200).send({
            success: true,
            message: 'Product Updated Successfully',
            data: newProduct
        })
    }
    catch (err) {
        return res.status(404).send({
            success: false,
            message: 'Internal Server Error While Updating Product !',
            data: err.message
        })
    }

}



//@desc     Delete A Product
//@route    DELETE /api/v1/products/:id
//@access   protected => @admin/ @publisher
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const user = req['user'];
        const id = req.params.id;

        const repository = getManager().getRepository(Product);
        const product = await repository.findOne(id, {
            relations: ['user']
        });
console.log(product.user);

        if (product.user.id !== +user.id) {
            return res.status(401).send({
                success: false,
                message: 'Not Authorized To Delete This Product!',
                data: null
            })
        }
            const deletedProduct = await repository.delete(id);

            if (!deletedProduct) {
                return res.status(400).send({
                    success: true,
                    message: 'Error While Deleting Product',
                    data: null
                })
            }
            const products = await repository.find();
            res.status(200).send({
                success: true,
                message: 'Product Deleted Successfully',
                count: products.length,
                data: products
            })
            


        }
    catch (err) {
            return res.status(404).send({
                success: false,
                message: 'Internal Server Error While Deleting Product !',
                data: err.message
            })
        }

    }
