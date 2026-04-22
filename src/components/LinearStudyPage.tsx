import type { LinearStudyPlan, StudyStepKey } from "@/content/linearStudyPlans";

interface LinearStudyPageProps {
  plan: LinearStudyPlan;
  step: StudyStepKey;
}

export function LinearStudyPage({ plan, step }: LinearStudyPageProps) {
  return (
    <div className="space-y-6">
      <header className="border-b border-zinc-200 pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
          {plan.moduleLabel ?? "Linear structures"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-black">{plan.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-700">
          <span className="font-medium text-zinc-950">Invariant:</span> {plan.invariant}
        </p>
      </header>

      {step === "brief" && <Brief plan={plan} />}
      {step === "visualize" && <Visualize plan={plan} />}
      {step === "tradeoffs" && <Tradeoffs plan={plan} />}
      {step === "drill" && <Drill plan={plan} />}
      {step === "implement" && <Implement plan={plan} />}
      {step === "scale" && <Scale plan={plan} />}
    </div>
  );
}

function Brief({ plan }: { plan: LinearStudyPlan }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-black">When to Reach For It</h2>
        {plan.brief.why.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-6 text-zinc-700">
            {paragraph}
          </p>
        ))}
      </section>

      <aside className="space-y-5">
        <SectionList title="Python Cost Model" items={plan.brief.costModel} />
        <SectionList title="System Connections" items={plan.brief.realWorld} />
      </aside>
    </div>
  );
}

function Visualize({ plan }: { plan: LinearStudyPlan }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-black">{plan.visualize.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-700">
          {plan.visualize.description}
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600">
          Python
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-6 text-zinc-800">
          <code>{plan.visualize.code}</code>
        </pre>
      </div>

      <div className="grid gap-3">
        {plan.visualize.steps.map((item, index) => (
          <div
            key={item.label}
            className="grid gap-3 border-t border-zinc-200 pt-3 sm:grid-cols-[7rem_1fr_1.6fr]"
          >
            <div className="font-mono text-xs text-zinc-600">Step {index + 1}</div>
            <div>
              <div className="text-sm font-medium text-zinc-950">{item.label}</div>
              <div className="mt-1 font-mono text-sm text-zinc-700">{item.state}</div>
            </div>
            <p className="text-sm leading-6 text-zinc-700">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tradeoffs({ plan }: { plan: LinearStudyPlan }) {
  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-black">Tradeoffs</h2>
      <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-600">
            <tr>
              {plan.tradeoffs.columns.map((column) => (
                <th key={column} className="border-b border-zinc-200 px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.tradeoffs.rows.map((row) => (
              <tr key={row.join(":")} className="border-b border-zinc-100 last:border-0">
                {plan.tradeoffs.columns.map((column, index) => (
                  <td
                    key={column}
                    className="px-4 py-3 text-zinc-700 first:font-medium first:text-zinc-950"
                  >
                    {row[index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SectionList title="Decision Notes" items={plan.tradeoffs.notes} />
    </section>
  );
}

function Drill({ plan }: { plan: LinearStudyPlan }) {
  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-black">Pick the Approach</h2>
      <div className="space-y-4">
        {plan.drill.map((problem, index) => (
          <article key={problem.prompt} className="border-t border-zinc-200 pt-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black font-mono text-xs text-white">
                {index + 1}
              </span>
              <div className="space-y-2">
                <h3 className="text-sm font-medium leading-6 text-zinc-950">{problem.prompt}</h3>
                <p className="text-sm leading-6 text-zinc-700">
                  <span className="font-medium text-zinc-950">Answer:</span> {problem.answer}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Implement({ plan }: { plan: LinearStudyPlan }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-black">Implement</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-700">{plan.implement.prompt}</p>
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600">
          Starter
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-6 text-zinc-800">
          <code>{plan.implement.starterCode}</code>
        </pre>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionList title="Hidden Tests" items={plan.implement.tests} monospace />
        <SectionList title="Implementation Notes" items={plan.implement.notes} />
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600">
          Pattern Reference
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-sm font-medium text-zinc-950">{plan.patterns.title}</h3>
          <pre className="overflow-x-auto text-sm leading-6 text-zinc-800">
            <code>{plan.patterns.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function Scale({ plan }: { plan: LinearStudyPlan }) {
  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-black">Scale-Up Cascade</h2>
      <div className="space-y-4">
        {plan.scale.map((item) => (
          <article
            key={item.scale}
            className="grid gap-2 border-t border-zinc-200 pt-4 md:grid-cols-[10rem_1fr]"
          >
            <h3 className="font-mono text-sm font-medium text-zinc-950">{item.scale}</h3>
            <p className="text-sm leading-6 text-zinc-700">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionList({
  title,
  items,
  monospace = false,
}: {
  title: string;
  items: string[];
  monospace?: boolean;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
            <span className={monospace ? "font-mono" : undefined}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
