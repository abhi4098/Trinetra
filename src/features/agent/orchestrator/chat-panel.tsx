"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function submitMessage() {
    const content = input.trim();
    if (!content || isLoading) return;

    setIsLoading(true);
    setError(undefined);
    setMessages((prev) => [...prev, { role: "user", text: content }]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = (await response.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[55vh] space-y-3 overflow-y-auto border-b border-slate-200 p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-600">
            Ask Trinetra anything about your projects, tasks, or memories.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          rows={3}
          placeholder="What should I work on next?"
        />

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          type="button"
          onClick={submitMessage}
          disabled={isLoading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
    </section>
  );
}
