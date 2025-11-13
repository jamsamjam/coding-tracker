"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

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

interface AddProblemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (problem: Omit<Problem, "id">) => void;
}

export function AddProblemDialog({
  isOpen,
  onClose,
  onAdd,
}: AddProblemDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Medium",
    url: "",
    date: new Date().toISOString().split("T")[0],
    timeSpent: "",
    tags: "",
    learned: "",
    status: "Solved",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setFormData({
      title: "",
      difficulty: "Medium",
      url: "",
      date: new Date().toISOString().split("T")[0],
      timeSpent: "",
      tags: "",
      learned: "",
      status: "Solved",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Problem</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Problem Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Two Sum"
              />
            </div>

            {/* Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Problem URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://leetcode.com/problems/two-sum/"
              />
            </div>

            {/* Date and Time Spent */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Spent
                </label>
                <input
                  type="text"
                  value={formData.timeSpent}
                  onChange={(e) =>
                    setFormData({ ...formData, timeSpent: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30 min"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Array, HashMap, Two Pointers"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Solved</option>
                <option>Need Review</option>
                <option>Failed</option>
                <option>Revisit</option>
              </select>
            </div>

            {/* Notes / What I Learned */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Notes / What I Learned
              </label>
              <textarea
                value={formData.learned}
                onChange={(e) =>
                  setFormData({ ...formData, learned: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Key insights, patterns, or techniques learned..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Problem
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

