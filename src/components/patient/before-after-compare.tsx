export function BeforeAfterCompare({ before, latest }: { before: string; latest: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">Before</div>
        <img src={before} alt="Previous ulcer image" className="h-72 w-full object-cover" />
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">Present</div>
        <img src={latest} alt="Latest ulcer image" className="h-72 w-full object-cover" />
      </div>
    </div>
  );
}
