import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy } from "lucide-react";
import outputData from "../data/output.json";

const TextBubble = ({ children }) => (
  <Card className="mb-4 flex-grow">
    <CardContent className="p-4 bg-[#4213580e] text-[#320d44] rounded-lg shadow-md">
      <p className="text-sm">{children}</p>
    </CardContent>
  </Card>
);

const LLMText = ({ selectedCandidate }) => {
  let candidateName = "";
  let currentCompany = "";

  // Update the candidate information when selectedCandidate changes
  if (selectedCandidate) {
    candidateName = selectedCandidate.person.firstName;
    currentCompany =
      selectedCandidate.person.positions.positionHistory[0].companyName.split(
        " "
      )[0];
  }
  console.log("Selected Candidate:", selectedCandidate);
  return (
    <div className="h-full flex flex-col">
      <TextBubble>
        <span className="font-semibold">
          This is the component without the LLM step, so filling in the name and
          company programatically. Just for testing and so you can see it for
          now. Will finish Monday.
        </span>
      </TextBubble>
      <TextBubble>
        <p className="mb-2">
          Dear <span className="font-semibold">{candidateName},</span>
        </p>

        <p className="mb-2">
          Hope you are well. I'm Danny Hiscott, Zurich-based Managing Partner of
          the Executive Search firm Transearch International www.transearch.com
        </p>

        <p className="mb-2">
          We are the sole firm mandated to recruit a Head of Global Quality and
          Process Improvement for a Swiss manufacturing company with 25
          production plants worldwide and revenues above 1B CHF, listed since
          1986. Our client manufactures high-precision components for critical
          applications in the automotive, aerospace, and life sciences
          industries.
        </p>

        <p className="mb-2">
          What makes the role stand out for me—beyond its considerable scope—is
          how it signals a fundamental shift in our client's thinking. Quality
          and process improvement are being elevated from a function to a
          cornerstone of the organisation. This is a newly created position
          reporting directly to the CEO/COO, with the autonomy to shape and
          drive the global quality strategy.
        </p>

        <p>
          I understand you're just two years into your role at{" "}
          <span className="font-semibold">{currentCompany}</span>, but if this
          step is one you might be interested in taking, I look forward to
          hearing back from you on LinkedIn or on +41xxx
        </p>
      </TextBubble>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          className="bg-[#1E2A5C] hover:bg-[#566CC8] text-white"
          variant="outline"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          className="bg-[#1E2A5C] hover:bg-[#566CC8] text-white"
          variant="outline"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default LLMText;
