import { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
const router = Router();



export const AuthRoutes = (router: Router) =>{
    router.post('/api/v1/auth/register', Register);
    router.post('/api/v1/auth/login', Login);
    router.get('/api/v1/auth/logout', protect, Logout);
    router.get('/api/v1/auth/user', protect, AuthenticatedUser);

}
