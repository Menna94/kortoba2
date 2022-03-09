require('dotenv').config();
//
import express from 'express';
import cors from 'cors';
//Routes
// import ProductRoutes from './routes/product.routes';
import { AuthRoutes } from './routes/auth.routes';
import { UserRoutes } from './routes/user.routes';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { ProductRoutes } from './routes/product.routes';
console.log(process.env.PORT);


createConnection({
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "kortoba2",
    "entities": [
        "src/entity/*ts"
    ],
    "logging": false,
    "synchronize": true
})
.then(conn => {
    const app = express();
    //app configs
    app.use(cors({
        credentials: true, // exchange cookies
        origin: ["http://localhost:4200"] //=>frontend route
    }));
    app.use(express.json());
    app.use(cookieParser());
    //
    const port = process.env.PORT || 3300;



    //mount routers
    UserRoutes(app);
    AuthRoutes(app);
    ProductRoutes(app);



    app.listen(port, () => {
        console.log(`App is listening on ${port}`);
    })
})
.then(msg => {
    console.log('Connected to Database Successfully');

})
.catch(err => {
    console.log('Error Connectiong To Database!');
    console.log(err.message);
    

})
