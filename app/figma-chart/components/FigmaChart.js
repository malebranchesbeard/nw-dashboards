"use client";

import { useState, useEffect } from "react";

export default function FigmaChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-grow flex flex-col h-full">
      <iframe
        className="flex-grow"
        style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
        width="100%"
        src="https://embed.figma.com/design/NR7WyVbxi7B9VIInOyphcc/Database-Diagram-Builder-(Community)?node-id=126-257&embed-host=share"
        allowFullScreen
      />
    </div>
  );
}
