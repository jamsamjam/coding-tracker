import { NextRequest, NextResponse } from "next/server";
import Database from "easy-json-database";
import path from "path";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  url: string;
  date: string;
  timeSpent: string;
  tags: string[];
  learned: string;
  status: string;
}

const dbPath = path.join(process.cwd(), "db.json");
const db = new Database(dbPath);

export async function GET() {
  try {
    const problems = db.get("problems") || [];
    return NextResponse.json({ success: true, data: problems });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const problems = (db.get("problems") || []) as Problem[];
    
    const newProblem = {
      ...body,
      id: Math.max(0, ...problems.map((p) => p.id)) + 1,
    };
    
    problems.push(newProblem);
    db.set("problems", problems);
    
    return NextResponse.json({ success: true, data: newProblem });
  } catch (error) {
    console.error("Error adding problem:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add problem" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const problems = (db.get("problems") || []) as Problem[];
    
    const index = problems.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 }
      );
    }
    
    problems[index] = { ...problems[index], ...body };
    db.set("problems", problems);
    
    return NextResponse.json({ success: true, data: problems[index] });
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update problem" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    
    const problems = (db.get("problems") || []) as Problem[];
    const filteredProblems = problems.filter((p) => p.id !== id);
    
    db.set("problems", filteredProblems);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete problem" },
      { status: 500 }
    );
  }
}
