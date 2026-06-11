export type ChatIntent =
  | "projects"
  | "tasks"
  | "memories"
  | "decisions"
  | "insights"
  | "notes"
  | "workspace_summary"
  | "recommendation"
  | "about_trinetra"
  | "unknown";

export const ACTIVE_INTENTS: Exclude<ChatIntent, "unknown">[] = [
  "projects",
  "tasks",
  "memories",
  "decisions",
  "insights",
  "notes",
  "workspace_summary",
  "recommendation",
  "about_trinetra",
];

export type IntentRule = {
  intent: Exclude<ChatIntent, "unknown">;
  keywords: string[];
};

const defaultRules: IntentRule[] = [
  {
    intent: "memories",
    keywords: [
      "show memories",
      "list memories",
      "how many memories",
      "memories",
      "memory",
    ],
  },
  {
    intent: "decisions",
    keywords: [
      "what decisions have been made",
      "show decisions",
      "list decisions",
      "decisions",
      "decision",
    ],
  },
  {
    intent: "insights",
    keywords: ["show insights", "list insights", "insights", "insight"],
  },
  {
    intent: "notes",
    keywords: ["show notes", "list notes", "notes", "note"],
  },
  {
    intent: "recommendation",
    keywords: [
      "what should i work on today",
      "what should i work on",
      "what is next",
      "what's next",
      "recommend a task",
      "recommend",
      "next",
    ],
  },
  {
    intent: "workspace_summary",
    keywords: ["summarize my workspace", "workspace status", "summarize", "workspace"],
  },
  {
    intent: "about_trinetra",
    keywords: ["what is trinetra", "about trinetra", "what is this"],
  },
  {
    intent: "projects",
    keywords: ["what projects do i have", "list projects", "show projects", "project"],
  },
  {
    intent: "tasks",
    keywords: [
      "what tasks do i have",
      "list tasks",
      "show unfinished tasks",
      "show tasks",
      "unfinished tasks",
      "task",
      "todo",
    ],
  },
];

function normalizeMessage(message: string) {
  return message.trim().toLowerCase();
}

function includesKeyword(message: string, keywords: string[]) {
  return keywords.some((keyword) => message.includes(keyword));
}

export function createIntentRouter(rules: IntentRule[] = defaultRules) {
  return {
    route(message: string): ChatIntent {
      const normalizedMessage = normalizeMessage(message);

      for (const rule of rules) {
        if (includesKeyword(normalizedMessage, rule.keywords)) {
          return rule.intent;
        }
      }

      return "unknown";
    },
  };
}

export const intentRouter = createIntentRouter();

export function routeIntent(message: string): ChatIntent {
  return intentRouter.route(message);
}
