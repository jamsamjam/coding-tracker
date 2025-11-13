"use client";

import { useMemo } from "react";

interface Problem {
  id: number;
  date: string;
}

interface ContributionGraphProps {
  problems: Problem[];
}

export function ContributionGraph({ problems }: ContributionGraphProps) {
  const { weeks, counts } = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // 52 weeks

    const counts: { [key: string]: number } = {};
    problems.forEach((p) => {
      const dateStr = p.date;
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const weeks: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];

    const current = new Date(startDate);
    
    // Fill in days from start to today
    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];
      const dayOfWeek = current.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push({
        date: new Date(current),
        count: counts[dateStr] || 0,
      });

      current.setDate(current.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, counts };
  }, [problems]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    return "bg-blue-800 dark:bg-blue-300";
  };

  const monthLabels = useMemo(() => {
    const labels: { month: string; offset: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      const month = firstDay.date.getMonth();
      
      if (month !== lastMonth && weekIndex > 0) {
        labels.push({
          month: firstDay.date.toLocaleDateString("en-US", { month: "short" }),
          offset: weekIndex,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [weeks]);

  const totalProblems = problems.length;
  const daysActive = Object.keys(counts).length;

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold">
          {totalProblems} problems in the last year
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {daysActive} days active
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="relative h-4 mb-1">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="absolute text-xs text-gray-600 dark:text-gray-400"
                style={{ left: `${label.offset * 14}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400 mr-2">
              <div className="h-[10px]">Mon</div>
              <div className="h-[10px]"></div>
              <div className="h-[10px]">Wed</div>
              <div className="h-[10px]"></div>
              <div className="h-[10px]">Fri</div>
              <div className="h-[10px]"></div>
              <div className="h-[10px]"></div>
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[10px] h-[10px] rounded-sm ${getColor(
                        day.count
                      )} hover:ring-2 hover:ring-gray-400 transition-all cursor-pointer`}
                      title={`${day.date.toLocaleDateString()}: ${
                        day.count
                      } problems`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

