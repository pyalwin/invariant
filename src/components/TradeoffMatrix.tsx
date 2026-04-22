import { cn } from "@/lib/cn";

interface Alternative {
  name: string;
  time: string;
  space?: string;
  notes?: string;
}

interface TradeoffMatrixProps {
  subject: string;
  alternatives: Alternative[];
  pythonNotes?: string[];
}

export function TradeoffMatrix({ subject, alternatives, pythonNotes }: TradeoffMatrixProps) {
  return (
    <div className="space-y-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-300">
            <th className="pr-4 text-left font-medium text-zinc-600">Structure</th>
            <th className="px-4 text-left font-medium text-zinc-600">Time</th>
            <th className="px-4 text-left font-medium text-zinc-600">Space</th>
            <th className="pl-4 text-left font-medium text-zinc-600">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          <tr className="border-zinc-300 bg-indigo-50/20">
            <td className="pr-4 py-2 font-medium text-black">{subject} ✓</td>
            <td className="px-4 py-2 font-mono text-zinc-800">—</td>
            <td className="px-4 py-2 font-mono text-zinc-800">—</td>
            <td className="pl-4 py-2 text-zinc-600">baseline</td>
          </tr>
          {alternatives.map((alt) => (
            <tr key={alt.name} className="text-zinc-600">
              <td className="pr-4 py-2 text-zinc-800">{alt.name}</td>
              <td className="px-4 py-2 font-mono text-zinc-600">{alt.time}</td>
              <td className="px-4 py-2 font-mono text-zinc-600">{alt.space ?? "—"}</td>
              <td className="pl-4 py-2 text-zinc-600">{alt.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {pythonNotes && pythonNotes.length > 0 && (
        <div className="space-y-1 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
            Python-specific
          </p>
          {pythonNotes.map((note, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-black">→</span>
              <code className="font-mono text-zinc-800">{note}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}