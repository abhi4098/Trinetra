type Props = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: Props) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </article>
  );
}
