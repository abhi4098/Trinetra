import { describe, expect, it } from "vitest";
import { createIntentRouter, routeIntent } from "@/features/agent/orchestrator/intent-router";

describe("intent router", () => {
  it("routes project questions to projects intent", () => {
    expect(routeIntent("What projects do I have?")).toBe("projects");
    expect(routeIntent("List projects")).toBe("projects");
  });

  it("routes task questions to tasks intent", () => {
    expect(routeIntent("Show unfinished tasks")).toBe("tasks");
    expect(routeIntent("What tasks do I have?")).toBe("tasks");
  });

  it("routes summary and about intents", () => {
    expect(routeIntent("Summarize my workspace")).toBe("workspace_summary");
    expect(routeIntent("What is Trinetra?")).toBe("about_trinetra");
  });

  it("routes memories intent", () => {
    expect(routeIntent("How many memories do I have?")).toBe("memories");
    expect(routeIntent("Show memories")).toBe("memories");
  });

  it("routes decisions intent", () => {
    expect(routeIntent("What decisions have been made?")).toBe("decisions");
    expect(routeIntent("List decisions")).toBe("decisions");
  });

  it("routes insights intent", () => {
    expect(routeIntent("Show insights")).toBe("insights");
    expect(routeIntent("List insights")).toBe("insights");
  });

  it("routes notes intent", () => {
    expect(routeIntent("Show notes")).toBe("notes");
    expect(routeIntent("List notes")).toBe("notes");
  });

  it("routes recommendation queries first", () => {
    expect(routeIntent("What should I work on today?")).toBe("recommendation");
  });

  it("returns unknown when no keywords match", () => {
    const router = createIntentRouter([]);
    expect(router.route("hello there")).toBe("unknown");
  });
});
