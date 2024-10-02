import React from "react";
import { ChevronsUp } from "lucide-react"; // Import the Zap icon

// Import the level order from the same place it's defined in CareerChartPage
const levelOrder = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Manager",
  "Senior Manager",
  "Director",
  "Executive",
];

const LevelBreakdown = ({ data }) => {
  const { levelStats, candidateLevelTotals } = calculateLevelStats(data);
  const averageTimePerLevel =
    calculateAverageTimePerLevel(candidateLevelTotals);

  // Sort candidates by average time per level (ascending) and include the average time
  const sortedCandidatesWithAvg = Object.entries(averageTimePerLevel)
    .sort(([, a], [, b]) => a - b)
    .map(([name, avg]) => ({ name, avgYearsPerLevel: avg }));

  // If you still need just the names in order:
  const sortedCandidates = sortedCandidatesWithAvg.map(({ name }) => name);

  // Get the top three shortest durations
  const topThreeShortest = sortedCandidatesWithAvg.slice(0, 3);

  return (
    <div className="mt-2 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ShortestDurationsColumn topThreeShortest={topThreeShortest} />
          {levelOrder
            .slice(0, 3)
            .map(
              (level) =>
                levelStats[level] && (
                  <LevelStatItem
                    key={level}
                    level={level}
                    color={colorMap[level]}
                    stats={levelStats[level]}
                  />
                )
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {levelOrder
            .slice(3)
            .map(
              (level) =>
                levelStats[level] && (
                  <LevelStatItem
                    key={level}
                    level={level}
                    color={colorMap[level]}
                    stats={levelStats[level]}
                  />
                )
            )}
        </div>
      </div>
    </div>
  );
};

const LevelStatItem = ({ level, color, stats }) => (
  <div className="border border-gray-100 rounded-md p-2 shadow-sm">
    <div className="flex items-center mb-2">
      <div
        className="w-12 h-6 rounded-full mr-2"
        style={{ backgroundColor: color }}
      ></div>
      <div className="text-base font-semibold text-black">{level}</div>
    </div>
    <div className="grid grid-cols-3 gap-x-2 gap-y-1">
      <span className="text-sm font-semibold text-black">Pool Mean:</span>
      <span className="text-sm font-semibold text-black">Min:</span>
      <span className="text-sm font-semibold text-black">Max:</span>
      <span className="text-sm text-black pl-0.5">
        {stats.avg.toFixed(1)} years
      </span>
      <span className="text-sm text-black pl-0.5">
        {stats.min.value.toFixed(1)} years
      </span>
      <span className="text-sm text-black pl-0.5">
        {stats.max.value.toFixed(1)} years
      </span>
      <span></span>
      <span className="text-xs text-gray-600 pl-0.5">{stats.min.name}</span>
      <span className="text-xs text-gray-600 pl-0.5">{stats.max.name}</span>
    </div>
  </div>
);

// Helper function to calculate statistics for each level
const calculateLevelStats = (data) => {
  const levelStats = {};
  const candidateLevelTotals = {};

  Object.entries(data).forEach(([name, career]) => {
    candidateLevelTotals[name] = {};

    career.forEach((position) => {
      if (!levelStats[position.level]) {
        levelStats[position.level] = {
          durations: [],
          min: { value: Infinity, name: "" },
          max: { value: -Infinity, name: "" },
        };
      }

      if (!candidateLevelTotals[name][position.level]) {
        candidateLevelTotals[name][position.level] = 0;
      }

      candidateLevelTotals[name][position.level] += position.years;
    });
  });

  // Calculate statistics based on total time at each level per candidate
  Object.entries(candidateLevelTotals).forEach(([name, levels]) => {
    Object.entries(levels).forEach(([level, totalYears]) => {
      levelStats[level].durations.push(totalYears);

      if (totalYears < levelStats[level].min.value) {
        levelStats[level].min = { value: totalYears, name };
      }
      if (totalYears > levelStats[level].max.value) {
        levelStats[level].max = { value: totalYears, name };
      }
    });
  });

  // Calculate averages
  Object.keys(levelStats).forEach((level) => {
    const durations = levelStats[level].durations;
    levelStats[level].avg =
      durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  });

  return { levelStats, candidateLevelTotals };
};

// New function to calculate top 3 shortest average durations
const calculateTopThreeShortest = (data) => {
  const candidateAverages = Object.entries(data).map(([name, career]) => {
    const totalDuration = career.reduce(
      (sum, position) => sum + position.years,
      0
    );
    const avgDuration = totalDuration / career.length;
    return { name, avgDuration };
  });

  return candidateAverages
    .sort((a, b) => a.avgDuration - b.avgDuration)
    .slice(0, 3);
};

const ShortestDurationsColumn = ({ topThreeShortest }) => (
  <div
    className="border border-gray-100 rounded-md p-2 shadow-sm"
    style={{
      boxShadow: `0 4px 6px -1px ${colorMap["Executive"]}40, 
                  -4px 4px 6px -1px ${colorMap["Executive"]}30, 
                  2px -2px 4px -1px ${colorMap["Executive"]}20, 
                  4px 2px 4px -1px ${colorMap["Executive"]}20`,
    }}
  >
    <div className="flex items-start w-full px-3 py-1 mb-2">
      <ChevronsUp
        className="w-6 h-6 mt-1"
        style={{ color: colorMap["Executive"] }}
      />
      <div className="flex flex-col ml-2">
        <span className="text-base font-semibold text-black">
          Fast-moving candidates
        </span>
        <span className="text-xs text-gray-600">
          (avg. time spent at each seniority level)
        </span>
      </div>
    </div>
    <div className="mb-4 pl-4">
      <ul className="text-sm">
        {topThreeShortest.map((item, index) => (
          <li key={index}>
            •<span className="font-semibold">{item.name}</span> —{" "}
            {item.avgYearsPerLevel.toFixed(1)} years
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Color map from the CareerChartPage
const colorMap = {
  "Entry Level": "#f9e5c6",
  "Mid Level": "#FDCC8A",
  Senior: "#FC8D59",
  Manager: "#E34A33",
  "Senior Manager": "#B30000",
  Director: "#7A0177",
  Executive: "#49006A",
};

const calculateAverageTimePerLevel = (candidateLevelTotals) => {
  const averages = {};

  Object.entries(candidateLevelTotals).forEach(([name, levels]) => {
    const totalTime = Object.values(levels).reduce(
      (sum, time) => sum + time,
      0
    );
    const numberOfLevels = Object.keys(levels).length;
    averages[name] = totalTime / numberOfLevels;
  });

  return averages;
};

export default LevelBreakdown;
