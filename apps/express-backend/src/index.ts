import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import { validateUserId } from "./middleware/auth.ts";
import documentRouter from "./routes/document.ts";
import userRouter from "./routes/user.ts";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get("/api/healthcheck", (_: Request, res: Response) => {
  res.status(200).send("App is running");
});

app.use("/api/documents", validateUserId, documentRouter);

app.use("/api/users", userRouter);

const server = app.listen(PORT, () => {
  console.log(`App listnening on port ${PORT}`);
});

server.on("error", (err: any) => {
  console.error(err);
});
