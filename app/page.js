import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlertButton from "@/components/AlertButton";

export const metadata = {
  title: "NW Dashboards",
  description: "Workspace for dashboards, tests and tools in development.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <Card className="w-full max-w-md mb-8">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            NW Dashboards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Card className="rounded-lg shadow-lg">
            <CardHeader className="pb-3 pt-2">
              <CardTitle className="text-md font-semibold">Products</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              <Button
                asChild
                variant="default"
                className="w-full hover:bg-gray-700 transition-colors"
              >
                <Link href="/career-chart" className="hover:bg-gray-700">
                  Career Progression Chart
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="w-full hover:bg-gray-700 transition-colors"
              >
                <Link href="/roles-diagram" className="hover:bg-gray-700">
                  Seniority Levels
                </Link>
              </Button>
              <AlertButton href="/scorecards" initialActive={true}>
                Head of Global Quality Scorecard
              </AlertButton>
              <AlertButton href="/landscape" initialActive={true}>
                Competitor Landscape
              </AlertButton>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-lg">
            <CardHeader className="pb-3 pt-2">
              <CardTitle className="text-md font-semibold">
                Operational
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              <AlertButton href="/tailored-text" initialActive={true}>
                Tailored Text
              </AlertButton>
              <Button
                asChild
                variant="default"
                className="w-full hover:bg-gray-700 transition-colors"
              >
                <Link href="/role-evaluator" className="hover:bg-gray-700">
                  Role Evaluator
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="w-full hover:bg-gray-700 transition-colors"
              >
                <Link href="/figma-chart" className="hover:bg-gray-700">
                  Process Maps
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="w-full hover:bg-gray-700 transition-colors"
              >
                <Link href="/llm-workflow" className="hover:bg-gray-700">
                  LLM Workflow
                </Link>
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </main>
  );
}
