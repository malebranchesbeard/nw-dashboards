import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Linkedin } from "lucide-react";
import candidateData from "../data/updated_SSOT_candidates.json";
import hoqQuestions from "../data/hoq_questions.json";
import pubidToNameData from "../data/pubid_to_name.json";

const getColorForScore = (score, maxScore) => {
  const ratio = score / maxScore;
  const colors = ["#f7d09e", "#f89b70", "#E34A33", "#7A0177", "#49006A"];
  const index = Math.min(Math.floor(ratio * 5), 4);
  return colors[index];
};

export async function getStaticProps() {
  const profilesDirectory = path.join(
    process.cwd(),
    "NW/dashboards/app/scorecards/data/profiles"
  );
  const filenames = fs.readdirSync(profilesDirectory);

  const candidateNames = {};
  filenames.forEach((filename) => {
    const filePath = path.join(profilesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const profile = JSON.parse(fileContents);
    if (profile.success && profile.person) {
      const { publicIdentifier, firstName, lastName } = profile.person;
      candidateNames[publicIdentifier] = `${firstName} ${lastName}`;
    }
  });

  return {
    props: {
      candidateNames,
    },
  };
}

const CandidateScores = () => {
  const [hoveredQuestion, setHoveredQuestion] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const questionDetailsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (questionDetailsRef.current) {
        const rect = questionDetailsRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const candidates = Object.entries(candidateData);
  const questionMaxScores = Object.fromEntries(
    hoqQuestions.map((q) => [q.questionCode, q.maxScore])
  );

  const pubidToName = useMemo(() => {
    return pubidToNameData.reduce((acc, candidate) => {
      acc[
        candidate.publicIdentifier
      ] = `${candidate.firstName} ${candidate.lastName}`;
      return acc;
    }, {});
  }, []);

  const chartData = useMemo(() => {
    return candidates
      .map(([publicIdentifier, data]) => ({
        name: pubidToName[publicIdentifier] || publicIdentifier,
        totalScore: Object.entries(data.scores)
          .filter(([key]) => key !== "cost")
          .reduce((sum, [_, score]) => sum + score, 0),
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [candidates, pubidToName]);

  const sortedCandidates = useMemo(() => {
    return candidates
      .map(([publicIdentifier, data]) => ({
        publicIdentifier,
        data,
        totalScore: Object.entries(data.scores)
          .filter(([key]) => key !== "cost")
          .reduce((sum, [_, score]) => sum + score, 0),
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [candidates]);

  return (
    <Card className="w-full max-w-6xl border-none mx-auto space-x-4">
      <CardContent>
        <div
          ref={questionDetailsRef}
          className={`mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-48 ${
            isSticky ? "sticky top-0 z-10" : ""
          }`}
        >
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Question Details
          </h2>
          {hoveredQuestion ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-24">
                  Question:
                </span>
                <span className="text-sm text-gray-700">
                  {hoveredQuestion.questionCode}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-24">
                  Property:
                </span>
                <span className="text-sm text-gray-700">
                  {hoveredQuestion.property}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-500 w-24 pt-1">
                  Rating Scale:
                </span>
                <span className="text-sm text-gray-600 mt-1 flex-1">
                  {hoveredQuestion.instructions}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Hover over a question to see details
            </p>
          )}
        </div>
        <div className="flex">
          <div className="w-[70%] pr-4 rounded-lg">
            <div className="space-y-4 mt-4 shadow-md">
              {sortedCandidates.map(
                ({ publicIdentifier, data, totalScore }) => (
                  <div
                    key={publicIdentifier}
                    className="border border-gray-100 p-3 mb-1 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-base font-semibold px-3 py-1 border border-gray-100 rounded-full shadow">
                          {pubidToName[publicIdentifier] || publicIdentifier}
                        </h2>
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          Score: {totalScore}
                        </div>
                      </div>
                      <a
                        href={
                          pubidToNameData.find(
                            (c) => c.publicIdentifier === publicIdentifier
                          )?.linkedInUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin className="w-5 h-5 mr-1" />
                        LinkedIn Profile
                      </a>
                    </div>
                    <div className="grid grid-cols-11 gap-2">
                      {Object.entries(data.scores)
                        .filter(([key]) => key !== "cost")
                        .map(([key, score]) => {
                          const maxScore = questionMaxScores[key];
                          const questionData = hoqQuestions.find(
                            (q) => q.questionCode === key
                          );
                          return (
                            <div
                              key={key}
                              className="text-center border rounded-lg p-2"
                              onMouseEnter={() =>
                                setHoveredQuestion(questionData)
                              }
                              onMouseLeave={() => setHoveredQuestion(null)}
                            >
                              <div className="text-base font-semibold">
                                {key}
                              </div>
                              <div className="flex justify-center space-x-1 mt-1">
                                {[...Array(maxScore)].map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${
                                      index < score
                                        ? "bg-[#3781b7]"
                                        : "border border-[#3781b7]"
                                    }`}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-[30%] mt-4">
            <div className="rounded-lg border border-gray-100 shadow-md">
              <h2 className="text-base text-center font-semibold mb-4 pt-4">
                Total Scores
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
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <Tooltip />
                  <Bar dataKey="totalScore" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateScores;
