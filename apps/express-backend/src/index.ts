import dotenv from "dotenv";
import type { Request, Response } from "express";
import { validateUserId } from "./middleware/auth";
import documentRouter from "./routes/document";
import userRouter from "./routes/user";
import { expressApp } from "./expressApp";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = expressApp()

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
