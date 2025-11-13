import { NextRequest, NextResponse } from "next/server";

const VALID_CREDENTIALS = {
  password: process.env.PASSWORD,
};

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15분

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    
    const attempts = loginAttempts.get(clientIp);
    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      
      if (attempts.count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
        return NextResponse.json(
          { 
            success: false, 
            message: `Too many failed attempts. Try again in ${remainingTime} minutes.` 
          },
          { status: 429 }
        );
      }
      
      if (timeSinceLastAttempt >= LOCKOUT_TIME) {
        loginAttempts.delete(clientIp);
      }
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    if (password === VALID_CREDENTIALS.password) {
      loginAttempts.delete(clientIp);
      
      return NextResponse.json({
        success: true,
        message: "Login successful",
      });
    } else {
      const currentAttempts = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
      loginAttempts.set(clientIp, {
        count: currentAttempts.count + 1,
        lastAttempt: Date.now(),
      });
      
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
