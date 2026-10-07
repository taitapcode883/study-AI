# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Addressing the user

Always address the user as **"anh yêu"** (e.g. "Dạ anh yêu, ..."), in every response.

## Project overview

GPA Tracker: a Vietnamese-language web app where students enter courses (name, credits, 10-point grade) and see their cumulative GPA on the 4-point and 10-point scales plus an academic classification. `PRD.md` is the source of truth for features, validation rules, and the grade conversion table.

## Development process (Waterfall)

The project follows the Waterfall model. Each phase must be finished, and approved by the user where noted, before the next one starts. Don't skip ahead (e.g. no code before the design phase is approved).

1. **Requirements**: `PRD.md` (done).
2. **Design**: business flowcharts in Mermaid `flowchart` syntax, written to `docs/flowcharts.md`, one chart per feature (F1–F5) plus an overall app flow. The user approves them before implementation.
3. **Implementation + automated testing**: build the features in PRD dependency order (F1 → F2 → F3 → F4 → F5). Each feature needs passing Vitest unit tests before it counts as done.
4. **User acceptance testing (UAT)**: **the user runs UAT personally.** Claude prepares the build and a checklist, then waits for the user's results. Claude doesn't mark UAT as passed on its own.
5. **Deployment**: deploy to Vercel and record the public URL in `status.md`.

If a later phase reveals a requirement or design problem, go back to the earlier document (PRD or flowcharts), update it with the user's agreement, and record the change in `status.md`.

### Tracking files: keep them up to date

- `plan.md`: the project plan (phases, tasks, deliverables, exit criteria). Tick off tasks as they're completed.
- `status.md`: the current phase and progress, the **technical decisions log**, and the **change log of deviations from the original plan/PRD**. Update it whenever a phase or feature changes status, a technical decision is made, or anything differs from the original PRD/plan.
- PRD section 4 ("Trạng thái" column) is kept in sync with feature status.

## Stack and commands

The PRD prescribes **Vite + vanilla HTML/CSS/JavaScript**, with unit tests in **Vitest** and deployment on **Vercel**. Don't add a UI framework, backend, database, or authentication.

Once the project is scaffolded (`package.json` doesn't exist yet), confirm the exact scripts there. The expected commands are:

- `npm run dev`: Vite dev server
- `npm run build`: production build to `dist/`
- `npx vitest run`: run all tests once
- `npx vitest run path/to/file.test.js` or `npx vitest run -t "test name"`: run a single test

## Architecture guidance

Keep the pure logic separate from the DOM so Vitest can test it without a browser:

- **Grade logic** (pure functions): validation, 10-point → letter → 4-point conversion (F2), GPA and classification (F3).
- **Storage**: localStorage under the key `"gpa-tracker:v1"`. If stored data is corrupt or unreadable, start with an empty list and never crash the page.
- **UI**: form, table, summary, and Edit/Delete/"Delete all" actions. Delete and "Delete all" require confirmation.

Domain rules that are easy to get wrong (see `PRD.md` for the full rules):

- The grade input accepts both `8,5` and `8.5`. Round the grade to 1 decimal **before** converting it, because the conversion bands have gaps (e.g. 8.4 → B+, 8.5 → A).
- GPA values are rounded to 2 decimals. Classification is based on the 4-point GPA.
- "Tín chỉ đạt" (passed credits) counts only courses with a 10-point grade ≥ 4.0.
- When there are no courses, show "—" and the hint "Hãy thêm môn học đầu tiên".
- All UI text and error messages are in Vietnamese. Show each error directly under its input field.
- The layout must work on screens 360px wide and up.

## Git workflow

The custom slash commands in `.claude/commands/` define the git workflow: `/git-branch`, `/commit`, `/merge`, `/push` (confirm before pushing to main), `/pull`, `/wrap-up`, `/learn-by-mistake` (logs mistakes and fixes in `common_errors.md`). `/wrap-up` keeps the "Project structure" section below up to date.

## Project structure

- `PRD.md`: product requirements (Vietnamese)
- `plan.md`: Waterfall project plan
- `status.md`: project status, technical decisions, change log
- `docs/`: design documents (Mermaid flowcharts), created in phase 2
- `.claude/commands/`: custom slash commands for the git workflow
