"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import outputData from "../data/output.json";
import tailoredSentences from "../data/tailored_sentences.json";
import tailoredSentences2 from "../data/tailored_sentences2.json";
import tailoredSentences3 from "../data/tailored_sentences3.json";
import { useToast } from "@/components/ui/use-toast";

const TextBubble = ({ children }) => (
  <Card className="mb-16 flex-grow shadow-none border-none">
    <CardContent className="border border-gray-100 shadow-md p-4 bg-[#4213580e] text-[#320d44] rounded-lg">
      <div className="text-sm">{children}</div>
    </CardContent>
  </Card>
);

const LLMText = ({ selectedCandidate, onCopied }) => {
  const { toast } = useToast();
  const [version, setVersion] = useState(3);
  let candidateName = "";
  let tailored_sentence = "";

  const getNumberOfVersions = (identifier) => {
    if (!identifier) return 1;
    const v1 = tailoredSentences[identifier]?.tailored_sentence;
    const v2 = tailoredSentences2[identifier]?.tailored_sentence;
    const v3 = tailoredSentences3[identifier]?.tailored_sentence;

    const uniqueVersions = new Set([v1, v2, v3].filter(Boolean));
    return uniqueVersions.size;
  };

  useEffect(() => {
    if (selectedCandidate?.person?.publicIdentifier) {
      const identifier =
        selectedCandidate.person.publicIdentifier.toLowerCase();
      const versions = getNumberOfVersions(identifier);
      setVersion(versions);
    }
  }, [selectedCandidate]);

  if (selectedCandidate && selectedCandidate.person) {
    candidateName = selectedCandidate.person.firstName || "";
    const identifier = selectedCandidate.person.publicIdentifier?.toLowerCase();

    if (identifier) {
      const sentences =
        version === 1
          ? tailoredSentences
          : version === 2
          ? tailoredSentences2
          : tailoredSentences3;
      tailored_sentence = sentences[identifier]?.tailored_sentence || "";
    }
  }

  console.log(
    "Selected Candidate:",
    selectedCandidate,
    "tailored_sentence:",
    tailored_sentence
  );

  const handleCopy = React.useCallback(async () => {
    const textContent = `Dear ${candidateName},

Hope you are well. I'm Danny Hiscott, Zurich-based Managing Partner of the Executive Search firm Transearch International www.transearch.com

We are exclusively mandated to recruit a Head of Global Quality and Process Improvement for a stock exchange listed Swiss manufacturing company with >20 production plants globally and revenues of >1bn CHF. Our client manufactures high-precision components for a range of industrial applications.

What makes the role stand out for me—beyond its considerable scope—is how it signals a fundamental shift in our client's thinking. Quality and process improvement are being elevated from an important function to a strategic cornerstone of the organisation. This is a newly created position reporting directly to the CEO/COO, with the autonomy to shape and drive the global quality strategy.

${tailored_sentence} the scope and timing of this new opportunity could be relevant, I would be pleased to hear back from you on LinkedIn, by email: danny.hiscott@transearch.com or on +41 44 533 06 10.

Best regards,
Danny Hiscott`;

    try {
      await navigator.clipboard.writeText(textContent);

      if (selectedCandidate?.person?.publicIdentifier) {
        await fetch("/api/copied", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicIdentifier: selectedCandidate.person.publicIdentifier,
            isCopied: true,
          }),
        });

        onCopied?.(selectedCandidate.person.publicIdentifier);
      }

      toast({
        description: "✓ Copied to clipboard",
        duration: 1500,
        className: "bg-green-50 text-green-800 border-green-200",
      });
    } catch (err) {
      toast({
        description: "Failed to copy text",
        variant: "destructive",
        duration: 1500,
      });
    }
  }, [candidateName, tailored_sentence, toast, selectedCandidate, onCopied]);

  return (
    <div className="h-full flex flex-col relative min-h-[600px] border border-gray-100 p-1 rounded-lg">
      {selectedCandidate && selectedCandidate.person && (
        <div className="flex items-center justify-end mb-2">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              disabled={version === 1}
              onClick={() => setVersion((prev) => prev - 1)}
              className={`h-5 w-5 p-0 rounded-full grid place-items-center ${
                version === 1
                  ? "text-white bg-[#425397ac]"
                  : "hover:bg-[#566CC8] bg-[#1E2A5C] text-white"
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-sm text-gray-600">
              <span>Version</span>{" "}
              <span className="font-semibold">{version}</span> <span>of</span>{" "}
              <span className="font-semibold">
                {getNumberOfVersions(
                  selectedCandidate.person.publicIdentifier?.toLowerCase()
                )}
              </span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={
                version ===
                getNumberOfVersions(
                  selectedCandidate.person.publicIdentifier?.toLowerCase()
                )
              }
              onClick={() => setVersion((prev) => prev + 1)}
              className={`h-5 w-5 p-0 rounded-full grid place-items-center ${
                version ===
                getNumberOfVersions(
                  selectedCandidate.person.publicIdentifier?.toLowerCase()
                )
                  ? "text-white bg-[#425397ac]"
                  : "hover:bg-[#566CC8] bg-[#1E2A5C] text-white"
              }`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
      <TextBubble>
        <div className="mb-2">Dear {candidateName || ""},</div>

        <div className="mb-2">
          I hope you are well. I&apos;m Danny Hiscott, Zurich-based Managing
          Partner of the Executive Search firm Transearch International
          www.transearch.com
        </div>

        <div className="mb-2">
          We are exclusively mandated to recruit a Head of Global Quality and
          Process Improvement for a stock exchange listed Swiss manufacturing
          company with {">"}20 production plants globally and revenues of {">"}
          1bn CHF. Our client manufactures high-precision components for a range
          of industrial applications.
        </div>

        <div className="mb-2">
          What makes the role stand out for me — beyond its considerable scope —
          is how it signals a fundamental shift in our client&apos;s thinking.
          Quality and process improvement are being elevated from an important
          function to a strategic cornerstone of the organisation. This is a
          newly created position reporting directly to the CEO/COO, with the
          autonomy to shape and drive the global quality strategy.
        </div>

        <div className="mb-2">
          {tailored_sentence} the scope and timing of this new opportunity could
          be relevant, I would be pleased to hear back from you on LinkedIn, by
          email: danny.hiscott@transearch.com or on +41 44 533 06 10.
        </div>

        <div className="mb-2">
          Best regards,
          <br />
          <br />
          Danny Hiscott
        </div>
      </TextBubble>
      <div className="absolute bottom-0 right-0 w-full flex justify-end space-x-1 pr-1 pb-1">
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
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default LLMText;
