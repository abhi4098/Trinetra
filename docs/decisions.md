# Architecture Decisions (ADR)

This document tracks foundational architecture decisions for Trinetra.

## ADR-001: Next.js App Router

- Date: 2026-06-10
- Status: Accepted
- Decision: Use Next.js App Router as the application framework.
- Rationale:
  - Strong support for server components and modern rendering patterns
  - Route-level loading and error boundaries
  - Scalable structure for future API and UI growth

## ADR-002: TypeScript

- Date: 2026-06-10
- Status: Accepted
- Decision: Use TypeScript across the codebase.
- Rationale:
  - Improves reliability as architecture grows
  - Enables safer refactors for long-term product evolution
  - Strengthens contracts between UI, services, and data layers

## ADR-003: Tailwind CSS

- Date: 2026-06-10
- Status: Accepted
- Decision: Use Tailwind CSS for styling.
- Rationale:
  - Fast iteration on product surfaces
  - Consistent utility-driven design patterns
  - Easy theming and responsive behavior management

## ADR-004: Supabase

- Date: 2026-06-10
- Status: Accepted
- Decision: Use Supabase as the initial backend data platform.
- Rationale:
  - Fast developer velocity for relational data workflows
  - Strong fit for projects/tasks/memories model
  - Scales from prototype to production usage

## ADR-005: Feature-Based Architecture

- Date: 2026-06-10
- Status: Accepted
- Decision: Organize domain logic under `src/features/*`.
- Rationale:
  - Keeps domain boundaries explicit
  - Reduces coupling between unrelated product areas
  - Improves maintainability as feature count grows

## ADR-006: AI-First Product Design

- Date: 2026-06-10
- Status: Accepted
- Decision: Build Trinetra as an AI-first product, not only a CRUD app.
- Rationale:
  - Aligns implementation with long-term product direction
  - Ensures architecture choices support agent and memory workflows
  - Prevents short-term decisions from blocking future capabilities

## ADR-007: Chat-First Future Direction

- Date: 2026-06-10
- Status: Accepted
- Decision: Make chat the primary future interface.
- Rationale:
  - Simplifies user interaction and intent capture
  - Provides a unified entrypoint for planning and execution
  - Integrates naturally with agent orchestration and tool calling
