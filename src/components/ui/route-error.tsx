"use client";

type Props = {
  title: string;
  error: Error;
  reset: () => void;
};

export default function RouteError({ title, error, reset }: Props) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-bold text-red-800">{title}</h2>
        <p className="mt-2 text-sm text-red-700">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
