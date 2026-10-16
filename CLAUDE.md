# CLAUDE.md

Guidance for Claude Code when working in this project.

## Project

Dovetail-9: an interactive sci-fi narrative told through an in-universe web terminal (Nashiro Dynamics' SIGMA station OS). Current phase is **worldbuilding**, not site development.

- `canon.md`: settled facts and open questions. Wins any conflict with other files.
- `lore/`: private, out-of-universe notes for the writer. Never shown on the site.
- `documents/` (future): in-universe files the reader finds on the terminal.

## Consistency rule

Before recording any answer or new idea, check it against `canon.md` and every relevant `lore/` file, especially `lore/phase-mechanics.md`. If it contradicts an existing rule or fact, **flag the conflict and propose a resolution before writing it down**. Never silently record a contradiction.

Physics is pseudo-science with consistent rules: invented is fine, inconsistent is not.

## Interview style

When developing lore with the user, ask **one question at a time**, yes/no where possible. Offer a recommendation when asked "what do you think".

## Frontmatter

Wiki links in YAML frontmatter must be quoted, one per line, or GitHub fails to parse it:

    related:
      - "[[phase-mechanics]]"

## Writing

- Use plain language when explaining.
- No em dashes in site copy or lore; use commas or periods.
