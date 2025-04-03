import express from "express";
import "dotenv/config";
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";


const app = express();
const PORT = process.env.PORT || 7000;
job.start();
app.use(cors())
app.use(express.json());
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/books", bookRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});