import { Request, Response, NextFunction } from "express";
import z from "zod";

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    "x-user-id": z.coerce.string(),
  });

  const result = schema.safeParse(req.headers);

  if (!result.success) {
    return res
      .status(400)
      .json({
        error: "Invalid or missing userId",
        details: result.error.issues,
      });
  }

  next();
};
