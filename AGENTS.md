# Agent safety and UI rules

## Brand and UI

Every new page or component MUST follow `DESIGN_SYSTEM.md` and import/use `css/tokens.css`. Reuse existing components and responsive breakpoints. Generic default styling, arbitrary brand colors, arbitrary spacing, unbranded typography, and one-off shadows/radii are forbidden.

## Safety guardrails

- Never run destructive commands, force pushes, database migrations, table drops, or production mutations automatically.
- Never delete files or rewrite large collections without a dry-run preview and explicit human approval.
- Schema changes, migrations, file deletions, and write-heavy scripts must first produce a reviewable migration/dry-run artifact and pause for approval.
- CI may lint, type-check, test, and report; it must not deploy or mutate production.
- Do not commit secrets, credentials, real customer data, or invented legal/business claims.

## Verification

Run `npm test` before handoff. New form behavior must include edge cases such as plus-sign email aliases. Changes to compliance behavior must include consent, unsubscribe, access, and deletion tests.
