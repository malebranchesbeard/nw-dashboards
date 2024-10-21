import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import hoqQuestions from "../data/hoq_questions.json";
import weights from "../data/weights.json";

// Sort weights by weight value in descending order and add rank
const sortedWeights = weights
  .sort((a, b) => b.weight - a.weight)
  .map((w, index) => ({ ...w, rank: index + 1 }));

// Find the maximum weight
const maxWeight = sortedWeights[0].weight;

const colorGradient = ["#49006A", "#7A0177", "#E34A33", "#f89b70", "#f7d09e"];

// Create a map of question to weight info
const weightMap = Object.fromEntries(
  sortedWeights.map((w) => {
    return [
      w.question.toString(),
      {
        weight: w.weight,
        rank: w.rank,
        percentage: Math.round((w.weight / maxWeight) * 100),
      },
    ];
  })
);

const getColorForRank = (rank, totalQuestions) => {
  const levelSize = Math.ceil(totalQuestions / 4);
  const level = Math.floor((rank - 1) / levelSize);
  const normalizedPosition = ((rank - 1) % levelSize) / levelSize;

  const startColor = colorGradient[level];
  const endColor = colorGradient[level + 1];

  return interpolateColor(startColor, endColor, normalizedPosition);
};

const interpolateColor = (color1, color2, factor) => {
  const r1 = parseInt(color1.substr(1, 2), 16);
  const g1 = parseInt(color1.substr(3, 2), 16);
  const b1 = parseInt(color1.substr(5, 2), 16);

  const r2 = parseInt(color2.substr(1, 2), 16);
  const g2 = parseInt(color2.substr(3, 2), 16);
  const b2 = parseInt(color2.substr(5, 2), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const categories = {
  1: "Education",
  2: "Experience",
  3: "Technical",
  4: "Leadership/Change Management",
};

const ReverseWeights = () => {
  // Group questions by category
  const groupedQuestions = hoqQuestions.reduce((acc, q) => {
    const category = q.questionCode.charAt(0);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(q);
    return acc;
  }, {});

  const totalQuestions = Object.values(groupedQuestions).flat().length;

  const chartData = sortedWeights.map((w) => ({
    questionCode: w.question.toString(),
    weight: w.weight,
    fill: getColorForRank(w.rank, totalQuestions), // Changed 'color' to 'fill'
  }));

  return (
    <Card className="w-full max-w-6xl border-none mx-auto space-x-4 ">
      <CardContent>
        <div className="flex">
          <div className="w-[70%] pr-4 rounded-lg">
            <div className="space-y-4 mt-4 shadow-md">
              {Object.entries(groupedQuestions).map(([category, questions]) => (
                <div
                  key={category}
                  className="border border-gray-100 p-3 mb-1 rounded-lg"
                >
                  <h2 className="text-md font-semibold mb-4">
                    <span className="text-gray-900">•</span>
                    {categories[category]}
                  </h2>
                  <div className="space-y-4">
                    {questions.map((q) => {
                      const weightInfo = weightMap[q.questionCode];

                      return (
                        <div
                          key={q.questionCode}
                          className="flex border border-gray-100 p-2 rounded-lg shadow-sm"
                        >
                          <div className="w-4/5 pr-4">
                            <div className="font-bold">{q.questionCode}</div>
                            <div>{q.property}</div>
                            <div className="text-sm text-gray-600">
                              {q.instructions}
                            </div>
                          </div>
                          <div className="w-1/5 flex items-center pl-2 border-l border-gray-100">
                            <div className="flex-1 text-center">
                              <div className="text-xs text-gray-500">
                                Weight
                              </div>
                              <div className="font-semibold mt-1">
                                {weightInfo?.percentage.toFixed(0) || "N/A"}%
                              </div>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="text-xs text-gray-500">Rank</div>
                              <div className="font-semibold mt-1">
                                {weightInfo?.rank || "N/A"}
                              </div>
                            </div>
                            <div className="flex-1 flex justify-center items-center">
                              <div
                                className="w-6 h-10 rounded opacity-80"
                                style={{
                                  backgroundColor: getColorForRank(
                                    weightInfo?.rank || totalQuestions,
                                    totalQuestions
                                  ),
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[30%] mt-4">
            <div className="rounded-lg border border-gray-100 shadow-md">
              <h2 className="text-base text-center font-semibold mb-4 pt-4">
                Weights Distribution
              </h2>
              <ResponsiveContainer
                width="100%"
                height={chartData.length * 25 + 50}
              >
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis type="number" />
                  <YAxis
                    dataKey="questionCode"
                    type="category"
                    width={80}
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <Tooltip />
                  <Bar dataKey="weight" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReverseWeights;
