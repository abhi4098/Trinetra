type Props = {
  titleWidthClass?: string;
};

export default function RouteLoading({ titleWidthClass = "w-48" }: Props) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className={`h-8 ${titleWidthClass} animate-pulse rounded bg-slate-200`} />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </main>
  );
}
