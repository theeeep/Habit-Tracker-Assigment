import { configDotenv as config } from "dotenv";
import express from "express";
import habitRoutes from "./habit.Routes.js";
config();

const app = express();
app.use(express.json());

app.use("/api", habitRoutes);

app.listen(process.env.PORT, () => console.log("Server running on Port 3000"));

export default app;
