# OSai Frontend Architecture

## 1. Core Principle

OSai is built as a stable operating shell with installable modules.

The shell controls structure.

Modules control intelligence, views, data, and experiences.

---

## 6. Evidence-Backed Planning

Evidence-backed planning is a deterministic domain layer that can be enhanced by
AI without making AI-generated prose the system of record.

The planning process is:

```text
User goal
  -> evidence collection
  -> target requirements
  -> gap assessment
  -> phased roadmap
  -> milestones and tasks
  -> completion evidence
  -> readiness recalculation
```

Planning records live in `core/planning`:

- `planningTypes.ts` defines evidence, requirements, gaps, phases, milestones,
  tasks, provenance, confidence, and readiness.
- `evidenceEngine.ts` collects evidence from profile, goal context, résumé work
  history, skills, education, and certifications while retaining source labels.
- `roadmapEngine.ts` compares evidence with goal-specific requirements and
  creates phases, dependencies, completion evidence, risks, assumptions, and a
  next-best action.

The Career module owns the rendered planning experience through
`EvidencePlan.tsx`. It exposes Roadmap, Gaps, and Evidence views without moving
planning business logic into the shell.

Rules:

1. Unknown is not treated as missing.
2. Every satisfied, partial, or transferable requirement retains evidence IDs.
3. Readiness and evidence coverage are separate measures.
4. A milestone is complete only when its completion evidence exists.
5. Agent-owned tasks produce reviewable outputs; they do not silently mark
   milestones complete.
6. AI may propose requirements, mappings, and tasks, but persisted records must
   retain provenance, assumptions, confidence, and user acceptance.
7. Task progress is persisted separately from generated roadmap structure.
8. A task cannot be completed without user-submitted evidence containing a
   claim and supporting details.
9. Submitted evidence satisfies its linked requirement, remains visible after
   regeneration, and triggers readiness and evidence-coverage recalculation.
10. Agent-owned tasks create reviewable artifacts; they do not directly perform
    external actions or satisfy real-world requirements.
11. Accepting an agent artifact records preparatory evidence and keeps the task
    in progress until the user submits outcome evidence.
12. Rejecting an artifact leaves the task open and preserves the audit record.

---

## 7. Goal-Aware Opportunities

The Opportunity module is independent from Career and selects opportunity types
from the active goal rather than assuming every user wants a job.

Supported categories include jobs, business leads, creative work, education,
lifestyle experiments, and partnerships. Each opportunity records:

- Source identity and whether the source is live or prototype data
- Goal-fit reasons and verification gaps
- Roadmap requirements it could support
- A recommended next action
- Persistent shortlist and dismissal state

Prototype opportunities must never be presented as currently available. Live
providers must preserve source URLs, retrieval time, eligibility details, and
verification status when they are introduced.

---

## 8. Career Map Visualization

Career Graph and Timeline intentionally use different visual models driven by
the same active evidence-backed plan.

`CareerTrajectoryChart.tsx` renders Graph as a financial-style trajectory
comparison. Its horizontal axis is the planning horizon and its vertical axis
is the evidence-backed readiness index. It compares the current trajectory,
target trajectory, and an optional lower-risk bridge path, with selectable
milestones and a confidence range. These lines are planning scenarios—not
salary forecasts, probabilities, or guarantees—and change as evidence,
constraints, milestones, or timing change.

`CareerMapCanvas.tsx` renders Timeline as an interactive branching route map:

- The horizontal spine represents major transition phases from Today to the
  target outcome.
- Upper branches represent education, credentials, market validation, and
  opportunity routes.
- Lower branches represent evidence, transferable experience, relationships,
  capacity, and constraints.
- Dashed rings represent missing or unknown evidence.
- Alternate routes such as bridge roles and pilot work remain visually distinct
  from the primary route.
- Selecting a node exposes its evidence and recommended actions in the map's
  detail rail.
- Milestones retain target-month semantics and can expose alternate routes.

The shell collapses its separate utility rail for Graph and Timeline because
each visualization owns its contextual detail rail. Other Career views and
modules retain the standard utility rail.

The accepted visual concept is stored at
`docs/design/career-map-concept.png` for future fidelity reviews.

---

## 2. Architecture Layers

Application

↓  

Shell

↓  

Frames

↓  

Panels

↓  

Modules

↓  

Components

↓  

Data

↓  

AI

---

## 3. Shell Responsibility

The shell owns:

- Layout
- Placement
- Navigation regions
- Responsive structure

The shell does not know:

- Module business logic
- Module data
- Module views
- Module metrics

---

## 4. Desktop Shell Structure

### D1 Global Header

Responsibilities:

- Brand
- Active module identity
- Global actions

---

### D2 Navigation

Responsibilities:

- Module launcher

Examples:

- Resume
- Career
- Network

---

### D3 Workspace

Primary interaction area.

Contains:

- Workspace metrics
- View controls
- Visualization

Panels:

- D3 Header Panel
- D3 Controls Panel
- D3 Visualization Panel

---

### D4 Utility Frame

Context intelligence area.

Panels:

- Utility Top
- Utility Middle
- Utility Bottom

Examples:

- Filters
- Context
- Results

---

### D5 Bottom Workspace

Insight layer.

Panels:

- Bottom Left
- Bottom Center
- Bottom Right

Examples:

- Strengths
- Opportunities
- Actions

---

# 5. Module Architecture

Modules live in:

```text
modules/
```

---

## 9. Shared Color System

The application shell uses a petroleum blue-grey family, with slate-blue and
teal tonal variations. Orange is a restrained interaction accent for selected
navigation, active tabs, readiness gaps, and selected chart milestones.

The D3 visualization area is the protected analytical canvas: its base and
content surfaces remain true white with pale blue-grey borders. Financial-style
career charts use navy target lines, petroleum-teal bridge lines, slate current
lines, and orange only for the selected point. D4 uses the darker petroleum
utility treatment; D5 uses a petroleum frame with white intelligence cards.

Shared values and compatibility mappings are defined in `app/globals.css`,
while shell-level composition tokens remain in `core/design/styles.ts`.

---

## 10. Home and Profile

Home is the first installed module and summarizes the user's strongest signals
through an asymmetric highlight-tile layout. Tile values are derived from the
profile, goals, evidence, opportunities, and reviewer activity rather than
being maintained as separate presentation data.

Profile is a Home view reached from both the Home edit action and the global
avatar. It owns identity and life-stage context, including the profile image,
age, experience, headline, skills, and highlight statements. Age is not
collected by goal creation; goal guidance reads it from the shared profile.

Career Graph and Timeline retain D4. Their utility panels expose assumptions,
risk signals, and decision checkpoints that complement—rather than repeat—the
selected-point detail within D3.

---

## 11. Layered Blue Section Treatment

The global header, D2 navigation, and D4 intelligence rail share the approved
abstract blue texture under restrained petroleum overlays. The image is a shell
motif only; content remains code-native and D3 remains a white analytical
workspace.

Home highlight tiles use explicit navy, cyan, mist, cobalt, teal, pale-blue,
slate, and aqua variants. D4 sections rotate related dark tones so adjacent
intelligence areas remain visually distinct. Orange remains limited to selected
states and small emphasis rules. Existing border widths are unchanged.
