"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import tailoredSentences from "../data/tailored_sentences.json";
import tailoredSentences2 from "../data/tailored_sentences2.json";
import tailoredSentences3 from "../data/tailored_sentences3.json";
import tailoredSentences4 from "../data/tailored_sentences4.json";
import tailoredSentences5 from "../data/tailored_sentences5.json";
import tailoredSentences6 from "../data/tailored_sentences6.json";
import { useToast } from "@/components/ui/use-toast";
import ReactDOMServer from "react-dom/server";

const TextBubble = ({ children }) => (
  <Card className="mb-16 flex-grow shadow-none border-none pt-0 mt-0">
    <CardContent className="border border-gray-100 shadow-md p-4 bg-[#4213580e] text-[#320d44] rounded-lg">
      <div className="text-sm">{children}</div>
    </CardContent>
  </Card>
);

const TextContent = ({ candidateName, tailored_sentence }) => (
  <>
    <div className="mb-2">
      Dear <span className="bg-indigo-200">{candidateName || ""}</span>
      {"\n\n"}
    </div>

    <div className="mb-2">
      I hope you are well. I&apos;m Danny Hiscott, Zurich-based Managing Partner
      of the Executive Search firm Transearch International {"("}
      www.transearch.com{")"}
      {"\n\n"}
    </div>

    <div className="mb-2">
      We are exclusively mandated to recruit a Head of Global Quality and
      Process Improvement for a stock exchange listed Swiss manufacturing
      company with {">"}20 production plants globally and revenues of {">"}1bn
      CHF. Our client manufactures high-precision components for a range of
      industrial applications.{"\n\n"}
    </div>

    <div className="mb-2">
      What makes the role stand out for me - beyond its considerable scope - is
      how it signals a fundamental shift in our client&apos;s thinking. Quality
      and process improvement are being elevated from an important function to a
      strategic cornerstone of the organisation. This is a newly created
      position reporting directly to the COO, with the autonomy to shape and
      drive the global quality strategy.{"\n\n"}
    </div>

    <div className="mb-2">
      <span className="bg-indigo-200">{tailored_sentence}</span> the scope and
      timing of this new opportunity could be relevant, I would be pleased to
      hear back from you on LinkedIn, by email: danny.hiscott@transearch.com or
      on +41 44 533 06 10.{"\n\n"}
    </div>

    <div className="mb-2">Best regards,{"\n\n"}</div>
    <div>Danny Hiscott</div>
  </>
);

