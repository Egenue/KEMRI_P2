import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './Config/database.js';
import router from './Routes/formRoutes.js';

dotenv.config();
await connection();


const app = express();
const PORT = process.env.PORT;

//      CORS configuration      //
const corsOrigins = [process.env.CORS1, process.env.CORS2, process.env.CORS3] ;
app.use(cors({
    origin: corsOrigins,
    methods:['PUT', 'GET', 'DELETE', 'POST'],
    credentials: true
}));


app.use(express.json());
app.use("/api", router);

app.listen( PORT, () => {
    return console.log(`Server running on Port ${PORT}`);
});