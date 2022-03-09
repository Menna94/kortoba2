import { Request,Response } from "express";
import { verify } from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const protect = async(req:Request, res:Response, next:Function) =>{
    try{
        let token:string; 

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
// console.log('token from pro');

        if(!token){
            return res.status(400).send({
                success: false,
                message: "SORRY, But You Are Not Authorized to Access this Route!",
                data: null,
            })
        }
        const decode:any = verify(token, "process.env.JWT_SECRET");

        const repository = getManager().getRepository(User);
        const user = await repository.findOne(decode.id);

        req["user"] = user;
        
        next();
    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: "Internal Server Error While Authorizing User!",
            data: err.message,
        })
    }
}