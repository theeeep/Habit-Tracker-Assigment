import request from "supertest";
import app from "../src/index";

describe("Habit Tacking API", () => {
	let habitId: string;
	test("POST /habits - Create a new habit", async () => {
		const response = await request(app).post("/api/habits").send({
			name: "Exercise",
			description: "Do 30 minutes of exercise",
			target_days_per_week: 5,
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("id");
		expect(response.body.name).toBe("Exercise");
		expect(response.body.message).toBe("Habit created successfully");
	});
});
