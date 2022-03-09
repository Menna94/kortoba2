import { Router } from 'express';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller';
import { protect } from '../middlewares/auth.middleware';



export const ProductRoutes = (router: Router) =>{
    router.get('/api/v1/products', getProducts);
    router.post('/api/v1/products', protect, addProduct);

    router.get('/api/v1/products/:id', getProduct);
    router.put('/api/v1/products/:id', protect, updateProduct);
    router.delete('/api/v1/products/:id', protect, deleteProduct);


}
