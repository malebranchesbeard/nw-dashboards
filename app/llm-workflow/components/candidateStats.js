import React, { useMemo } from "react";
import { ChevronsUp } from "lucide-react";
import candidatePositions from "../../data/candidates/positions/all_senior.json";
import levelFramework from "../../data/quality_track.json";

const colorMap = {
  "Entry Level": "#f9e5c6",
  "Mid Level": "#FDCC8A",
  Senior: "#FC8D59",
  Manager: "#E34A33",
  "Senior Manager": "#B30000",
  Director: "#7A0177",
  Executive: "#49006A",
};

const CandidateStats = () => {
  const { careerStats, levelStats, topThreeShortest } = useMemo(
    () => calculateStats(candidatePositions),
    []
  );

  return (
    <div className="mt-6 space-y-4">
      <AverageTracksSection careerStats={careerStats} />
      <LevelBreakdownSection
        levelStats={levelStats}
        topThreeShortest={topThreeShortest}
      />
    </div>
  );
};

const AverageTracksSection = ({ careerStats }) => (
  <div className="p-2 bg-white rounded-lg shadow">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem
        label="Career Length"
        avg={`${careerStats.careerLength.avg.toFixed(1)} years`}
        min={careerStats.careerLength.min}
        max={careerStats.careerLength.max}
      />
      <StatItem
        label="Job Tenure"
        avg={`${careerStats.jobTenure.avg.toFixed(1)} years`}
        min={careerStats.jobTenure.min}
        max={careerStats.jobTenure.max}
      />
      <StatItem
        label="No. of Positions"
        avg={careerStats.positionCount.avg.toFixed(1)}
        min={careerStats.positionCount.min}
        max={careerStats.positionCount.max}
      />
      <StatItem
        label="No. of Companies"
        avg={careerStats.companyCount.avg.toFixed(1)}
        min={careerStats.companyCount.min}
        max={careerStats.companyCount.max}
      />
    </div>
  </div>
);

const StatItem = ({ label, avg, min, max }) => (
  <div className="mb-1">
    <div
      className="block w-full border border-gray-200 px-3 py-1 text-sm font-semibold text-white rounded mb-2"
      style={{ backgroundColor: "#2b0663a3" }} // Adjusted opacity for background
    >
      {label}
    </div>
    <div className="grid grid-cols-3 gap-x-2 gap-y-1 px-2">
      <span className="text-sm font-semibold text-black">Pool Mean:</span>
      <span className="text-sm font-semibold text-black  px-1">Min:</span>
      <span className="text-sm font-semibold text-black">Max:</span>
      <span className="text-sm text-black pl-1">{avg}</span>
      {min && (
        <span className="text-sm text-black pl-1 ">
          {label.includes("No. of") ? min.value : min.value.toFixed(1)}
          {!label.includes("No. of") && " years"}
        </span>
      )}
      {max && (
        <span className="text-sm text-black pl-1">
          {label.includes("No. of") ? max.value : max.value.toFixed(1)}
          {!label.includes("No. of") && " years"}
        </span>
      )}
      <span></span>
      {min && min.details && (
        <span className="text-xs text-gray-600 pl-1 ">
          {candidatePositions[min.details.name]?.firstName}{" "}
          {candidatePositions[min.details.name]?.lastName}
        </span>
      )}
      {max && max.details && (
        <span className="text-xs text-gray-600 pl-1">
          {candidatePositions[max.details.name]?.firstName}{" "}
          {candidatePositions[max.details.name]?.lastName}
        </span>
      )}
    </div>
  </div>
);

const LevelBreakdownSection = ({ levelStats, topThreeShortest }) => {
  const categories = Object.keys(levelFramework);

  return (
    <div className="p-2 mt-1 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ShortestDurationsColumn topThreeShortest={topThreeShortest} />
        {categories.map((category, index) => (
          <CategoryColumn
            key={category}
            category={category}
            levelStats={levelStats[`Category ${index + 1}`]}
            color={getCategoryColor(index + 1)}
          />
        ))}
      </div>
    </div>
  );
};

