import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      app: "healthy",
      database: process.env.DATABASE_URL ? "configured" : "not_configured",
      email: process.env.RESEND_API_KEY ? "configured" : "not_configured",
    },
  });
}
