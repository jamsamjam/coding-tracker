"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ContributionGraph } from "@/components/contribution-graph";
import { AddProblemDialog } from "@/components/add-problem-dialog";
import { EditProblemDialog } from "@/components/edit-problem-dialog";
import { LoginDialog } from "@/components/login-dialog";
import { NotesRenderer } from "@/components/notes-renderer";
import { ExternalLink, Clock, Calendar, Trash2, LogOut, Pencil, Check, X } from "lucide-react";

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

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [memo, setMemo] = useState("Track your progress and level up your coding skills");
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [tempMemo, setTempMemo] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProblems();
      fetchMemo();
    }
  }, [isAuthenticated]);

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/problems");
      const result = await response.json();
      if (result.success) {
        setProblems(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemo = async () => {
    try {
      const response = await fetch("/api/memo");
      const result = await response.json();
      if (result.success) {
        setMemo(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch memo:", error);
    }
  };

  const saveMemo = async (newMemo: string) => {
    try {
      const response = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo: newMemo }),
      });
      const result = await response.json();
      if (result.success) {
        setMemo(result.data);
      }
    } catch (error) {
      console.error("Failed to save memo:", error);
    }
  };

  const handleEditMemo = () => {
    setTempMemo(memo);
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    saveMemo(tempMemo);
    setIsEditingMemo(false);
  };

  const handleCancelMemo = () => {
    setTempMemo("");
    setIsEditingMemo(false);
  };

  const handleAddProblem = async (newProblem: Omit<Problem, "id">) => {
    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProblem),
      });
      const result = await response.json();
      if (result.success) {
        setProblems([...problems, result.data]);
      }
    } catch (error) {
      console.error("Failed to add problem:", error);
    }
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProblem = async (updatedProblem: Problem) => {
    try {
      const response = await fetch("/api/problems", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProblem),
      });
      const result = await response.json();
      if (result.success) {
        setProblems(problems.map((p) => (p.id === updatedProblem.id ? result.data : p)));
      }
    } catch (error) {
      console.error("Failed to update problem:", error);
    }
  };

  const handleDeleteProblem = async (id: number) => {
    try {
      const response = await fetch(`/api/problems?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setProblems(problems.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete problem:", error);
    }
  };

  const handleLogin = async (
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setProblems([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Solved":
        return "bg-blue-100 text-blue-800";
      case "Need Review":
        return "bg-orange-100 text-orange-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Revisit":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProblems = problems.filter((p) => {
    const statusMatch = filterStatus === "All" || p.status === filterStatus;
    const difficultyMatch =
      filterDifficulty === "All" || p.difficulty === filterDifficulty;
    return statusMatch && difficultyMatch;
  });

  const stats = {
    total: problems.length,
    solved: problems.filter((p) => p.status === "Solved").length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  // 인증 체크 중
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return <LoginDialog onLogin={handleLogin} />;
  }

  // 데이터 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Coding Test Tracker
            </h1>
            <div className="mt-1 flex items-center gap-2">
              {isEditingMemo ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={tempMemo}
                    onChange={(e) => setTempMemo(e.target.value)}
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your memo..."
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSaveMemo}
                    className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelMemo}
                    className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">{memo}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleEditMemo}
                    className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              + Add Problem
            </Button>
            <Button
              onClick={handleLogout}
              size="lg"
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-90">Total Problems</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{stats.solved}</div>
              <div className="text-sm opacity-90">Solved</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{stats.easy}</div>
              <div className="text-sm opacity-90">Easy</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{stats.medium}</div>
              <div className="text-sm opacity-90">Medium</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{stats.hard}</div>
              <div className="text-sm opacity-90">Hard</div>
            </CardContent>
          </Card>
        </div> */}

        {/* Contribution Graph */}
        <ContributionGraph problems={problems} />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="font-medium text-gray-700">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option>All</option>
            <option>Solved</option>
            <option>Need Review</option>
            <option>Failed</option>
            <option>Revisit</option>
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredProblems.length} of {problems.length} problems
          </span>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProblems.map((p) => (
            <Card
              key={p.id}
              className="shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold flex-1">{p.title}</h2>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProblem(p)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProblem(p.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Link */}
                <div className="flex items-center gap-2">
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Difficulty and Status */}
                <div className="flex gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getDifficultyColor(
                      p.difficulty
                    )}`}
                  >
                    {p.difficulty}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Date and Time */}
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(p.date).toLocaleDateString()}
                  </div>
                  {p.timeSpent && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {p.timeSpent}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                {p.learned && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <NotesRenderer content={p.learned} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No problems found. Try adjusting your filters or add a new
              problem!
            </p>
          </div>
        )}
      </div>

      {/* Add Problem Dialog */}
      <AddProblemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddProblem}
      />

      {/* Edit Problem Dialog */}
      <EditProblemDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingProblem(null);
        }}
        onUpdate={handleUpdateProblem}
        problem={editingProblem}
      />
    </div>
  );
}