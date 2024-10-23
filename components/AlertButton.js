"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AlertButton({ href, children, initialActive = false }) {
  const [isActive, setIsActive] = useState(initialActive);

  const AlertIndicator = ({ isActive }) => (
    <div
      className={`w-3 h-3 rounded-full ${
        isActive ? "bg-red-500 animate-pulse" : "bg-gray-300"
      }`}
    />
  );

  return (
    <Button
      asChild
      variant="default"
      className="w-full hover:bg-gray-700 transition-colors"
      onClick={() => setIsActive(!isActive)}
    >
      <Link
        href={href}
        className="hover:bg-gray-700 flex items-center justify-center relative"
      >
        <div className="absolute left-2">
          <AlertIndicator isActive={isActive} />
        </div>
        <span>{children}</span>
      </Link>
    </Button>
  );
}
