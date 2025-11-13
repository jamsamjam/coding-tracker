import { NextRequest, NextResponse } from "next/server";
import Database from "easy-json-database";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");
const db = new Database(dbPath);

if (!db.has("memo")) {
  db.set("memo", "Track your progress and level up your coding skills");
}

export async function GET() {
  try {
    const memo = db.get("memo") || "Track your progress and level up your coding skills";
    return NextResponse.json({ success: true, data: memo });
  } catch (error) {
    console.error("Error fetching memo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch memo" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { memo } = await request.json();
    
    if (typeof memo !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid memo format" },
        { status: 400 }
      );
    }
    
    db.set("memo", memo);
    
    return NextResponse.json({ success: true, data: memo });
  } catch (error) {
    console.error("Error saving memo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save memo" },
      { status: 500 }
    );
  }
}

