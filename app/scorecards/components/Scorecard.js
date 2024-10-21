import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  {
    title: "1. Education and Qualifications",
    subcategories: [
      {
        name: "1.1 Master's degree in a relevant field (e.g., Engineering, Chemistry), or comparable",
      },
    ],
  },
  {
    title: "2. Experience",
    subcategories: [
      {
        name: "2.1 Minimum 15 years of experience in quality management and process improvement",
      },
      { name: "2.2 Experience in closely related industry" },
      {
        name: "2.3 10+ years of leadership experience in an international organization",
      },
      {
        name: "2.4 10+ years of change management experience in an international organization",
      },
    ],
  },
  {
    title: "3. Technical Knowledge and Skills",
    subcategories: [
      {
        name: "3.1 Knowledge of global regulatory requirements and quality standards",
      },
      { name: "3.2 Experience with Quality Management Systems (QMS)" },
      { name: "3.3 Process improvement and lean methodologies expertise" },
      { name: "3.4 Quality by Design (QbD) principles knowledge" },
      { name: "3.5 Risk management experience" },
      { name: "3.6 Supplier quality management experience" },
      { name: "3.7 Audit management experience" },
      { name: "3.8 Experience with zero defect philosophy" },
      { name: "3.9 Knowledge of IATF 16949 standard" },
      { name: "3.10 Experience in lower tier manufacturer" },
    ],
  },
  {
    title: "4. Leadership and Strategic Thinking",
    subcategories: [
      {
        name: "4.1 Evidence of developing and implementing quality and process improvement strategies",
      },
      {
        name: "4.2 Track record of leading and developing high-performing teams",
      },
      { name: "4.3 Demonstrated ability to work in cross-functional teams" },
      { name: "4.4 Evidence of customer-centric approach to quality" },
      { name: "4.5 Corporate or group level experience" },
    ],
  },
];

const weightMultipliers = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const weightColors = {
  Low: "#E3F2FD",
  Medium: "#9C27B0",
  High: "#F44336",
};

const Scorecard = () => {
  const [candidateName, setCandidateName] = useState("");
  const [scores, setScores] = useState({});
  const [weights, setWeights] = useState({});
  const [jsonOutput, setJsonOutput] = useState("");
  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    const initialWeights = {};
    let totalSubcategories = 0;
    categories.forEach((category) => {
      category.subcategories.forEach((subcat) => {
        initialWeights[subcat.name] = "Medium";
        totalSubcategories++;
      });
    });
    setWeights(initialWeights);
    setMaxScore(totalSubcategories * 5); // Each subcategory can have a max score of 5
  }, []);

  const handleScoreChange = (category, value) => {
    setScores((prev) => ({ ...prev, [category]: parseInt(value) || 0 }));
  };

  const handleWeightChange = (category, value) => {
    setWeights((prev) => ({ ...prev, [category]: value }));
  };

  const generateJSON = () => {
    const scoresArray = categories.flatMap((category) =>
      category.subcategories.map((subcat) => {
        const rawScore = scores[subcat.name] || 0;
        const weight = weights[subcat.name] || "Medium";
        const weightMultiplier = weightMultipliers[weight];
        const weightedScore = rawScore * weightMultiplier;

        return {
          category: category.title,
          subcategory: subcat.name,
          score: rawScore,
          weight: weight,
          weightedScore: weightedScore,
        };
      })
    );

    const totalWeightedScore = scoresArray.reduce(
      (sum, item) => sum + item.weightedScore,
      0
    );
    const maxWeightedScore = Object.values(weights).reduce(
      (sum, weight) => sum + weightMultipliers[weight] * 5,
      0
    );
    const normalizedScore = (
      (totalWeightedScore / maxWeightedScore) *
      100
    ).toFixed(2);

    const output = {
      candidateName,
      scores: scoresArray,
      totalWeightedScore,
      normalizedScore,
      maxWeightedScore,
    };
    setJsonOutput(JSON.stringify(output, null, 2));
  };

  const resetForm = () => {
    setCandidateName("");
    setScores({});
    setJsonOutput("");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Head of Global Quality Scorecard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="candidateName">Candidate Name</Label>
            <Input
              id="candidateName"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
            />
          </div>
          {categories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-bold text-lg">{category.title}</h3>
              {category.subcategories.map((subcat) => (
                <div
                  key={subcat.name}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-8">
                    <Label htmlFor={subcat.name}>{subcat.name}</Label>
                  </div>
                  <div className="col-span-2">
                    <Input
                      id={subcat.name}
                      type="number"
                      min="1"
                      max="5"
                      value={scores[subcat.name] || ""}
                      onChange={(e) =>
                        handleScoreChange(subcat.name, e.target.value)
                      }
                      placeholder="1-5"
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          weightColors[weights[subcat.name] || "Medium"],
                      }}
                    ></div>
                    <Select
                      value={weights[subcat.name] || "Medium"}
                      onValueChange={(value) =>
                        handleWeightChange(subcat.name, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="flex space-x-4">
            <Button onClick={generateJSON}>Generate JSON</Button>
            <Button onClick={resetForm} variant="outline">
              Reset Form
            </Button>
          </div>
          {jsonOutput && (
            <div>
              <Label>JSON Output</Label>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                {jsonOutput}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Scorecard;
