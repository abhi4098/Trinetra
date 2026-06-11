"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Brain,
  MessageSquare,
  Mic,
  Settings,
  PanelLeft,
  X,
} from "lucide-react";
import NavItem from "@/components/navigation/nav-item";

const primaryNavItems = [
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Memories", href: "/memories", icon: Brain },
];

const futureNavItems = [
  { label: "Voice", href: "/voice", icon: Mic },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-white">Trinetra</p>
        <p className="mt-1 text-xs text-slate-300">Personal AI Operating System</p>
      </div>

      <nav className="space-y-1">
        {primaryNavItems.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            active={isActive(item.href)}
            onNavigate={() => setIsOpen(false)}
          />
        ))}
      </nav>

      <p className="mb-2 mt-7 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Roadmap
      </p>
      <nav className="space-y-1">
        {futureNavItems.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            disabled
          />
        ))}
      </nav>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <p className="text-lg font-black tracking-tight text-slate-900">Trinetra</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-slate-300 p-2 text-slate-700"
          aria-label="Open navigation"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation overlay"
            onClick={() => setIsOpen(false)}
          />
          <aside className="relative h-full w-[86%] max-w-xs border-r border-slate-800 bg-slate-950 p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-lg font-bold tracking-tight text-white">Navigation</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-white/20 p-2 text-slate-200"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {navContent}
          </aside>
        </div>
      ) : null}

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-80 overflow-y-auto border-r border-slate-800 bg-slate-950 p-5 md:block">
        {navContent}
      </aside>
    </>
  );
}
