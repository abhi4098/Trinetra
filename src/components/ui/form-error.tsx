type Props = {
  message?: string;
};

export default function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}
