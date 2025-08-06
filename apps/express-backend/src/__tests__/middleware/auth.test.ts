import { validateUserId } from "../../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import { jest, describe, it, expect } from "@jest/globals";

describe("validateUserId middleware", () => {
  const createMockResponse = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {},
    } as unknown as Response;

    return res;
  };

  const next: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next and set res.locals.userId when header is valid", () => {
    const req = {
      headers: {
        "x-user-id": "abc123",
      },
    } as unknown as Request;

    const res = createMockResponse();

    validateUserId(req, res, next);

    expect(res.locals.userId).toBe("abc123");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 if x-user-id header is missing", () => {
    const req = {
      headers: {},
    } as Request;

    const res = createMockResponse();

    validateUserId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid or missing userId",
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
