import dotenv from "dotenv";
import type { Request, Response } from "express";
import { validateUserId } from "./middleware/auth.ts";
import documentRouter from "./routes/document.ts";
import userRouter from "./routes/user.ts";
import { expressApp } from "./expressApp.ts";

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
