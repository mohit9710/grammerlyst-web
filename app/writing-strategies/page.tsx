import type { Metadata } from "next";
import WritingStrategiesPage from "./WritingStrategiesClient";

export const metadata: Metadata = {
  title: "IELTS Writing Strategies | Task 1 & Task 2 Tips | Grammrlyst",
  description:
    "Master IELTS Writing Task 1 and Task 2 with proven strategies, structure templates, and examiner tips.",
};

export default function Page() {
  return <WritingStrategiesPage />;
}
