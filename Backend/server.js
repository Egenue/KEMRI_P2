import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './Config/database.js';
import router from './Routes/formRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const defaultOrigins = [
    process.env.ORIGIN1 || "http://localhost:3000",
    process.env.ORIGIN2 || "http://localhost:3001",
    process.env.ORIGIN3 || "http://localhost:3002",
    process.env.ORIGIN4 || "http://localhost:3003",
    process.env.ORIGIN4 || "http://localhost:5137",
    process.env.CORS_ORIGIN || "https://kemri-p2.vercel.app"
];

const origin = (process.env.CORS_ORIGIN).split(',')

const configuredOrigins = (origin).map(origin => origin.trim()).filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) { 
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api", router);

app.listen(PORT, async () => {
    console.log(`Server running on Port ${PORT}`);
    
    try {
        await connection();
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
});