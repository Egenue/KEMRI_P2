import express from 'express';
import dotenv from 'dotenv';
import connection from './Config/database.js';
import router from './Routes/loginRoutes.js';
import route from './Routes/formRoutes.js';

dotenv.config();
await connection();


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/apis', route);
app.use("/api", router)

app.listen( PORT, () => {
    return console.log(`Server running on Port ${PORT}`);
});