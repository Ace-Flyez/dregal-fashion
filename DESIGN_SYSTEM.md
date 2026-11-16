# D’REGAL design system

This specification is the source of truth for new pages and components. Do not introduce generic browser defaults or one-off visual values.

## Brand tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ds-color-ink` | `#111113` | Primary text, dark actions |
| `--ds-color-charcoal` | `#1e293b` | Secondary dark text |
| `--ds-color-muted` | `#6b7280` | Supporting text |
| `--ds-color-line` | `rgba(17,17,19,.12)` | Dividers and borders |
| `--ds-color-paper` | `#f8f7f5` | Page background |
| `--ds-color-white` | `#fff` | Cards and inverse surfaces |
| `--ds-color-purple` | `#a855f7` | Accent, active states |
| `--ds-color-purple-deep` | `#7e22ce` | Accent hover state |
| `--ds-font-body` | `Inter, Arial, sans-serif` | Body, controls, navigation |
| `--ds-font-display` | `Krona One, sans-serif` | Headings and wordmark |
| `--ds-page` | `min(1320px, calc(100% - clamp(32px, 8vw, 144px)))` | Content width |
| `--ds-section` | `clamp(76px, 9vw, 144px)` | Major vertical rhythm |
| `--ds-radius-sm` | `12px` | Small controls |
| `--ds-radius-md` | `18px` | Cards |
| `--ds-radius-lg` | `20px` | Panels |
| `--ds-radius-pill` | `999px` | Pills and buttons |
| `--ds-shadow-card` | `0 10px 30px -10px rgba(0,0,0,.08)` | Product cards |
| `--ds-shadow-drawer` | `-20px 0 60px rgba(0,0,0,.12)` | Cart drawer |

## Spacing scale

Use the 4px base scale: `4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 76, 80, 100, 120, 144px`. Prefer existing layout tokens and `clamp()` for responsive spacing.

## Typography

Body is 15px with 1.65 line-height. Eyebrows use 10px, 700 weight, uppercase, and `.16em` tracking. Controls use 10–11px, 700 weight. Display headings use `Krona One`, tight letter spacing (`-.06em` to `-.08em`), and responsive `clamp()` sizes.

## Component conventions

- Use `.wrap` for page width and `.button` for actions.
- Use `.eyebrow`, `.text-link`, `.shop-toolbar`, `.filter-pills`, `.filter-menu`, `.product-card`, and `.shop-note` before creating new variants.
- Use `var(--ink)`, `var(--paper)`, `var(--line)`, `var(--purple)`, and the token aliases in `css/tokens.css`; do not hard-code brand colors.
- All interactive elements need visible focus states, accessible names, and responsive behavior at 1100px, 900px, 760px, 560px, and 380px.
- No generic default `button`, `input`, heading, link, card, shadow, radius, or spacing styling in new UI.

## Responsive rules

Desktop uses the full toolbar and three-column product grid. Laptop widths keep controls on one row where space permits. Tablet widths use a two-row toolbar. Phones use compact controls, a two-column product grid, and the mobile navigation.

