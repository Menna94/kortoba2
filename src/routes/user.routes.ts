import { Router } from 'express';
import { deleteUser, getUser, getUsers, updatePassword, updateUser } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
const router = Router();



export const UserRoutes = (router: Router) =>{
    router.get('/api/v1/users', getUsers);
    router.get('/api/v1/users/:id', protect, getUser);
    router.put('/api/v1/users/:id', protect, updateUser);
    router.put('/api/v1/users/password', protect, updatePassword);
    router.delete('/api/v1/users/:id', protect, deleteUser);

}
