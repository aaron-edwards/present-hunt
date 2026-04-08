import { NextResponse } from "next/server";

import { getFirstStep, getHuntDestination } from "@/lib/hunt";
import {
  createInitialProgress,
  getCookieName,
  getProgressCookieValue,
} from "@/lib/progress";

export async function GET(request: Request) {
  const response = NextResponse.redirect(
    new URL(getHuntDestination(getFirstStep().id), request.url),
  );

  response.cookies.set({
    name: getCookieName(),
    value: getProgressCookieValue(createInitialProgress()),
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
