import SectionHeader from "@/components/ui/section-header";
import ChatPanel from "@/features/agent/orchestrator/chat-panel";

export default function ChatPage() {
  return (
    <div>
      <SectionHeader
        title="Chat"
        subtitle="Primary AI interface for planning and context-aware guidance."
      />
      <ChatPanel />
    </div>
  );
}
