import { Request, Response } from "express"
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcrypt from 'bcryptjs';



// //@desc     Fetch All Users
// //@route    GET /api/v1/users
// //@access   protected => @admin
export const getUsers = async (req:Request, res:Response)=>{
    try{
        
        const repository = getManager().getRepository(User);
        const users = await repository.find({
            relations: ['role']
        });

        if (!users) {
            return res.status(404).send({
                success: false,
                message: 'No Users Were Found!',
                data: null
            })
        }
        
        res.status(200).send({
            success: true,
            message: 'Users Fetched Successfully',
            count: users.length,
            data: users.map(user=>{
                const {password, ...data} = user;
                return data;
            })
        })

    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Fetching Users!',
            data: err.message
        })
    }
}



// //@desc     Fetch Single User
// //@route    GET /api/v1/users/:id
// //@access   protected => @admin/ @user
export const getUser = async (req:Request, res:Response)=>{
    try{
        const id = +req.params.id;
        const userId = +req['user'].id;
        
        if(!req['user'] || userId !== id){
            return res.status(401).send({
                success: false,
                message: 'Not Authorized To Access The Route!',
                data: null
            })
        }
        const repository = getManager().getRepository(User);
        const {password, ...user} = await repository.findOne(id);

        if (!user) {
            return res.status(404).send({
                    success: false,
                    message: 'No Users Were Found!',
                    data: null
                })
        }
        res.status(200).send({
            success: true,
            message: 'User Fetched Successfully',
            data: user
        })

    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error While Fetching User!',
            data: err.message
        })
    }
}




// //@desc     Update User
// //@route    PUT /api/v1/users/:id
// //@access   protected => @admin/ @user
export const updateUser = async (req:Request, res:Response)=>{
    try{
        const user = req['user'];
        const userId = +req['user'].id;
        const id = +req.params.id;
        const { role_id, ...data} = req.body;
// console.log(user);

        if(userId !== id){
            return res.status(400).send({
                success: false,
                message: 'Not Authorized To Update This User',
                data: null
            })
        }

        const repository = getManager().getRepository(User);
        const updated = await repository.update(user.id, data);

        if(!updated){
            return res.status(400).send({
                success: true,
                message: 'Error While Updating User',
                data: null
            })
        }
        const { password, ...newUser } =  await repository.findOne(user.id);
        console.log(newUser);
        
        res.status(200).send({
            success: true,
            message: 'User Updated Successfully',
            data: newUser
        })
    }
    catch(err){
        return res.status(404).send({
            success: false,
            message: 'Internal Server Error While Updating User !',
            data: err.message
        })
    }

}


// //@desc     Update User Password
// //@route    PUT /api/v1/users/password
// //@access   protected => @user
export const updatePassword = async (req:Request, res:Response)=>{
    try{
        const user = req['user'];

        if(req.body.password != req.body.cpassword){
            return res.status(400).send({
                success: false,
                message: 'Passwords Don\'t Match',
                data: null
            })
        }

        const repository = getManager().getRepository(User);
        const passUpdate = await repository.update(user.id, {
            password: await bcrypt.hash(req.body.password, 10)
        });

        if(!passUpdate){
            return res.status(400).send({
                success: true,
                message: 'Error While Updating User',
                data: null
            })
        }
        const { password, ...data } =  user;
        res.status(200).send({
            success: true,
            message: 'User Password Updated Successfully',
            data
        })
    }
    catch(err){
        return res.status(404).send({
            success: false,
            message: 'Internal Server Error While Updating User !',
            data: err.message
        })
    }

}



// //@desc     Delete User
// //@route    DELETE /api/v1/users/:id
// //@access   protected => @admin
export const deleteUser = async (req:Request, res:Response)=>{
    try{
        const user = req['user'];
        const id = req.params.id;


        // if(user.role !== 3){
        //     // console.log(user.role.id);
            
        //     return res.status(401).send({
        //         success: false,
        //         message: 'Not Authorized To Delete User!',
        //         data: null
        //     })
        // }
        // else{
            const repository = getManager().getRepository(User);
            const deletedUser = await repository.delete(id);
    
            if(!deletedUser){
                return res.status(400).send({
                    success: true,
                    message: 'Error While Deleting User',
                    data: null
                })
            }
            const users = await repository.find();
            res.status(200).send({
                success: true,
                message: 'User Deleted Successfully',
                count: users.length,
                data:users
            })
        // }

        
    }
    catch(err){
        return res.status(404).send({
            success: false,
            message: 'Internal Server Error While Deleting User !',
            data: err.message
        })
    }

}
