import express from "express";

export const expressApp = () => {
  const app = express();

  app.use(express.json());
  return app
}
