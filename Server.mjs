import express, { json } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './Config/db.mjs';
import { errorHandler } from './Middlewares/errorHandler.mjs';
import authRoutes from './Routes/authRoutes.mjs';
import userRoutes from './Routes/userRoutes.mjs';
import adminRoutes from './Routes/adminRoutes.mjs';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Config/swagger.mjs";

dotenv.config();
const app = express();
connectDB();
app.use(express.json())
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/user",userRoutes);
app.use("/admin",adminRoutes);

app.use( (req,res,next)=>{
    const error = new Error("Route not found");
    error.statusCode = 404;
    return next(error);
})



app.use(errorHandler)
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Port is running on port ${PORT}`)
})