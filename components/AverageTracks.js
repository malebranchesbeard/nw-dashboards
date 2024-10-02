// [AI, Claude: PRESERVE COMMENTS] Only remove comments if they directly contradict the code. Add to them instead.

import React from "react";

const AverageTracks = ({ data }) => {
  const careerStats = calculateCareerStats(data);
  const tenureStats = calculateTenureStats(data);
  const positionStats = calculatePositionStats(data);
  const companyStats = calculateCompanyStats(data);

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem
          label="Career Length"
          avg={`${careerStats.avg.toFixed(1)} years`}
          min={careerStats.min}
          max={careerStats.max}
        />
        <StatItem
          label="Job Tenure"
          avg={`${tenureStats.avg.toFixed(1)} years`}
          min={tenureStats.min}
          max={tenureStats.max}
        />
        <StatItem
          label="No. of Positions"
          avg={positionStats.avg.toFixed(1)}
          min={positionStats.min}
          max={positionStats.max}
        />
        <StatItem
          label="No. of Companies"
          avg={companyStats.avg.toFixed(1)}
          min={companyStats.min}
          max={companyStats.max}
        />
      </div>
    </div>
  );
};

const StatItem = ({ label, avg, min, max }) => (
  <div>
    <p
      className="block w-full px-3 py-1 text-base font-semibold text-white rounded mb-2"
      style={{ backgroundColor: "rgba(73, 0, 106, 0.7)" }}
    >
      {label}
    </p>
    <div className="grid grid-cols-3 gap-x-2 gap-y-1">
      <span className="text-sm font-semibold text-black">Pool Mean:</span>
      <span className="text-sm font-semibold text-black">Min:</span>
      <span className="text-sm font-semibold text-black">Max:</span>
      <span className="text-sm text-black pl-0.5">{avg}</span>
      {min && (
        <span className="text-sm text-black pl-0.5">
          {label.includes("No. of") ? min.value : min.value.toFixed(1)}
          {!label.includes("No. of") && " years"}
        </span>
      )}
      {max && (
        <span className="text-sm text-black pl-0.5">
          {label.includes("No. of") ? max.value : max.value.toFixed(1)}
          {!label.includes("No. of") && " years"}
        </span>
      )}
      <span></span> {/* Empty span for Mean column */}
      {min && min.details && (
        <span className="text-xs text-gray-600 pl-0.5">
          {label === "Job Tenure"
            ? `${min.details.name} — ${min.details.role} at ${min.details.company}`
            : min.details.name}
        </span>
      )}
      {max && max.details && (
        <span className="text-xs text-gray-600 pl-0.5">
          {label === "Job Tenure"
            ? `${max.details.name} — ${max.details.role} at ${max.details.company}`
            : max.details.name}
        </span>
      )}
    </div>
  </div>
);

// Helper functions to calculate statistics
const calculateCareerStats = (data) => {
  let allCareerLengths = [];
  let minCareer = { value: Number.MAX_VALUE, name: "" };
  let maxCareer = { value: 0, name: "" };

  Object.entries(data).forEach(([name, career]) => {
    const careerLength = career.reduce(
      (total, position) => total + position.years,
      0
    );
    allCareerLengths.push(careerLength);

    if (careerLength < minCareer.value) {
      minCareer = { value: careerLength, name };
    }
    if (careerLength > maxCareer.value) {
      maxCareer = { value: careerLength, name };
    }
  });

  const avg =
    allCareerLengths.reduce((sum, length) => sum + length, 0) /
    allCareerLengths.length;

  return {
    avg,
    min: {
      value: minCareer.value,
      details: { name: minCareer.name },
    },
    max: {
      value: maxCareer.value,
      details: { name: maxCareer.name },
    },
  };
};

const calculateTenureStats = (data) => {
  let allTenures = [];
  let minTenure = {
    value: Number.MAX_VALUE,
    candidate: "",
    role: "",
    company: "",
  };
  let maxTenure = { value: 0, candidate: "", role: "", company: "" };

  Object.entries(data).forEach(([candidate, career]) => {
    career.forEach((position) => {
      allTenures.push(position.years);

      if (position.years < minTenure.value) {
        minTenure = {
          value: position.years,
          candidate,
          role: position.role,
          company: position.company,
        };
      }
      if (position.years > maxTenure.value) {
        maxTenure = {
          value: position.years,
          candidate,
          role: position.role,
          company: position.company,
        };
      }
    });
  });

  const avg =
    allTenures.reduce((sum, tenure) => sum + tenure, 0) / allTenures.length;

  return {
    avg,
    min: {
      value: minTenure.value,
      details: {
        name: minTenure.candidate,
        role: minTenure.role,
        company: minTenure.company,
      },
    },
    max: {
      value: maxTenure.value,
      details: {
        name: maxTenure.candidate,
        role: maxTenure.role,
        company: maxTenure.company,
      },
    },
  };
};

const calculatePositionStats = (data) => {
  let allPositionCounts = [];
  let minPositions = { value: Number.MAX_VALUE, name: "" };
  let maxPositions = { value: 0, name: "" };

  Object.entries(data).forEach(([name, career]) => {
    const positionCount = career.length;
    allPositionCounts.push(positionCount);

    if (positionCount < minPositions.value) {
      minPositions = { value: positionCount, name };
    }
    if (positionCount > maxPositions.value) {
      maxPositions = { value: positionCount, name };
    }
  });

  const avg =
    allPositionCounts.reduce((sum, count) => sum + count, 0) /
    allPositionCounts.length;

  return {
    avg,
    min: {
      value: minPositions.value,
      details: { name: minPositions.name },
    },
    max: {
      value: maxPositions.value,
      details: { name: maxPositions.name },
    },
  };
};

const calculateCompanyStats = (data) => {
  let allCompanyCounts = [];
  let minCompanies = { value: Number.MAX_VALUE, name: "" };
  let maxCompanies = { value: 0, name: "" };

  Object.entries(data).forEach(([name, career]) => {
    const uniqueCompanies = new Set(career.map((position) => position.company));
    const companyCount = uniqueCompanies.size;
    allCompanyCounts.push(companyCount);

    if (companyCount < minCompanies.value) {
      minCompanies = { value: companyCount, name };
    }
    if (companyCount > maxCompanies.value) {
      maxCompanies = { value: companyCount, name };
    }
  });

  const avg =
    allCompanyCounts.reduce((sum, count) => sum + count, 0) /
    allCompanyCounts.length;

  return {
    avg,
    min: {
      value: minCompanies.value,
      details: { name: minCompanies.name },
    },
    max: {
      value: maxCompanies.value,
      details: { name: maxCompanies.name },
    },
  };
};

export default AverageTracks;
