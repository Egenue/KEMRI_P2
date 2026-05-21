import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './Config/database.js';
import router from './Routes/formRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//      CORS configuration      //
const allowedOrigins = [
  process.env.ORIGIN1,
  process.env.ORIGIN2,
  process.env.ORIGIN3,
  process.env.ORIGIN4
].map(url => url?.replace(/\/$/, "")); 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use("/api", router);

app.listen(PORT, async () => {
    console.log(`Server running on Port ${PORT}`);
    
    try {
        await connection();
        console.log("Database connected successfully.");
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
});