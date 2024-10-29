"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy } from "lucide-react";
import outputData from "../data/output.json";
import tailoredSentences from "../data/tailored_sentences.json";
import { useToast } from "@/components/ui/use-toast";

const TextBubble = ({ children }) => (
  <Card className="mb-4 flex-grow">
    <CardContent className="p-4 bg-[#4213580e] text-[#320d44] rounded-lg shadow-md">
      <div className="text-sm">{children}</div>
    </CardContent>
  </Card>
);

const LLMText = ({ selectedCandidate, onCopied }) => {
  const { toast } = useToast();
  let candidateName = "";
  let tailored_sentence = "";

  // Update the candidate information when selectedCandidate changes
  if (selectedCandidate && selectedCandidate.person) {
    candidateName = selectedCandidate.person.firstName || "";
    const identifier = selectedCandidate.person.publicIdentifier?.toLowerCase();

    // Add more detailed debug logging
    console.log("Selected Candidate:", {
      identifier,
      firstName: selectedCandidate.person.firstName,
      availableIdentifiers: Object.keys(tailoredSentences),
      matchFound: identifier ? tailoredSentences[identifier] : "no identifier",
    });

    // Check if the identifier exists in tailoredSentences
    if (identifier && tailoredSentences[identifier]) {
      tailored_sentence = tailoredSentences[identifier].tailored_sentence || "";
    } else {
      console.warn(
        `No matching tailored sentence found for identifier: ${identifier}`
      );
    }
  }

  console.log(
    "Selected Candidate:",
    selectedCandidate,
    "tailored_sentence:",
    tailored_sentence
  );

  // Move handleCopy inside useCallback to prevent hydration issues
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

      // Add API call to mark candidate as copied
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

        // Call the onCopied callback
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
    <div className="h-full flex flex-col relative min-h-[600px]">
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
      <div className="absolute bottom-0 right-0 w-full flex justify-end space-x-2 p-4 bg-white">
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
