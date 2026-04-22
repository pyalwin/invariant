import { LinearStudyPage } from "@/components/LinearStudyPage";
import { advancedStudyPlans } from "@/content/advancedStudyPlans";
import { dpStudyPlans } from "@/content/dpStudyPlans";
import { graphsStudyPlans } from "@/content/graphsStudyPlans";
import { hashingStudyPlans } from "@/content/hashingStudyPlans";
import { heapsStudyPlans } from "@/content/heapsStudyPlans";
import { type StudyStepKey, linearStudyPlans } from "@/content/linearStudyPlans";
import { stringStudyPlans } from "@/content/stringStudyPlans";
import { treesStudyPlans } from "@/content/treesStudyPlans";
import { cn } from "@/lib/cn";
import { topics } from "@/lib/topics";
import type { TopicMeta } from "@/lib/topics";
import { TOTAL_STEPS, useProgressStore } from "@/store/progress";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

// Eagerly import all topic content as raw strings
const MDX_CONTENT = import.meta.glob("@/content/topics/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const STEPS = [
  { key: "brief", label: "Brief" },
  { key: "visualize", label: "Visualize" },
  { key: "tradeoffs", label: "Tradeoffs" },
  { key: "drill", label: "Drill" },
  { key: "implement", label: "Implement" },
  { key: "scale", label: "Scale" },
] as const;

const STEP_SECTION_HEADINGS: Record<string, string[]> = {
  brief: ["Brief"],
  visualize: ["Visualize", "Visualizer"],
  tradeoffs: ["Tradeoffs", "Tradeoff Matrix"],
  drill: ["Drill"],
  implement: ["Implement", "Implement + Run"],
  scale: ["Scale", "Scale-Up", "Scale-Up Cascade"],
};

export default function Topic() {
  const { id } = useParams<{ id: string }>();
  const { topics: progressTopics, hydrated, hydrate, markStep } = useProgressStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const topicMeta = topics.find((t) => t.id === id);
  const completedSteps = (progressTopics[id ?? ""] ?? []).map((s) => s.step);
  const rawContent = id ? MDX_CONTENT[`/src/content/topics/${id}.mdx`] : null;
  const studyPlan = id
    ? (linearStudyPlans[id] ??
      hashingStudyPlans[id] ??
      heapsStudyPlans[id] ??
      treesStudyPlans[id] ??
      graphsStudyPlans[id] ??
      dpStudyPlans[id] ??
      stringStudyPlans[id] ??
      advancedStudyPlans[id])
    : null;

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  if (!topicMeta) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-zinc-600">Topic not found.</p>
        <Link to="/" className="mt-4 text-sm text-black hover:underline">
          Back to topics
        </Link>
      </div>
    );
  }

  const stepKey = STEPS[currentStep].key;
  const stepContent = rawContent ? extractStepContent(rawContent, stepKey) : null;

  const handleStepComplete = async () => {
    if (!id) return;
    await markStep(id, stepKey);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const isStepComplete = (key: string) => completedSteps.includes(key);
  const allDone = completedSteps.length === TOTAL_STEPS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-600">
        <Link to="/" className="hover:text-zinc-800">
          Topics
        </Link>
        <span>/</span>
        <span className="text-zinc-800">{topicMeta.title}</span>
      </div>

      {/* Step tabs */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = isStepComplete(s.key);
          const active = i === currentStep;
          return (
            <button
              type="button"
              key={s.key}
              onClick={() => setCurrentStep(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors whitespace-nowrap",
                active
                  ? "bg-black text-white"
                  : done
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-zinc-200 text-zinc-700 hover:text-black"
              )}
            >
              {done && (
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div className="min-h-96 rounded-lg border border-zinc-200 bg-zinc-50/80 p-6">
        {allDone ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-black">Topic complete</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Review your cards in the Review tab to strengthen retention.
            </p>
          </div>
        ) : studyPlan ? (
          <LinearStudyPage plan={studyPlan} step={stepKey as StudyStepKey} />
        ) : rawContent ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{stepContent ?? rawContent}</ReactMarkdown>
          </div>
        ) : (
          <StepContent step={stepKey} topic={topicMeta} />
        )}
      </div>

      {/* Navigation */}
      {!allDone && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-800 transition-colors hover:bg-zinc-200 disabled:opacity-30"
          >
            Back
          </button>
          {!isStepComplete(stepKey) && (
            <button
              type="button"
              onClick={handleStepComplete}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Mark complete
            </button>
          )}
          {isStepComplete(stepKey) && currentStep < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-800 transition-colors hover:bg-zinc-200"
            >
              Next step
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StepContent({ step, topic }: { step: string; topic: TopicMeta }) {
  switch (step) {
    case "brief":
      return (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-black">{topic.title}</h2>
          <p className="text-zinc-600">
            Conceptual brief coming soon. This step will contain a 2–3 minute explanation, the
            invariant statement, and real-world system callouts.
          </p>
        </div>
      );
    case "visualize":
      return (
        <div className="space-y-3">
          <h3 className="font-medium text-zinc-900">Visualizer</h3>
          <p className="text-zinc-600 text-sm">
            Interactive step-through animation will appear here. Powered by real Python execution
            via Pyodide.
          </p>
        </div>
      );
    case "tradeoffs":
      return (
        <div className="space-y-3">
          <h3 className="font-medium text-zinc-900">Tradeoff Matrix</h3>
          <p className="text-zinc-600 text-sm">
            Comparison table with Python-specific call-outs will appear here.
          </p>
        </div>
      );
    case "drill":
      return (
        <div className="space-y-3">
          <h3 className="font-medium text-zinc-900">Pick-the-Approach Drill</h3>
          <p className="text-zinc-600 text-sm">
            3–5 scenarios where you pick an approach and justify it before seeing the answer.
          </p>
        </div>
      );
    case "implement":
      return (
        <div className="space-y-3">
          <h3 className="font-medium text-zinc-900">Implement + Run</h3>
          <p className="text-zinc-600 text-sm">
            Monaco editor with Python execution via Pyodide. Hidden test cases. Real runtimes.
          </p>
        </div>
      );
    case "scale":
      return (
        <div className="space-y-3">
          <h3 className="font-medium text-zinc-900">Scale-Up Cascade</h3>
          <p className="text-zinc-600 text-sm">
            Same problem at 1K → 1M → 1B → distributed. Predict inflection points before seeing
            answers.
          </p>
        </div>
      );
    default:
      return null;
  }
}

function extractStepContent(markdown: string, step: string) {
  const targetHeadings = STEP_SECTION_HEADINGS[step]?.map(normalizeHeading);
  if (!targetHeadings?.length) return null;

  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    return heading ? targetHeadings.includes(normalizeHeading(heading[1])) : false;
  });

  if (start === -1) return null;

  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  return lines
    .slice(start, end === -1 ? undefined : end)
    .join("\n")
    .trim();
}

function normalizeHeading(heading: string) {
  return heading.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}
