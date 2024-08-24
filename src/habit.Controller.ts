import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface Habit {
	id: string;
	name: string;
	description: string;
	target_days_per_week: number;
}
interface Completion {
	date: string;
}

// In-memory storage to habits
const habits: { [key: string]: Habit } = {};
const completions: { [key: string]: Set<string> } = {};

// * Create Habit
export const createHabits = async (req: Request, res: Response) => {
	try {
		const { name, description, target_days_per_week } = req.body;

		if (!name || !description || !target_days_per_week) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Create a unique to identify a habit
		const habitId = uuidv4();

		// Create a new habit and store in memory
		habits[habitId] = {
			id: habitId,
			name,
			description,
			target_days_per_week,
		};

		res.status(201).json({
			...habits[habitId],
			message: "Habit created successfully.",
		});
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in createHabit Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// * Log Habits
export const habitLogs = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { date } = req.body;

		if (!id || !date) {
			return res.status(400).json({ error: "Invalid input data." });
		}

		// habit with this id exist or not in list
		if (!habits[id]) {
			return res.status(404).json({ error: "Habit not found" });
		}
		if (!completions[id]) {
			completions[id] = new Set();
		}

		if (completions[id].has(date)) {
			return res
				.status(409)
				.json({ Conflict: "Completion already logged for this date" });
		}

		completions[id].add(date);
		res
			.status(201)
			.json({ id, date, message: "Completion logged successfully." });
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in habitLogs Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// *
export const getHabitList = async (req: Request, res: Response) => {
	try {
		const page = Number.parseInt(req.query.page as string) || 1;
		const limit = Number.parseInt(req.query.limit as string) || 10;
		const status = req.query.status as string;
		const name = req.query.name as string;

		let filteredHabits = Object.values(habits);
		console.log("FilteredHabits: ", filteredHabits);

		if (name) {
			filteredHabits = filteredHabits.filter((h) =>
				h.name.toLowerCase().includes(name.toLowerCase()),
			);
		}

		if (status) {
			const today = new Date().toISOString().split("T")[0];
			console.log(today);
			if (status === "completed") {
				filteredHabits = filteredHabits.filter((h) =>
					completions[h.id]?.has(today),
				);
			} else if (status === "not_completed") {
				filteredHabits = filteredHabits.filter(
					(h) => !completions[h.id]?.has(today),
				);
			}
		}
		const total = filteredHabits.length;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		const paginatedHabits = filteredHabits
			.slice(startIndex, endIndex)
			.map((h) => ({ ...h, completed_days: completions[h.id]?.size || 0 }));

		res.status(200).json({ habits: paginatedHabits, total, page, limit });
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in getHabitList Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

//* Delete Habit
export const deleteHabit = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!habits[id]) {
			return res.status(404).json({ error: "Habit not found" });
		}

		delete habits[id];
		delete completions[id];

		res.status(204).json({ message: "Habit deleted successfully." });

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in deleteHabit Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
