type Props = {
  name: string;
  progress: number;
};

export default function ProjectCard({ name, progress }: Props) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
        <div className="text-xs font-medium text-slate-600">{progress}%</div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-600">Progress: {progress}%</p>
    </div>
  );
}
