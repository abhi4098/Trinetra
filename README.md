# Trinetra

Trinetra is a Personal AI Operating System.

Today, Trinetra provides structured workflows for projects, tasks, and memories. Over time, it will evolve into a chat-first personal operator with agent orchestration, voice input, tool calling, and browser automation.

## Project Overview

Trinetra combines:

- A modern App Router web interface
- A feature-based codebase organization
- A deterministic agent layer (no LLM dependency yet)
- A persistent memory model powered by Supabase
- Testable planning and recommendation services

## Vision

Build a long-term AI companion that can understand context, prioritize actions, and execute real-world workflows on behalf of the user.

See:

- [docs/vision.md](docs/vision.md)
- [docs/roadmap.md](docs/roadmap.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/decisions.md](docs/decisions.md)

## Core Principles

- AI-first product direction with pragmatic milestones
- Chat as the primary future interface
- Clear architecture boundaries (UI, features, agent, memory, tools)
- Strong TypeScript typing and schema validation
- Testability by design (planner/memory/services)
- Production-oriented incremental delivery

## Current Architecture

- Frontend: Next.js App Router + Tailwind CSS + TypeScript
- Data: Supabase
- State/data fetching: React Query (client interactions)
- Validation: Zod
- Testing: Vitest (unit tests for agent logic)

High-level flow:

Chat -> Agent -> Memory -> Tools

## Development Setup

### Requirements

- Node.js 20+
- npm 10+
- Supabase project with configured environment variables

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

### Install and Run

```bash
npm install
npm run dev
```

### Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Roadmap

- Milestone 1: CRUD foundation, dashboard, navigation
- Milestone 2: Chat, agent layer, memory retrieval, Vitest tests
- Milestone 3: OpenAI integration, voice foundation
- Milestone 4: Tool calling, browser automation
- Milestone 5: Autonomous personal operator

Detailed plan: [docs/roadmap.md](docs/roadmap.md)

## Milestones

- M1 complete: foundational CRUD product surface
- M2 in progress: chat-first and agent-centric evolution
- M3+ planned: intelligence depth and execution capabilities

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow and standards.
