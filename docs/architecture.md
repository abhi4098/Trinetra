# Trinetra Architecture

## Current Architecture

Trinetra currently uses a feature-based web architecture with deterministic agent services.

- UI: Next.js App Router + Tailwind CSS
- Domain: Feature folders under `src/features`
- Data: Supabase APIs wrapped in feature modules
- Validation: Zod schemas for input correctness
- Testing: Vitest unit tests for agent logic

## Future Architecture

```text
Chat
  ↓
Agent
  ↓
Memory
  ↓
Tools
```

### Layer Responsibilities

- Chat: user interaction surface and intent capture
- Agent: planning, orchestration, decision policies
- Memory: contextual retrieval and relevance composition
- Tools: concrete execution adapters and integrations

## Feature-Based Folder Structure

```text
src/
  app/
  components/
  features/
    agent/
      planner/
      memory/
      tools/
      orchestrator/
    projects/
    tasks/
    memories/
    dashboard/
  lib/
  types/
```

## Agent Architecture

- `planner/`: recommendation and planning logic
- `memory/`: context retrieval service from domain features
- `tools/`: utility and execution primitives
- `orchestrator/`: request-to-response composition

Design goals:

- Keep services deterministic before introducing LLM dependencies
- Preserve testability with dependency injection and pure functions
- Isolate orchestration from low-level retrieval/execution details

## Memory Architecture

Current memory context includes:

- Projects
- Tasks
- Memories

Retrieval pattern:

- Domain APIs load structured records from Supabase
- Agent memory service composes records into a unified context object
- Planner consumes this context to produce recommendations

Future memory evolution:

- Relevance ranking
- Semantic retrieval
- Session/user memory layers
- Event timelines and decision traces

## Future Voice Architecture

Planned voice layer:

- Input pipeline: speech-to-text with intent extraction
- Agent integration: voice requests routed into chat/orchestrator pipeline
- Output pipeline: response summarization and text-to-speech
- Safety: confirmation checkpoints for high-impact actions
