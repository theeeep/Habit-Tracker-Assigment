# Habit Tracker Assignment

## Overview

This repository contains the backend implementation for a real-time chat application. Built with modern web technologies, it provides a robust foundation for scalable, real-time communication.

- **API Endpoint**:  <https://habit-tracker-assigment.onrender.com/api>

### Deployment Configuration

If you're deploying your own instance on Render:

1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Use the following settings:
   - **Environment**: Node
   - **Build Command**: `pnpm install && npx prisma generate && pnpx prisma migrate deploy`
   - **Start Command**: `pnpm start`
4. Add the following environment variables in the Render dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `PORT`: 10000 (Render uses port 10000 by default)

Note: Ensure your `DATABASE_URL` points to a production-ready database, not your local development database.
