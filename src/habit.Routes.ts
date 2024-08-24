import { Router } from "express";
import {
	createHabits,
	deleteHabit,
	getHabitList,
	habitLogs,
} from "./habit.Controller.js";

const habitRoutes = Router();

habitRoutes.get("/habits", getHabitList);
habitRoutes.post("/habits", createHabits);
habitRoutes.post("/habits/:id/log", habitLogs);
habitRoutes.delete("/habits/:id", deleteHabit);

export default habitRoutes;
