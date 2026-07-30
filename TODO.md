# TODO — Patient Zero AI

Everything in the UI currently runs on mock data. This is the punch list for wiring up
the real AI pipeline before/at the hackathon demo.

## Environment variables (create `.env.local`, never commit real keys)

```
TWELVELABS_API_KEY=
OPENAI_API_KEY=
NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=
```

## Services (all throw `not implemented` right now)

- `services/twelvelabs.ts`
  - `indexVideo` — upload + index a video via TwelveLabs Tasks API
  - `analyzeVideo` — extract people/objects/rooms/actions/speech/OCR/timestamps
  - `searchAcrossVideos` — natural-language search across indexed videos
- `services/openai.ts`
  - `generateExposureSummary` — gpt-4o reasoning over TwelveLabs output → timeline + watch list
  - `answerInvestigationQuestion` — gpt-4o chat answers using Neo4j graph context
- `services/neo4j.ts`
  - `upsertExposureEvent` — write Person/Room/Interaction nodes + relationships
  - `getExposureGraph` — read the graph for the Exposure Graph page
  - `findExposurePath` — shortest-path query between two people
- `services/strands.ts`
  - `runInvestigationWorkflow` — orchestrate TwelveLabs → OpenAI → Neo4j as one workflow,
    replacing the client-side `simulateUpload`/`runAnalysisSequence` mock in
    `context/InvestigationContext.tsx`

## API routes (currently fall back to mock data on any error)

- `app/api/analyze/route.ts` — calls `strands.runInvestigationWorkflow`; returns 501 until wired up
- `app/api/chat/route.ts` — calls `openai.answerInvestigationQuestion`; falls back to
  `lib/mockData.ts#getMockChatResponse`
- `app/api/graph/route.ts` — calls `neo4j.getExposureGraph`; falls back to
  `lib/mockData.ts#graphNodes` / `graphEdges`

## Mock data to replace

- `lib/mockData.ts` — `people`, `timeline`, `graphNodes`, `graphEdges`,
  `getMockChatResponse`. Once the real pipeline is live, the dashboard/chat/timeline/graph
  components should fetch from `/api/analyze`, `/api/chat`, and `/api/graph` instead of
  importing this file directly.

## UI wiring still needed once real data exists

- `context/InvestigationContext.tsx` — `sendMessage` currently calls
  `getMockChatResponse` directly instead of `POST /api/chat`; `addVideos` simulates
  upload/progress instead of actually uploading files anywhere.
- Dashboard right panel video player is a static placeholder (`Play` icon) — needs an
  actual `<video>` element that seeks to `?video=&t=` from the Watch List "View evidence"
  links and Timeline event links.
- `/graph` page reads only from `lib/mockData.ts`; swap to `GET /api/graph`.
- No auth/session/investigation-id concept yet — every session is a single implicit
  investigation.