const LLMText = ({ selectedCandidate, onCopied }) => {
  const { toast } = useToast();
  const [version, setVersion] = useState(6);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [sentenceVariationIndex, setSentenceVariationIndex] = useState(0);
  let candidateName = "";
  let tailored_sentence = "";

  useEffect(() => {
    if (selectedCandidate?.person?.publicIdentifier) {
      const identifier =
        selectedCandidate.person.publicIdentifier.toLowerCase();
      if (version >= 4) {
        const data =
          version === 6
            ? tailoredSentences6[identifier]
            : version === 5
            ? tailoredSentences5[identifier]
            : tailoredSentences4[identifier];

        if (data?.current_company) {
          setSelectedCompanyName(data.current_company);
        }
      }
    }
  }, [selectedCandidate, version]);

  useEffect(() => {
    setSentenceVariationIndex(0);
  }, [selectedCandidate?.person?.publicIdentifier]);

  if (selectedCandidate && selectedCandidate.person) {
    candidateName = selectedCandidate.person.firstName || "";
    const identifier = selectedCandidate.person.publicIdentifier?.toLowerCase();

    if (identifier) {
      if (version >= 4) {
        const data =
          version === 6
            ? tailoredSentences6[identifier]
            : version === 5
            ? tailoredSentences5[identifier]
            : tailoredSentences4[identifier];

        const companyName = selectedCompanyName || data?.current_company;

        let selectedSentence = data?.tailored_sentence;
        if (version === 6 && data?.tailored_sentence_variations) {
          selectedSentence =
            sentenceVariationIndex === 0
              ? data.tailored_sentence
              : data.tailored_sentence_variations[sentenceVariationIndex - 1];
        }

        tailored_sentence =
          selectedSentence?.replace(data?.current_company, companyName) || "";
      } else {
        const sentences =
          version === 1
            ? tailoredSentences
            : version === 2
            ? tailoredSentences2
            : tailoredSentences3;
        tailored_sentence = sentences[identifier]?.tailored_sentence || "";
      }
    }
  }

  const renderCompanyOptions = () => {
    if (!selectedCandidate?.person?.publicIdentifier) return null;

    // Show company options for versions 4, 5, and 6
    if (version < 4) return null;

    const identifier = selectedCandidate.person.publicIdentifier.toLowerCase();
    const companyNames =
      tailoredSentences4[identifier]?.possible_company_names || [];
    const defaultCompany = tailoredSentences4[identifier]?.current_company;

    // Sort by length and take first 4
    const shortestNames = [...companyNames]
      .sort((a, b) => a.length - b.length)
      .slice(0, 4);

    return (
      <div className="flex flex-nowrap gap-0.5 mb-1 overflow-x-auto relative border border-gray-100 rounded-lg bg-[#42135808]">
        {shortestNames.map((name) => (
          <Button
            key={name}
            variant={
              selectedCompanyName === name ||
              (!selectedCompanyName && name === defaultCompany)
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCompanyName(name)}
            size="sm"
            className={`text-xs whitespace-nowrap py-1 h-7 ${
              selectedCompanyName === name ||
              (!selectedCompanyName && name === defaultCompany)
                ? "bg-[#1E2A5C] hover:bg-[#566CC8] text-white"
                : "hover:bg-[#4213580e]"
            }`}
          >
            {name}
          </Button>
        ))}
      </div>
    );
  };

  const renderSentenceVariations = () => {
    if (!selectedCandidate?.person?.publicIdentifier || version !== 6)
      return null;

    const identifier = selectedCandidate.person.publicIdentifier.toLowerCase();
    const data = tailoredSentences6[identifier];
    if (!data?.tailored_sentence_variations) return null;

    const variations = [
      data.tailored_sentence,
      ...data.tailored_sentence_variations,
    ];
    const romanNumerals = ["A", "B", "C", "D"];

    return (
      <div className="flex flex-nowrap gap-0.5 mb-1 overflow-x-auto relative border border-gray-100 rounded-lg bg-[#42135808]">
        {variations.map((_, index) => (
          <Button
            key={index}
            variant={sentenceVariationIndex === index ? "default" : "outline"}
            onClick={() => setSentenceVariationIndex(index)}
            size="sm"
            className={`text-xs whitespace-nowrap py-1 h-7 ${
              sentenceVariationIndex === index
                ? "bg-[#1E2A5C] hover:bg-[#566CC8] text-white"
                : "hover:bg-[#4213580e]"
            }`}
          >
            phrasing {romanNumerals[index]}
          </Button>
        ))}
      </div>
    );
  };

  const handleCopy = React.useCallback(async () => {
    const element = document.createElement("div");
    element.innerHTML = ReactDOMServer.renderToStaticMarkup(
      <TextContent
        candidateName={candidateName}
        tailored_sentence={tailored_sentence}
      />
    );
    const textContent = element.innerText;

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
        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-end">
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
                <span className="font-semibold">6</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={version === 6}
                onClick={() => setVersion((prev) => prev + 1)}
                className={`h-5 w-5 p-0 rounded-full grid place-items-center ${
                  version === 6
                    ? "text-white bg-[#425397ac]"
                    : "hover:bg-[#566CC8] bg-[#1E2A5C] text-white"
                }`}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {renderCompanyOptions()}
          {renderSentenceVariations()}
        </div>
      )}
      <TextBubble>
        <TextContent
          candidateName={candidateName}
          tailored_sentence={tailored_sentence}
        />
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
