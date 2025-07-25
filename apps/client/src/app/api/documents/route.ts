import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const headers = req.headers;
  const res = await fetch("http://localhost:3001/api/documents", {
    headers,
  });
  const docs = await res.json();
  return NextResponse.json(docs);
};

export const POST = async (req: NextRequest) => {
  const headers = req.headers
  const res = await fetch("http://localhost:3001/api/documents", {
    method: "POST",
    headers
  });

  const created = await res.json();
  return NextResponse.json(created);
};