const CategoryColumn = ({ category, levelStats, color }) => {
  if (!levelStats) return null;

  return (
    <div className="mb-1">
      <div className="w-full px-0.5 py-1 text-sm font-semibold rounded-full mb-2 overflow-hidden flex items-center border border-gray-100 shadow-sm">
        <div
          className="flex-shrink-0 w-4 h-4 mr-2 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <div className="text-black">
          {category.split(":")[1].trim().replace("Quality ", "")}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-black">Pool Mean:</span>
        <span className="text-sm font-semibold text-black">Min:</span>
        <span className="text-sm font-semibold text-black">Max:</span>
        <span className="text-sm text-black pl-0.5">
          {levelStats.avg.toFixed(1)}y
        </span>
        <span className="text-sm text-black pl-0.5">
          {levelStats.min.value.toFixed(1)}y
        </span>
        <span className="text-sm text-black pl-0.5">
          {levelStats.max.value.toFixed(1)}y
        </span>
        <span></span>
        {levelStats.min.details && (
          <span className="text-xs text-gray-600 pl-0.5">
            {candidatePositions[levelStats.min.details.name]?.firstName}{" "}
            {candidatePositions[levelStats.min.details.name]?.lastName}
          </span>
        )}
        {levelStats.max.details && (
          <span className="text-xs text-gray-600 pl-0.5">
            {candidatePositions[levelStats.max.details.name]?.firstName}{" "}
            {candidatePositions[levelStats.max.details.name]?.lastName}
          </span>
        )}
      </div>
    </div>
  );
};

// Helper function to get color for category
const getCategoryColor = (categoryNumber) => {
  const colorScheme = {
    1: "#FC8D59",
    2: "#E34A33",
    3: "#B30000",
    4: "#7A0177",
  };
  return colorScheme[categoryNumber] || "#000000";
};

