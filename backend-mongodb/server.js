import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import observationRoutes from "./routes/observationRoutes.js";
import seguimientoRoutes from "./routes/seguimientoRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/observaciones', observationRoutes);
app.use("/api/seguimientos", seguimientoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});