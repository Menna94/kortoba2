import { Request, Response } from "express";
import { RegisterValidation } from "../validation/register.validation";
import bcrypt from 'bcryptjs';
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { sign, verify } from "jsonwebtoken";

export const Register = async (req:Request, res:Response)=>{
    try{
        const body = req.body;
        //hash password
        const hashedPass = await bcrypt.hash(body.password, 10 );
    
        const {error} = RegisterValidation.validate(body);
        //validate form inputs
        if(error){
            return res.status(400).send({
                success: false,
                message: 'ValidationError!',
                data: error.details
            })
        }
        //check if the provided password matched with confirm password
        if(body.password != body.cpassword){
            return res.status(400).send({
                    success: false,
                    message: 'Passwords Don\'t Match!',
                    data: null
                })
        }
    
        const repository = getManager().getRepository(User);
    
        //create new user
        const user = await repository.save({
            name: body.name,
            email: body.email,
            password: hashedPass,
            role: {
                id: 1 //by default it's created as a user
            }
        })
    
        if(!user){
            return res.status(400).send({
                success: false,
                message: 'Error Occured While Creating User!',
                data: null
            })
        }
        res.status(201).send({
            success: true,
            message: 'User Created Successfully',
            data: user
        })
    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Registering User',
            data: err.message,
        })
    }
    

    
} 



export const Login = async (req:Request, res:Response)=>{
    try{
        const {email, password} = req.body;
    
        const repository = getManager().getRepository(User);
        const user = await repository.findOne({email});
    
        const matchPass = await bcrypt.compare(password, user.password);
    
        if(!email || ! password){
            return res.status(400).send({
                success: false,
                message: 'You Have To Provide Email & Password!',
                data: null
            })
        }
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'There Is NO User With The Provided Email!',
                data: null
            })
        }
        if(!matchPass){
           return  res.status(401).send({
                success: false,
                message: 'Invalid Credentials!!',
                data: null
            })
        }
         //(1) sign jsonwebtoken
         const token = sigJWTtoken(user.id);
    
         //(2) create a token-cookie 
         const cookieOptions ={
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true, //to be accessible from the server-side only
         };
         
         //set the secure option to true only when the app is in the production environment
        //  if (process.env.NODE_ENV === "production") {
        //     cookieOptions.secure = true;
        //  }
        
        res
            .status(201)
            .cookie('token', token, cookieOptions)
            .send({
                success: true,
                message: 'User Logged-in Successfully',
                data: user,
                token
            })
    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Logging-in',
            data: err.message,
        })
    }
    

    
} 


export const AuthenticatedUser = async (req:Request, res:Response)=>{
    const {password, ...user} = req['user']
    res.send(user);
}



export const Logout = async (req:Request, res:Response)=>{
    try{
        res.cookie('token', '', { maxAge : 0 });

        res.status(200).send({
            success: true,
            message: 'User Logged-out Successfully',
        })
    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Logging-out',
            data: err.message,
        })
    }
    
}



const sigJWTtoken =  (uid:number)=>{
    return sign({
        id : uid 
    }, 
    'process.env.JWT_SECRET',{
        expiresIn: '1d'
    })
}