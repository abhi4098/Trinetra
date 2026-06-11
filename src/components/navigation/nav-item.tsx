import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onNavigate?: () => void;
};

export default function NavItem({
  label,
  href,
  icon: Icon,
  active = false,
  disabled = false,
  onNavigate,
}: Props) {
  const baseClassName =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition";

  if (disabled) {
    return (
      <div
        className={`${baseClassName} cursor-not-allowed border border-white/10 bg-white/5 text-slate-400`}
        aria-disabled="true"
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{label}</span>
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
          Soon
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`${baseClassName} ${
        active
          ? "bg-white text-slate-900 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.75)]"
          : "text-slate-200/90 hover:bg-white/10 hover:text-white"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