const ShortestDurationsColumn = ({ topThreeShortest }) => (
  <div className="border border-gray-200 rounded-md p-2 shadow-lg shadow-[#2b0663a3]">
    <div className="flex items-start w-full px-3 py-1 mb-2">
      <ChevronsUp
        className="w-10 h-10 mt-1"
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
      <ul className="text-sm py-0">
        {topThreeShortest.map((item, index) => (
          <li className="py-1" key={index}>
            •
            <span className="font-semibold">
              {candidatePositions[item.name]?.firstName}{" "}
              {candidatePositions[item.name]?.lastName}
            </span>{" "}
            — {item.avgYearsPerLevel.toFixed(1)} years
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const calculateStats = (data) => {
  const careerStats = {
    careerLength: {
      min: { value: Infinity },
      max: { value: -Infinity },
      sum: 0,
    },
    jobTenure: {
      min: { value: Infinity },
      max: { value: -Infinity },
      sum: 0,
      count: 0,
    },
    positionCount: {
      min: { value: Infinity },
      max: { value: -Infinity },
      sum: 0,
    },
    companyCount: {
      min: { value: Infinity },
      max: { value: -Infinity },
      sum: 0,
    },
  };

  const levelStats = {
    "Category 1": {
      durations: [],
      min: { value: Infinity },
      max: { value: -Infinity },
    },
    "Category 2": {
      durations: [],
      min: { value: Infinity },
      max: { value: -Infinity },
    },
    "Category 3": {
      durations: [],
      min: { value: Infinity },
      max: { value: -Infinity },
    },
    "Category 4": {
      durations: [],
      min: { value: Infinity },
      max: { value: -Infinity },
    },
  };

  const candidateLevelTotals = {};

  Object.entries(data).forEach(([candidateId, candidate]) => {
    const positions = candidate.positionHistory;
    const careerLength = calculateCareerLength(positions);
    const uniqueCompanies = new Set(positions.map((p) => p.companyName)).size;

    updateStat(careerStats.careerLength, careerLength, candidateId);
    updateStat(careerStats.positionCount, positions.length, candidateId);
    updateStat(careerStats.companyCount, uniqueCompanies, candidateId);

    candidateLevelTotals[candidateId] = {};

    positions.forEach((position) => {
      const tenure = calculateTenure(position);
      updateStat(
        careerStats.jobTenure,
        tenure,
        candidateId,
        position.title,
        position.companyName
      );

      const mappedLevel = mapSeniorityToQualityTrackLevel(
        position.seniorityLevel
      );
      const category = `Category ${mappedLevel.split(":")[0].charAt(0)}`;

      if (!candidateLevelTotals[candidateId][category]) {
        candidateLevelTotals[candidateId][category] = 0;
      }

      candidateLevelTotals[candidateId][category] += tenure;
    });
  });

  // Calculate averages for career stats
  Object.keys(careerStats).forEach((key) => {
    careerStats[key].avg = careerStats[key].sum / Object.keys(data).length;
  });

  // Calculate level stats
  Object.entries(candidateLevelTotals).forEach(([candidateId, categories]) => {
    Object.entries(categories).forEach(([category, totalYears]) => {
      levelStats[category].durations.push(totalYears);
      updateStat(levelStats[category], totalYears, candidateId);
    });
  });

  // Calculate averages for level stats
  Object.keys(levelStats).forEach((category) => {
    const durations = levelStats[category].durations;
    levelStats[category].avg =
      durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  });

  const topThreeShortest = calculateTopThreeShortest(candidateLevelTotals);

  return { careerStats, levelStats, topThreeShortest };
};

const updateStat = (stat, value, candidateId, ...additionalDetails) => {
  stat.sum = (stat.sum || 0) + value;
  stat.count = (stat.count || 0) + 1;

  if (value < stat.min.value) {
    stat.min = {
      value,
      details: {
        name: candidateId,
        ...Object.fromEntries(
          additionalDetails.map((d, i) => [`detail${i + 1}`, d])
        ),
      },
    };
  }
  if (value > stat.max.value) {
    stat.max = {
      value,
      details: {
        name: candidateId,
        ...Object.fromEntries(
          additionalDetails.map((d, i) => [`detail${i + 1}`, d])
        ),
      },
    };
  }
};

const calculateCareerLength = (positions) => {
  const startDate = new Date(
    Math.min(
      ...positions.map(
        (p) =>
          new Date(p.startEndDate.start.year, p.startEndDate.start.month - 1)
      )
    )
  );
  const endDate = new Date(
    Math.max(
      ...positions.map((p) =>
        p.startEndDate.end
          ? new Date(p.startEndDate.end.year, p.startEndDate.end.month - 1)
          : new Date()
      )
    )
  );
  return (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
};

const calculateTenure = (position) => {
  const startDate = new Date(
    position.startEndDate.start.year,
    position.startEndDate.start.month - 1
  );
  const endDate = position.startEndDate.end
    ? new Date(
        position.startEndDate.end.year,
        position.startEndDate.end.month - 1
      )
    : new Date();
  return (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
};

const calculateTopThreeShortest = (candidateLevelTotals) => {
  return Object.entries(candidateLevelTotals)
    .map(([name, levels]) => {
      const totalTime = Object.values(levels).reduce(
        (sum, time) => sum + time,
        0
      );
      const numberOfLevels = Object.keys(levels).length;
      return { name, avgYearsPerLevel: totalTime / numberOfLevels };
    })
    .sort((a, b) => a.avgYearsPerLevel - b.avgYearsPerLevel)
    .slice(0, 3);
};

// Helper function to map seniority levels to quality_track categories
const mapSeniorityToQualityTrackLevel = (seniorityLevel) => {
  const mapping = {
    "Entry Level": "1: Professional Quality Roles",
    "Mid Level": "1: Professional Quality Roles",
    Senior: "1: Professional Quality Roles",
    Manager: "2: Supervisory Quality Roles",
    "Senior Manager": "3: Managerial Quality Roles",
    Director: "3: Managerial Quality Roles",
    Executive: "4: Executive Quality Roles",
  };
  return mapping[seniorityLevel] || seniorityLevel;
};

export default CandidateStats;
